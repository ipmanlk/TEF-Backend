import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { CustomerOrder } from "../entity/CustomerOrder";
import { CustomerOrderStatus } from "../entity/CustomerOrderStatus";
import { CustomerInvoice } from "../entity/CustomerInvoice";
import { CustomerInvoiceProductPackage } from "../entity/CustomerInvoiceProductPackage";
import { CustomerInvoiceStatus } from "../entity/CustomerInvoiceStatus";
import { CustomerInvoiceDao } from "../dao/CustomerInvoiceDao";
import { MiscUtil } from "../util/MiscUtil";

export class CustomerInvoiceController {

  static async get(data) {
    if (data !== undefined && data.id) {
      return this.getOne(data);
    } else {
      return this.search(data);
    }
  }

  private static async getOne({ id }) {
    // search for an entry with given id
    const entry = await CustomerInvoiceDao.getOne(id).catch(e => {
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
    const entries = await CustomerInvoiceDao.search(data).catch(e => {
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
    const lastEntry = await getRepository(CustomerInvoice).findOne({
      select: ["id", "code"],
      order: { id: "DESC" }
    });

    if (lastEntry) {
      data.code = MiscUtil.getNextNumber("CUI", lastEntry.code, 5);
    } else {
      data.code = MiscUtil.getNextNumber("CUI", undefined, 5);
    }

    // create a customer invoice object
    const customerInvoice = data as CustomerInvoice;

    // set created employee
    customerInvoice.employeeId = session.data.employeeId;


    try {
      let customerOrder;
      if (customerInvoice.customerOrderId) {
        customerOrder = await getRepository(CustomerOrder).findOne({
          where: { id: customerInvoice.customerOrderId },
          relations: ["customer"]
        })

        // TODO: check customer toBePaid with customer maximum arreas amount when it's added
      }

      // save entry
      const entry = await getRepository(CustomerInvoice).save(customerInvoice);

      // set empty array for product packages
      const customerInvoiceProductPackages = [];

      data.productPackages.forEach(pkg => {
        const customerInvoiceProductPackage = new CustomerInvoiceProductPackage();
        customerInvoiceProductPackage.customerInvoiceId = entry.id;
        customerInvoiceProductPackage.productPackageId = pkg.productPackageId;
        customerInvoiceProductPackage.requestedQty = pkg.requestedQty;
        customerInvoiceProductPackage.deliveredQty = pkg.deliveredQty;
        customerInvoiceProductPackage.salePrice = pkg.salePrice;
        customerInvoiceProductPackage.lineTotal = pkg.lineTotal;
        customerInvoiceProductPackages.push(customerInvoiceProductPackage);
      });

      // save customer invoice product pkgs
      await getRepository(CustomerInvoiceProductPackage).save(customerInvoiceProductPackages);

      // if this is a customer order
      if (customerOrder) {
        // update customer arreass
        const customer = customerOrder.customer;
        customer.toBePaid = entry.balance;
        await getRepository(Customer).save(customer);

        // complete customer order
        const completedStatus = await getRepository(CustomerOrderStatus).findOne({ where: { name: "Completed" } });

        customerOrder.customerOrderStatus = completedStatus;
        await getRepository(CustomerOrder).save(customerOrder);
      }


      // send success response
      return {
        status: true,
        data: { code: entry.code },
        msg: "Customer invoice has been added!"
      };

    } catch (e) {
      console.log(e.code, e);

      if (e.code == "ER_DUP_ENTRY") {
        throw {
          status: false,
          type: "input",
          msg: "Invoice already exists for that customer order!."
        }
      }

      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    }
  }

  static async update(data) {
    // check if an entry is present with given id
    const selectedEntry = await getRepository(CustomerInvoice).findOne(data.id).catch(e => {
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

    const editedEntry = data as CustomerInvoice;

    try {
      // remove existing customer invoice product packages
      await getRepository(CustomerInvoiceProductPackage).createQueryBuilder()
        .delete()
        .where("customerInvoiceId = :id", { id: editedEntry.id })
        .execute();

      // update invoice
      await getRepository(CustomerInvoice).save(editedEntry);
      // set empty array for product packages
      const customerInvoiceProductPackages = [];

      data.productPackages.forEach(pkg => {
        const customerInvoiceProductPackage = new CustomerInvoiceProductPackage();
        customerInvoiceProductPackage.customerInvoiceId = editedEntry.id;
        customerInvoiceProductPackage.productPackageId = pkg.productPackageId;
        customerInvoiceProductPackage.requestedQty = pkg.requestedQty;
        customerInvoiceProductPackage.deliveredQty = pkg.deliveredQty;
        customerInvoiceProductPackage.salePrice = pkg.salePrice;
        customerInvoiceProductPackage.lineTotal = pkg.lineTotal;
        customerInvoiceProductPackages.push(customerInvoiceProductPackage);
      });

      // save customer invoice product pkgs
      await getRepository(CustomerInvoiceProductPackage).save(customerInvoiceProductPackages);


    } catch (e) {
      console.log(e.code, e);
      throw e;
    }

    return {
      status: true,
      msg: "Customer invoice has been updated!."
    }
  }

  static async delete({ id }) {
    // find entry with the given id
    const entry = await getRepository(CustomerInvoice).findOne({ id: id }).catch(e => {
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
    const deletedStatus = await getRepository(CustomerInvoiceStatus).findOne({ name: "Deleted" }).catch(e => {
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
    entry.customerInvoiceStatus = deletedStatus;

    await getRepository(CustomerInvoice).save(entry).catch(e => {
      console.log(e.code, e);
      throw {
        status: false,
        type: "server",
        msg: "Server Error!. Please check logs."
      }
    });

    return {
      status: true,
      msg: "That customer invoice has been deleted!"
    };
  }

}