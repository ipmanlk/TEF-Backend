/* 
=====================================================================================
DOTENV: Load settings from .env to process.env (see sample.env)
=====================================================================================
*/

require("dotenv").config();

/* 
=====================================================================================
Libraries
=====================================================================================
*/

// Libraries: 3rd Party
import { createConnection } from "typeorm";
import * as express from "express";
import * as session from "express-session";
import * as ejs from "ejs";
/* 
=====================================================================================
Controllers
=====================================================================================
*/

import {
	AuthController,
	EmployeeController,
	DesignationController,
	EmployeeStatusController,
	UserController,
	PrivilegeController,
	GeneralController,
	RoleController,
	ProfileController,
	CustomerController,
	MaterialController,
	ProductController,
	ProductPackageController,
	SupplierController,
	SupplierMaterialController,
	MaterialAnalysisController,
	QuotationRequestController,
	QuotationController,
	MaterialInventoryController,
	PurchaseOrderController,
	GrnController,
	SupplierPaymentController,
	CustomerOrderController,
	CustomerInvoiceController,
	ProductionOrderController,
	ProductionInventoryController,
	ReportController,
	SummeryController,
	ProductPackageCostAnalysisController,
	EmailController,
	SMSController,
	PasswordResetController,
} from "./controller";

/* 
=====================================================================================
Utilities
=====================================================================================
*/

import { RegexPatternUtil } from "./util/RegexPatternUtil";

/* 
=====================================================================================
TypeORM
=====================================================================================
*/

// TypeORM: Create connection to the detabase
createConnection()
	.then(() => {
		console.log("SUCESS: Database connected.");
	})
	.catch((error) => {
		console.log("ERROR: Database  connection failed.");
		throw Error(error);
	});

/* 
=====================================================================================
Express.js
=====================================================================================
*/

// method used for checking permissions
const isAuthorized = AuthController.isAuthorized;

// Express.js: Initialize
const app = express();

// Express.js: Parse json request bodies
app.use(
	express.json({
		limit: "8000kb",
	})
);

// Express.js: Sessions for login
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
	})
);

// Changes for the development enviroment
if (process.env.PRODUCTION == "false") {
	// enable CORS
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		next();
	});

	// dummy session data
	app.use((req, res, next) => {
		req.session.data = {
			username: "admin",
			logged: true,
			userRoles: [{ roleId: 1 }, { roleId: 2 }],
			userId: 1,
			employeeId: 1,
		};
		next();
	});
}

// Express.js: Folder with static HTML files to server the user
app.use("/", express.static(`${__dirname}/../../public`));

/* 
=====================================================================================
Routes
=====================================================================================
*/

// Routes: Authentication Routes
app.route("/api/login").post((req, res) => {
	AuthController.logIn(req.session, req.body.data)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/logout").get((req, res) => {
	AuthController.logOut(req.session)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

// routes for resetting the password
app.route("/api/password_reset/start").post((req, res) => {
	PasswordResetController.startPasswordReset(req.body.username)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/password_reset/verify").post((req, res) => {
	PasswordResetController.verifyPasswordResetCode(
		req.body.username,
		parseInt(req.body.verifyCode)
	)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/password_reset/reset").post((req, res) => {
	PasswordResetController.resetPassword(
		req.body.username,
		parseInt(req.body.verifyCode),
		req.body.password
	)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

// Routes: Profile
app
	.route("/api/profile")
	.all((req, res, next) => {
		isAuthorized(req)
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProfileController.getOne(req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app.route("/api/profile/password").put((req, res) => {
	ProfileController.updatePassword(req.body.data, req.session)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

// Routes:  Employee Routes
app
	.route("/api/employees")
	.all((req, res, next) => {
		isAuthorized(req, false, "EMPLOYEE")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		EmployeeController.save(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		EmployeeController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		EmployeeController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		EmployeeController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: User Routes
app
	.route("/api/users")
	.all((req, res, next) => {
		isAuthorized(req, false, "USER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		UserController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		UserController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		UserController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		UserController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Designation
app
	.route("/api/designations")
	.all((req, res, next) => {
		isAuthorized(req, false, "DESIGNATION")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		DesignationController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		DesignationController.save(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		DesignationController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		DesignationController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Employee Status
app
	.route("/api/employee_statuses")
	.all((req, res, next) => {
		isAuthorized(req, false, "EMPLOYEE_STATUS")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		EmployeeStatusController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		EmployeeStatusController.save(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		EmployeeStatusController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		EmployeeStatusController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Roles
app
	.route("/api/roles")
	.all((req, res, next) => {
		isAuthorized(req, false, "ROLE")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		RoleController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		RoleController.save(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		RoleController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		RoleController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Customer
app
	.route("/api/customers")
	.all((req, res, next) => {
		isAuthorized(req, false, "CUSTOMER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		CustomerController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		CustomerController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		CustomerController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		CustomerController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Privileges
app
	.route("/api/privileges")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRIVILEGE")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		PrivilegeController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		PrivilegeController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Materials
app
	.route("/api/materials")
	.all((req, res, next) => {
		isAuthorized(req, false, "MATERIAL")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		MaterialController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		MaterialController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		MaterialController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		MaterialController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Products
app
	.route("/api/products")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCT")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		ProductController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		ProductController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		ProductController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Product packages
app
	.route("/api/product_packages")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCT_PACKAGE")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductPackageController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		ProductPackageController.save(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		ProductPackageController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		ProductPackageController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Suppliers
app
	.route("/api/suppliers")
	.all((req, res, next) => {
		isAuthorized(req, false, "SUPPLIER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		SupplierController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		SupplierController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		SupplierController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		SupplierController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Supplier Materials
app
	.route("/api/supplier_materials")
	.all((req, res, next) => {
		isAuthorized(req, false, "SUPPLIER_MATERIAL")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		SupplierMaterialController.getMaterials(parseInt(req.query.data.supplierId))
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		SupplierMaterialController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Material Analysis
app
	.route("/api/material_analysis")
	.all((req, res, next) => {
		isAuthorized(req, false, "MATERIAL_ANALYSIS")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		MaterialAnalysisController.getOne(parseInt(req.query.data.productId))
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		MaterialAnalysisController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Quotation Requests
app
	.route("/api/quotation_requests")
	.all((req, res, next) => {
		isAuthorized(req, false, "QUOTATION_REQUEST")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		QuotationRequestController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		QuotationRequestController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		QuotationRequestController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		QuotationRequestController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/supplier_quotation_requests")
	.all((req, res, next) => {
		isAuthorized(req, false, "QUOTATION_REQUEST")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		QuotationRequestController.getSupplierRequests(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Quotations
app
	.route("/api/quotations")
	.all((req, res, next) => {
		isAuthorized(req, false, "QUOTATION")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		QuotationController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		QuotationController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		QuotationController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		QuotationController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/supplier_quotations")
	.all((req, res, next) => {
		isAuthorized(req, false, "QUOTATION")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		QuotationController.getSupplierQuotations(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Purchase Order
app
	.route("/api/purchase_orders")
	.all((req, res, next) => {
		isAuthorized(req, false, "PURCHASE_ORDER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		PurchaseOrderController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		PurchaseOrderController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		PurchaseOrderController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		PurchaseOrderController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/supplier_purchase_orders")
	.all((req, res, next) => {
		isAuthorized(req, false, "PURCHASE_ORDER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		PurchaseOrderController.getSupplierPurchaseOrders(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Material inventory
app
	.route("/api/material_inventory")
	.all((req, res, next) => {
		isAuthorized(req, false, "MATERIAL_INVENTORY")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		MaterialInventoryController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: GRN
app
	.route("/api/grns")
	.all((req, res, next) => {
		isAuthorized(req, false, "GRN")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		GrnController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		GrnController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		GrnController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		GrnController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/supplier_grns")
	.all((req, res, next) => {
		isAuthorized(req, false, "GRN")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		GrnController.getSupplierGrns(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Supplier payments
app
	.route("/api/supplier_payments")
	.all((req, res, next) => {
		isAuthorized(req, false, "SUPPLIER_PAYMENT")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		SupplierPaymentController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		SupplierPaymentController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		SupplierPaymentController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		SupplierPaymentController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: customer order
app
	.route("/api/customer_orders")
	.all((req, res, next) => {
		isAuthorized(req, false, "CUSTOMER_ORDER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		CustomerOrderController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		CustomerOrderController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		CustomerOrderController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		CustomerOrderController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: customer invoice
app
	.route("/api/customer_invoices")
	.all((req, res, next) => {
		isAuthorized(req, false, "CUSTOMER_INVOICE")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		CustomerInvoiceController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		CustomerInvoiceController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		CustomerInvoiceController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		CustomerInvoiceController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: production orders
app
	.route("/api/production_orders")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCTION_ORDER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductionOrderController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		ProductionOrderController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		ProductionOrderController.update(req.body.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.delete((req, res) => {
		ProductionOrderController.delete(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/production_orders_by_status")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCTION_ORDER")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductionOrderController.getProductionOrdersByStatus(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/production_orders_confirm")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCTION_ORDER_CONFIRM")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		ProductionOrderController.confirmOrder(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Production inventory
app
	.route("/api/production_inventory")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCTION_INVENTORY")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductionInventoryController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		ProductionInventoryController.save(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Product package cost analysis
app
	.route("/api/product_package_cost_analysis")
	.all((req, res, next) => {
		isAuthorized(req, false, "PRODUCT_PACKAGE_COST_ANALYSIS")
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		ProductPackageCostAnalysisController.getOne(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	})

	.put((req, res) => {
		ProductPackageCostAnalysisController.update(req.body.data, req.session)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: Reports
app.route("/api/reports/sales").get((req, res) => {
	ReportController.getSalesReport(req.query.data)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/reports/demand").get((req, res) => {
	ReportController.getDemandReport(req.query.data)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/reports/production_cost").get((req, res) => {
	ReportController.getProductionCostReport(req.query.data)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

app.route("/api/reports/revenue").get((req, res) => {
	ReportController.getRevenueReport(req.query.data)
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

// Routes: Summery
app.route("/api/summery/dashboard").get((req, res) => {
	SummeryController.getDashboardSummery()
		.then((r) => res.json(r))
		.catch((e) => sendErrors(res, e));
});

// Routes: Misc Routes
app
	.route("/api/regexes")
	.all((req, res, next) => {
		isAuthorized(req)
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		RegexPatternUtil.getModuleRegex(req.query.data.module)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/general")
	.all((req, res, next) => {
		isAuthorized(req)
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.get((req, res) => {
		GeneralController.get(req.query.data)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/mailer")
	.all((req, res, next) => {
		isAuthorized(req)
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		EmailController.sendMail(
			req.body.receivers,
			req.body.subject,
			req.body.text,
			req.body.html,
			[]
		)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

app
	.route("/api/sms")
	.all((req, res, next) => {
		isAuthorized(req)
			.then(() => {
				next();
			})
			.catch((e) => sendErrors(res, e));
	})

	.post((req, res) => {
		SMSController.sendSMS(req.body.receiver, req.body.message)
			.then((r) => res.json(r))
			.catch((e) => sendErrors(res, e));
	});

// Routes: template based pdf generation
app.post("/generate_printout", (req, res) => {
	ejs.renderFile(
		`${__dirname}/template/${req.body.templateName}.ejs`,
		{ data: req.body.data },
		(err, data) => {
			if (err) {
				console.log(err);
				res.send(err);
			} else {
				res.send(data);
			}
		}
	);
});

// send errors to the client
const sendErrors = (res, e) => {
	console.log("Error:", e);
	res.json(e);
};

// Express.js: Start the server
app.listen(process.env.PORT, () =>
	console.log(`Server is running on ${process.env.PORT}!`)
);
