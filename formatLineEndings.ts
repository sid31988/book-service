import * as fs from "fs";
import * as path from "path";

function formatLineEndings(basePath: string) {
    let shellFiles = fs.readdirSync(basePath);
    shellFiles.forEach(x => {
        let filePath = path.join(basePath, x);
        if (fs.lstatSync(filePath).isDirectory())
            formatLineEndings(filePath);
        else {
            console.log(`Formatting line endings for '${filePath}'`);
            let buffer = fs.readFileSync(filePath);
            let text = buffer.toString();
            text = text.split("\r").join("");
            fs.writeFileSync(filePath, text);
        } 
    });
    
}

formatLineEndings(path.join(__dirname, ".sh"));