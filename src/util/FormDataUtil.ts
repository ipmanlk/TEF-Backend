import * as formidable from "formidable";

class FormDataUtil {
    static parseFromData = (req) => {
        return new Promise((resolve, reject) => {
            const form = formidable({ multiples: true });
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err);
                    reject({
                        status: false,
                        type: "server",
                        msg: "Server Error!. Please check logs."
                    });
                }

                resolve({ ...fields, ...files });
            });
        });
    }
}

export default FormDataUtil;