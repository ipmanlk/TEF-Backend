import { readFileSync, statSync } from "fs";

export class FileUtil {
    static async readFileAsBuffer(path) {
        try {
            let fileContent = readFileSync(path);
            return (fileContent as Buffer);
        } catch (e) {
            console.log(e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }

    static async getFileSize(path, unit) {
        try {
            const stats = statSync(path);
            const fileSizeInBytes = stats["size"];
            const unitSizes = { Byte: 1, KB: 1024, MB: 1048576, GB: 1073741824 };
            return fileSizeInBytes / unitSizes[unit];
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