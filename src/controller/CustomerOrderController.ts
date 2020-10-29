import { getRepository } from "typeorm";
import { CustomerOrder } from "../entity/CustomerOrder";
import { CustomerOrderProductPackage } from "../entity/CustomerOrderProductPackage";
import { CustomerOrderStatus } from "../entity/CustomerOrderStatus";
import { CustomerOrderDao } from "../dao/CustomerOrderDao";
import { MiscUtil } from "../util/MiscUtil";

export class CustomerOrderController {

  static async get(data) {
    if (data !== undefined && data.id) { // request for a single entry
      return this.getOne(data);
    } else if (data.customerId && data.customerOrderStatusName) { // request for orders belong to a single customer
      return this.getCustomerOrders(data);
    } else { // else, run a search
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await CustomerOrderDao.getOne(id).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      };
    });

    // check if entry exists
    if (entry !== undefined) {
      // remove useless elements
      entry["createdEmployee"] = `${entry.employee.callingName} (${entry.employee.number})`;
      delete entry.employee;

      return {
        status: true,
        data: entry
      };
    } else {
      throw {
        status: false,
        type: "input",
        msg: "Unable to find an entry with that id."
      };
    }
  }

  private static async search(data = {}) {
    const entries = await CustomerOrderDao.search(data).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      data: entries
    };
  }

  static async save(data, session) {

    // create purchase order code
    const lastEntry = await getRepository(CustomerOrder).findOne({
      select: ["id", "cocode"],
      order: { id: "DESC" }
    });

    if (lastEntry) {
      data.cocode = MiscUtil.getNextNumber("CUO", lastEntry.cocode, 5);
    } else {
      data.cocode = MiscUtil.getNextNumber("CUO", undefined, 5);
    }

    // create a customer order object
    const customer_order = data as CustomerOrder;

    // set created employee
    customer_order.employeeId = session.data.employeeId;


    try {
      // save entry
      const entry = await getRepository(CustomerOrder).save(customer_order);

      // set empty array for customer order product packages
      const customerOrderProductPackages = [];

      data.customerOrderProductPackages.forEach(pkg => {
        const customerOrderProductPackage = new CustomerOrderProductPackage();
        customerOrderProductPackage.customerOrderId = entry.id;
        customerOrderProductPackage.productPackageId = pkg.productPackageId;
        customerOrderProductPackage.qty = pkg.qty;
        customerOrderProductPackage.salePrice = pkg.salePrice;
        customerOrderProductPackage.lineTotal = pkg.lineTotal;
        customerOrderProductPackages.push(customerOrderProductPackage)
      });

      // save customer order product packages
      await getRepository(CustomerOrderProductPackage).save(customerOrderProductPackages);


      // send success response
      return {
        status: true,
        data: { pocode: entry.cocode },
        msg: "Customer order has been created!"
      };

    } catch (e) {
      console.log(e.code, e);

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    }
  }

  static async update(data) {
    // check if an entry is present with given id
    const selectedEntry = await getRepository(CustomerOrder).findOne(data.id).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    if (!selectedEntry) {
      throw {
        status: false,
        type: "input",
        msg: "That entry doesn't exist in our database!."
      }
    }

    const editedEntry = data as CustomerOrder;

    try {
      // remove existing customer order product packges
      await getRepository(CustomerOrderProductPackage).createQueryBuilder()
        .delete()
        .where("customerOrderId = :id", { id: editedEntry.id })
        .execute();

      // customer order
      await getRepository(CustomerOrder).save(editedEntry);

      // set empty array for purchase order materials
      const customerOrderProductPackages = [];

      data.customerOrderProductPackages.forEach(pkg => {
        const customerOrderProductPackage = new CustomerOrderProductPackage();
        customerOrderProductPackage.customerOrderId = editedEntry.id;
        customerOrderProductPackage.productPackageId = pkg.productPackageId;
        customerOrderProductPackage.qty = pkg.qty;
        customerOrderProductPackage.salePrice = pkg.salePrice;
        customerOrderProductPackage.lineTotal = pkg.lineTotal;
      });

      // save customer order product packages
      await getRepository(CustomerOrderProductPackage).save(customerOrderProductPackages)

    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "Customer order has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(CustomerOrder).findOne({ id: id }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    if (!entry) {
      throw {
        status: false,
        type: "input",
        msg: "That entry doesn't exist in our database!."
      }
    }

    // find deleted status
    const deletedStatus = await getRepository(CustomerOrderStatus).findOne({ name: "Deleted" }).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    // if there is no status called deleted
    if (!deletedStatus) {
      throw {
        status: false,
        type: "server",
        msg: "Deleted status doesn't exist in the database!."
      }
    }

    // set status to delete
    entry.customerOrderStatus = deletedStatus;

    await getRepository(CustomerOrder).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That customer order has been deleted!"
    };
  }

  // find customer orders belong to a single customer
  private static async getCustomerOrders({ customerId, customerOrderStatusName }) {
    let entires = await CustomerOrderDao.getCustomerOrders(customerId, customerOrderStatusName).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      data: entires,
      status: true
    };
  }

}