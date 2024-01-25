const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');



async function joinMp3(directoryPath, outputFilePath) {

    // Read all mp3 files from the directory
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading the directory', err);
            return;
        }

        const mp3Files = files.filter(file => file.endsWith('.mp3'));

        if (mp3Files.length === 0) {
            console.log('No MP3 files found in the directory.');
            return;
        }

        // Create a temporary file listing all MP3 files to be joined
        const fileList = 'filelist.txt';
        const fileContent = mp3Files.map(file => `file '${path.join(directoryPath, file)}'`).join('\n');
        fs.writeFileSync(fileList, fileContent);

        // Construct the ffmpeg command
        const ffmpegCommand = `ffmpeg -f concat -safe 0 -i ${fileList} -c copy ${outputFilePath}`;

        // Execute the ffmpeg command
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ffmpeg: ${error}`);
                return;
            }
            console.log('MP3 files have been joined successfully.');
            fs.unlinkSync(fileList); // Remove the temporary file list
        });
    });
}
module.exports = joinMp3;
// const directoryPath = "output\\basic-v3plus2\\EPUB\\xhtml\\section0002"; // Replace with the path to your MP3 files
// const outputFilePath = "output\\basic-v3plus2\\joinedBySection"; // Replace with the desired output file path
// joinMp3(directoryPath, outputFilePath)