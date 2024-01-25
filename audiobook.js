const askQuestion = require('./askQuestion.js');
const listFilesInEpub = require('./readEpubRaw.js');
const createDirectories = require('./createDirectories.js');
const extractSection = require('./readEpubCompiled.js');
const divideStringIntoSnippets = require('./divideStringIntoSnippets.js');
const converter = require('./tts.js');
const joinMp3 = require('./joinMp3.js');
const path = require('path');
const MAXCHAR = 40

async function main() {

    // get inputs
    const epubTitle = await askQuestion('epub Title: ');
    const epubPath = './data/' + epubTitle + '.epub';
    //'Angus Deaton - The Great Escape_ Health, Wealth, and the Origins of Inequality-Princeton University Press (2013)';

    // get sections
    const allSections = await listFilesInEpub(epubPath);
    // console.log(allSections);
    console.log('Please select sections (by number, separated by commas):');
    // var index = 1;
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
    // // get outputs
    // const outputDir = './/output//' + epubTitle;
    // createDirectories('.//output//', [epubTitle]).then(() => {
    //     createDirectories(outputDir, ['joinedBySection']).then(() => {
    //         createDirectories(outputDir, selectedSectionsWoExtension).then(async () => {

    //             for (const section of selectedSections) {
    //                 const sectionWoExtension = removeFileExtension(section);
    //                 // convert epub to txt
    //                 const textContent = await extractSection(epubPath, section.replace("extension", "xhtml").replace(/\/\//g, '/'));
                
    //                 // divide textContent into maximum MAXCHAR-character snippets
    //                 const snippets = divideStringIntoSnippets(textContent, MAXCHAR);
                
    //                 snippets.forEach((snippet, index) => {
    //                     converter(outputDir + '//' + sectionWoExtension + '//' + index + '.mp3', snippet);
    //                 })
                
    //                 // join mp3 files
    //                 await joinMp3(outputDir + '//' + sectionWoExtension, outputDir + '//joinedBySection//' + sectionWoExtension + '.mp3');
    //             }
    //         })
    //     });
    // });
    // selectedSections.forEach(async (section) => {
    //     // convert epub to txt
    //     const textContent = await extractSection(epubPath, section);

    //     // divide textContent into maximum MAXCHAR-character snippets
    //     const snippets = await divideStringIntoSnippets(textContent, MAXCHAR);

    //     var snippetCount = 0;
    //     // convert text to speech
    //     snippets.forEach(async (snippet) => {
    //         await converter(outputDir + '/' + section + '/' + snippetCount + '.mp3', snippet);
    //     });

    //     // join mp3 files
    //     await joinMp3(outputDir + '/' + section, outputDir + '/joinedBySection/' + section + '.mp3');

    // });

}

main().catch(console.error);