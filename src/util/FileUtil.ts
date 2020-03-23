import { readFileSync } from "fs";

class FileUtil {
    static async readFile(path) {
        try {
            return readFileSync(path) as Buffer;
        } catch (e) {
			console.log(e);
			throw {
				status: false,
				type: "server",
				msg: "Server Error!. Please check logs."
			}
        }
    }
}

export default FileUtil;