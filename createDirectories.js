const fs = require('fs');
const path = require('path');

async function createDirectories(parentDirectory, directories) {
    directories.forEach(dir => {
        const dirPath = path.join(parentDirectory, dir);

        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error creating directory ${dirPath}:`, err);
            } else {
                console.log(`Directory created: ${dirPath}`);
            }
        });
    });
};
module.exports = createDirectories;
