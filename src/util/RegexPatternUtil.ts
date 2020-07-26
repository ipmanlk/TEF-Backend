import { existsSync } from "fs";

export class RegexPatternUtil {
    static async getModuleRegex(module: String) {
        // check if module is provided
        if (!module) {
            throw {
                status: false,
                type: "input",
                msg: "Please provide a module name."
            }
        }

        // check if module is valid
        if (!existsSync(`${__dirname}/RegexPatterns/${module}.json`)) {
            throw {
                status: false,
                type: "input",
                msg: "Module not found."
            }
        }

        try {
            let regexJson = require(`${__dirname}/RegexPatterns/${module}.json`);
            let regex = regexJson.map(rx => {
                let regexString = rx.regex.toString();
                let fixedRegexString = regexString.substring(1, regexString.length - 1);
                let vi = {
                    regex: fixedRegexString,
                    attribute: rx.attribute,
                    error: rx.error
                };
                if (rx.optional) vi["optional"] = true;
                if (rx.base64) vi["base64"] = true;
                return vi;
            });
            return {
                status: true,
                data: regex
            };

        } catch (e) {            
            console.log(e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Unable to parse the requested regex file. Please check logs."
            }
        }
    }
}