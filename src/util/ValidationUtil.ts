import { RegexPatternUtil } from "./RegexPatternUtil";

export class ValidationUtil {
    static async validate(moduleName: String, dataObj: any) {
        // load validation info (regexes)
        const validationInfo = await RegexPatternUtil.getModuleRegex(moduleName);
        const validationInfoObj = {};

        validationInfo.data.forEach(vi => {
            validationInfoObj[vi.attribute] = vi;
        });

        const attributes = Object.keys(validationInfoObj);

        attributes.forEach(attribute => {
            // get the value for given attribute
            let dataValue = dataObj[attribute];

            // if data vlue is not given
            if (!dataValue) return;
            
            // check if the data contains base64 string
            if (validationInfoObj[attribute].base64) {                                
                if (typeof dataValue === "string" || Buffer.isBuffer(dataValue)) {                    
                    return;
                }
            }

            dataValue = dataValue.toString();

            // check if value is optional and not provided
            if (dataValue.trim() == "" && dataObj[attribute].optional) {
                return;
            }

            // if not, test values with regexes
            const regex = new RegExp(validationInfoObj[attribute].regex);

            // if input data value is invalid, throw an error
            if (!regex.test(dataValue)) {
                throw {
                    status: false,
                    type: "input",
                    msg: `Invalid data provided for ${attribute}!. Pelase provide valid data.`
                }
            }
        });
    }
}