const fs = require('fs');
const JSZip = require('jszip');
const xml2js = require('xml2js');

async function extractSectionFromEpub(epubFilePath, sectionId) {
    try {
        // Read the EPUB file
        const data = fs.readFileSync(epubFilePath);
        const zip = await JSZip.loadAsync(data);

        // Find the specific section file in the EPUB structure
        // This part might need to be adjusted depending on the structure of your EPUB
        const sectionFile = zip.file(sectionId);

        if (!sectionFile) {
            throw new Error(`Section ${sectionId} not found in the EPUB.`);
        }

        // Read the section content
        const sectionContent = await sectionFile.async("string");

        // Parse the HTML/XML content
        // This part might need adjustments based on the specific structure of your section
        xml2js.parseString(sectionContent, (err, result) => {
            if (err) {
                throw err;
            }

            // Assuming you want to extract text from a specific tag/structure
            // Adjust the extraction logic as per your requirement
            const extractedText = JSON.stringify(result);

            // Output the extracted text
            console.log("Extracted Text:", extractedText);

            // Place the extracted content in a JavaScript variable
            const jsVariable = extractedText; // Modify as per your requirement

            // Do something with the jsVariable
            // For example, writing it to a file or using it in your application
            writeTextToFile(jsVariable, `./${sectionId}`)
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}
function writeTextToFile(text, outputFilePath) {
    fs.writeFileSync(outputFilePath, text, 'utf8');
    console.log(`Text written to file: ${outputFilePath}`);
}

async function listFilesInEpub(epubFilePath) {
    try {
        // Read the EPUB file
        const data = fs.readFileSync(epubFilePath);
        const zip = await JSZip.loadAsync(data);
        const fileNames = Object.keys(zip.files);

        return fileNames;
        // List all files
        // console.log("Files in the EPUB:");
        // zip.forEach((path, file) => {
        //     console.log(path);
        // });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Usage
// const epubFilePath = './Angus Deaton - The Great Escape_ Health, Wealth, and the Origins of Inequality-Princeton University Press (2013).epub';
// const sectionId = 'OEBPS/17_ch07.xhtml'//'cover.xhtml';//'17_ch07.xhtml'; // Adjust this path based on your EPUB structure
// extractSectionFromEpub(epubFilePath, sectionId);
// listFilesInEpub(epubFilePath);
module.exports = listFilesInEpub;
