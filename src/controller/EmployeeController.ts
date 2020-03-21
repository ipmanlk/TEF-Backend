import { getManager, getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

class EmployeeController {
    static async getOne({ number }) {
        try {
            // search for an employee with given employee number
            const employee = await getRepository(Employee).find({
                number: number
            })

            // check if employee exists
            if (employee !== undefined) {
                return {
                    status: true,
                    data: employee
                };
            } else {
                throw {
                    status: false,
                    type: "input",
                    msg: "Unable to find an employee with that employee number."
                };
            }

        } catch (error) {
            console.log(error);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        }
    }

    static async getAll() {
        try {
            // get all employees
            const employees = await getManager().find(Employee);

            return {
                status: true,
                data: employees
            };
        } catch (error) {
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        }
    }
}

export default EmployeeController;