import { getManager } from "typeorm";
import { Gender } from "../entity/Gender";

class GenderController {
    static async getAll() {
        const genders = await getManager().find(Gender).catch(e => {
            console.log(e.code, e);
            throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			};
        });

        return {
			status: true,
			data: genders
		};
    }
}

export default GenderController;