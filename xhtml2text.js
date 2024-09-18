const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitChildren: true, preserveChildrenOrder: true, charsAsChildren: true });

function extractTextFromHtml(obj) {
    let text = '';

    if (typeof obj === 'string') {
        text += obj.trim();
    } else if (Array.isArray(obj)) {
        obj.forEach(element => {
            text += extractTextFromHtml(element);
        });
    } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            if (key !== '$' && key !== '_') {
                text += extractTextFromHtml(obj[key]);
            }
        });
    }

    return text;
}

function convertXHTMLToText(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, (err, data) => {
        if (err) {
            console.error("Error reading the XHTML file:", err.message);
            return;
        }

        parser.parseString(data, (err, result) => {
            if (err) {
                console.error("Error parsing the XHTML file:", err.message);
                return;
            }

            const textContent = extractTextFromHtml(result);
            fs.writeFile(outputFilePath, textContent, (err) => {
                if (err) {
                    console.error("Error writing to the output file:", err.message);
                    return;
                }

                console.log(`Human-readable text has been written to ${outputFilePath}`);
            });
        });
    });
}

// Usage
// const inputFilePath = './OEBPS/17_ch07.xhtml';
// const outputFilePath = 'humanReadable\\17_ch07.txt';

// convertXHTMLToText(inputFilePath, outputFilePath);
