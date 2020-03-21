import { getManager, getRepository } from "typeorm";
import { Employee } from "../entity/Employee";

class EmployeeController {
    public static getOne({ number }) {
        return new Promise(async (resolve, reject) => {
            try {
                // search for an employee with given employee number
                const employee = await getRepository(Employee).find({
                    number: number
                })

                // check if employee exists
                if (employee !== undefined) {
                    resolve({
                        status: true,
                        data: employee
                    });
                } else {
                    reject({
                        status: false,
                        type: "input",
                        msg: "Unable to find an employee with that employee number."
                    });
                }

            } catch (error) {
                reject({
                    status: false,
                    type: "server",
                    msg: "Server Error!. Please check logs."
                });
            }
        });
    }

    public static getAll() {
        return new Promise(async (resolve, reject) => {
            try {
                // get all employees
                const employees = await getManager().find(Employee);

                resolve({
                    status: true,
                    data: employees
                });
            } catch (error) {
                reject({
                    status: false,
                    type: "server",
                    msg: "Server Error!. Please check logs."
                });
            }
        });
    }
}

export default EmployeeController;