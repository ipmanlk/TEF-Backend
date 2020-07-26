import { getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { CustomerDao } from "../dao/CustomerDao";
import { ValidationUtil } from "../util/ValidationUtil";

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

        // save to db
        await getRepository(Customer).save(data).catch(e => {
            console.log(e.code, e);

            if (e.code == "ER_DUP_ENTRY") {
                throw {
                    status: false,
                    type: "input",
                    msg: "Entry with that employee number already exists!."
                }
            }
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That customer has been added!"
        };
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
        await getRepository(Customer).save(editedCustomer).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That customer has been updated!"
        };
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
                msg: "That employee doesn't exist in our database!."
            }
        }

        // delete the customer (make inactive)
        customer.customerStatusId = 3;

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
}