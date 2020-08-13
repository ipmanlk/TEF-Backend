export class MiscUtil {

    // used to generate numbers for next employee, product..etc.
    static getNextNumber(startKey, currentNumString, variableNumLength) {

        function padLeft(number, length) {
            const strNumber = number.toString();
            return "0".repeat(length - strNumber.length) + strNumber;
        }

        // get current year
        const currentYear = new Date().getFullYear();

        if (currentNumString == undefined) {
            return `${startKey}${currentYear}${padLeft(0, variableNumLength)}`;
        }

        const lastYear = parseInt(currentNumString.substring(3, 7));
        const lastNumber = parseInt(currentNumString.substring(7));

        if (currentYear == lastYear + 1) {
            return `${startKey}${currentYear}${padLeft(0, variableNumLength)}`;
        } else {
            return `${startKey}${currentYear}${padLeft(lastNumber + 1, variableNumLength)}`;
        }
    }

    // used to get base64 data from a base64 string
    static decodeBase64Image(dataString) {
        const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const decodedBase64 = {} as any;

        if (matches.length !== 3) {
            throw {
                status: false,
                type: "input",
                msg: "Please select a valid image!."
            }
        }

        decodedBase64.type = matches[1];
        decodedBase64.data = Buffer.from(matches[2], "base64");

        return decodedBase64;
    }
}