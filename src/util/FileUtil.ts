import * as fs from "fs";

class FileUtil {
    static readFileAsBuffer = (path) => {
        return new Promise((resolve, reject) => {
            // Store file data chunks in this array
            let chunks = [];
            // We can use this variable to store the final data
            let fileBuffer;

            // Read file into stream.Readable
            let fileStream = fs.createReadStream(path);

            // An error occurred with the stream
            fileStream.once("error", (e) => {
                // Be sure to handle this properly!
                reject(e);
            });

            // File is done being read
            fileStream.once("end", () => {
                // create the final data Buffer from data chunks;
                fileBuffer = Buffer.concat(chunks);
                resolve(fileBuffer);
            });

            // Data is flushed from fileStream in chunks,
            // this callback will be executed for each chunk
            fileStream.on("data", (chunk) => {
                chunks.push(chunk); // push data chunk to array
            });

        });
    }
}

export default FileUtil;