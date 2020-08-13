import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { CustomerDao } from "../dao/CustomerDao";
import { ValidationUtil } from "../util/ValidationUtil";
import { CustomerStatus } from "../entity/CustomerStatus";

export class CustomerController {
    static async get(data) {
        if (data !== undefined && data.id) {
            return this.getOne(data);
        } else {
            return this.search(data);
        }
    }

    private static async getOne({ id }) {

        // search for an employee with given employee id
        const customer = await getRepository(Customer).findOne({
            id: id
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // check if employee exists
        if (customer !== undefined) {
            return {
                status: true,
                data: customer
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find an employee with that employee number."
            };
        }
    }

    private static async search(data = {}) {
        const employees = await CustomerDao.search(data).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: employees
        };
    }

    static async save(data, session) {
        // check if valid data is given
        await ValidationUtil.validate("CUSTOMER", data);

        // add employee id of the current session as created employee
        data.employeeId = session.data.employeeId;

        // generate customer number
        const lastCustomer = await getRepository(Customer).findOne({
            select: ["id", "number"],
            order: { id: "DESC" }
        });

        const lastCustomerNumber = lastCustomer ? parseInt(lastCustomer.number.substring(7)) : 0;
        const currentYear = new Date().getFullYear();
        const lastCustomerYear = lastCustomer ? parseInt(lastCustomer.number.substring(3, 7)) : currentYear;

        let newCustomerNumber;

        // conver to 5 digit
        function padToFive(number) {
            if (number <= 99999) { number = ("0000" + number).slice(-5); }
            return number;
        }

        // check to set customer number back to 00000 when new year arrives
        if (currentYear == lastCustomerYear + 1) {
            newCustomerNumber = `CUS${currentYear}00000`;
        } else {
            newCustomerNumber = `CUS${currentYear}${padToFive(lastCustomerNumber + 1)}`;
        }

        // set number for new customer
        data.number = newCustomerNumber;

        try {
            const newCustomer = await getRepository(Customer).save(data);

            return {
                status: true,
                data: { number: newCustomer.number },
                msg: "That customer has been added!"
            };

        } catch (e) {
            console.log(e.code, e);

            if (e.code == "ER_DUP_ENTRY") {
                const msg = await this.getDuplicateErrorMsg(e, data as Customer)

                throw {
                    status: false,
                    type: "input",
                    msg: msg
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
        // check if valid data is given
        await ValidationUtil.validate("CUSTOMER", data);

        // create employee object
        const editedCustomer = data as Customer;

        // check if employee is present with the given id
        const selectedCustomer = await getRepository(Customer).findOne(editedCustomer.id).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!selectedCustomer) {
            throw {
                status: false,
                type: "input",
                msg: "That customer doesn't exist in our database!."
            }
        }

        // update the customer
        try {
            await getRepository(Customer).save(editedCustomer);
            return {
                status: true,
                msg: "That customer has been updated!"
            };

        } catch (e) {
            console.log(e.code, e);

            // check for duplicate entry
            if (e.code == "ER_DUP_ENTRY") {
                const msg = await this.getDuplicateErrorMsg(e, editedCustomer);

                throw {
                    status: false,
                    type: "input",
                    msg: msg
                }
            }

            // server error handling
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }

    static async delete({ id }) {
        // find customer with the given id
        const customer = await getRepository(Customer).findOne({ id: id }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!customer) {
            throw {
                status: false,
                type: "input",
                msg: "That customer doesn't exist in our database!."
            }
        }


        // find deleted status
        const deletedStatus = await getRepository(CustomerStatus).findOne({ name: "Deleted" }).catch(e => {
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

        // delete the employee (make inactive)
        customer.customerStatus = deletedStatus;

        await getRepository(Customer).save(customer).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That customer has been deleted!"
        };
    }

    private static async getDuplicateErrorMsg(error, customer: Customer) {
        // check if which unique field is violated
        let msg, field, duplicateEntry;

        if (error.sqlMessage.includes("nic_UNIQUE")) {
            field = "nic";
            msg = "NIC already exists!"

        } else if (error.sqlMessage.includes("cmobile_UNIQUE")) {
            field = "cmobile";
            msg = "contact number already exists!"

        } else if (error.sqlMessage.includes("email_UNIQUE")) {
            field = "email";
            msg = "email already exists!"

        } else if (error.sqlMessage.includes("cpmobile_UNIQUE")) {
            field = "cpmobile";
            msg = "company contact number already exists!"

        } else {
            return "Customer with same information already exists!";
        }

        // get duplicated entry
        duplicateEntry = await getRepository(Customer).findOne({
            select: ["id", "number"],
            where: { field: customer[field] }
        }).catch(e => {
            console.log(e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return `Customer (ID: ${duplicateEntry.number}) with the same ${msg}`;
    }
}