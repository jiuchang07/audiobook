const { JSDOM } = require('jsdom');
const fs = require('fs');
const JSZip = require('jszip');

const writeExtractedSection = async (epubPath, htmlFileName, outputPath) => {
    textContent = extractSection(epubPath, htmlFileName);
    fs.writeFile(outputPath, textContent, (err) => {
        if (err) throw err;
        console.log(`Content from '${htmlFileName}' written to ${outputPath}`);
    });
}

async function extractSection (epubPath, htmlFileName) {
    const data = fs.readFileSync(epubPath);
    const zip = new JSZip();
    const contents = await zip.loadAsync(data);
    const htmlFile = contents.file(htmlFileName);

    if (htmlFile) {
        const htmlContent = await htmlFile.async('string');
        const dom = new JSDOM(htmlContent);
        const textContent = dom.window.document.body.textContent;
        return textContent;

    } else {
        console.log(`File '${htmlFileName}' not found in the EPUB.`);
    }
};

// Example usage
// writeExtractedSection('./data/Angus Deaton - The Great Escape_ Health, Wealth, and the Origins of Inequality-Princeton University Press (2013).epub', 'OEBPS/17_ch07.xhtml', './data/17_ch07.txt')
module.exports = extractSection;