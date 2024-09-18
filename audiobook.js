const askQuestion = require('./askQuestion.js');
const listFilesInEpub = require('./readEpubRaw.js');
const createDirectories = require('./createDirectories.js');
const extractSection = require('./readEpubCompiled.js');
const divideStringIntoSnippets = require('./divideStringIntoSnippets.js');
const converter = require('./tts_google.js');
const joinMp3 = require('./joinMp3.js');
const path = require('path');
const MAXCHAR = 4000

async function main() {

    // get inputs
    const epubTitle = await askQuestion('epub Title: ');
    const epubPath = './data/' + epubTitle + '.epub';

    // get sections
    const allSections = await listFilesInEpub(epubPath);
    console.log('Please select sections (by number, separated by commas):');
    allSections.forEach((section, index) => {
        console.log(`${index + 1}. ${section}`);
    });
    
    var input = await askQuestion('Your selection: ')
    // Process the input to get selected indices
    const selectedIndices = input.split(',').map(num => parseInt(num.trim()) - 1);
    
    function getBasename(filename) {
        return path.basename(filename.replace(/\.[^/.]+$/, ""));
    }
    
    // Filter the valid selections
    const selectedSections = selectedIndices.filter(index => index >= 0 && index < allSections.length).map(index => allSections[index]);

    // Display the selected options
    console.log(`You selected: ${selectedSections.join(', ')}`);

    const selectedSectionsBasenames = selectedSections.map(section => getBasename(section));
    // get outputs
    const outputDir = path.join('.', 'output', epubTitle); // Use path.join for proper path handling
    await createDirectories(path.join('.', 'output'), [epubTitle]);
    await createDirectories(outputDir, ['joinedBySection']);
    await createDirectories(outputDir, selectedSectionsBasenames);

    for (const section of selectedSections) {
        const sectionWoExtension = getBasename(section);
        // convert epub to txt
        const textContent = await extractSection(epubPath, section);

        // divide textContent into maximum MAXCHAR-character snippets
        const snippets = divideStringIntoSnippets(textContent, MAXCHAR);
        
        for (let index = 0; index < snippets.length; index++) {
            await converter(path.join(outputDir, sectionWoExtension, `${index}.mp3`), snippets[index]);
        }

        // join mp3 files
        await joinMp3(path.join(outputDir, sectionWoExtension), path.join(outputDir, 'joinedBySection', `${sectionWoExtension}.mp3`));
    }
}

main().catch(console.error);