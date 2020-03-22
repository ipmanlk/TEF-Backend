// Regular expressions for each module
class RegexPatternUtil {
    private static REGEX = {
        EMPLOYEE: [
            {
                "regex": /^[\d]{4}$/,
                "attribute": "number",
                "error": "Please provide a valid employee number!."
            },
            {
                "regex": /^[\w\s]{5,150}$/,
                "attribute": "fullName",
                "error": "Please provide a valid full name!."
            },
            {
                "regex": /^[\w\s]{2,45}$/,
                "attribute": "callingName",
                "error": "Please provide a valid calling name!."
            },
            {
                "regex": /^([\d]{9}(\V|\X))|([\d]{12})$/,
                "attribute": "nic",
                "error": "Please provide a valid NIC!."
            },
            {
                "regex": /^.+(jpg|png|gif)$/,
                "attribute": "photo",
                "error": "Please select a valid profile picture!."
            },
            {
                "regex": /^[\w\s\d\,\\\.\n\/]{10,200}$/,
                "attribute": "address",
                "error": "Please provide a valid address!."
            },
            {
                "regex": /^[\d]{10}$/,
                "attribute": "mobile",
                "error": "Please provide a valid mobile number!."
            },
            {
                "regex": /^[\d]{10}$/,
                "attribute": "land",
                "error": "Please provide a valid landphone number!.",
                "optional": true
            },
            {
                "regex": /^(\d{4})-(\d{2})-(\d{2})$/,
                "attribute": "doassignment",
                "error": "Please select a valid date of assignment!."
            },
            {
                "regex": /^[\w\s\d\,\\\.\n\/]{10,100}$/,
                "attribute": "description",
                "error": "Please provide a valid description!.",
                "optional": true
            },
            {
                "regex": /^[\d]+$/,
                "attribute": "genderId",
                "error": "Please select a valid gender!."
            },
            {
                "regex": /^[\d]+$/,
                "attribute": "civilStatusId",
                "error": "Please select a valid civil status!."
            },
            {
                "regex": /^[\d]+$/,
                "attribute": "designationId",
                "error": "Please select a valid designation!."
            },
            {
                "regex": /^[\d]+$/,
                "attribute": "employeeStatusId",
                "error": "Please select a valid employee status!."
            }
        ]
    }


    static async getModuleRegexForUI(module) {

        // check if module is provided
        if (!module) {
            throw {
                status: false,
                type: "input",
                msg: "Please provide a module name."
            }
        }

        // check if module is valid
        if (!this.REGEX[module]) {
            throw {
                status: false,
                type: "input",
                msg: "Module not found."
            }
        }

        try {
            let regex = this.REGEX[module].map(rx => {
                let regexString = rx.regex.toString();
                regexString = regexString.substring(1, regexString.length - 1);
                return {
                    regex: regexString,
                    attribute: rx.attribute,
                    error: rx.error
                }
            });
            return {
                status: true,
                data: regex
            };

        } catch (e) {
            throw {
                status:  false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        }
    }
}

export default RegexPatternUtil