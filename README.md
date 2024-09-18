# audiobook

Audiobook transcribes any epub file into an audiobook using Text-To-Speech (TTS). 

Usage

1. Put your epub file in the directory `data`. 
2. Run `node audiobook` on your terminal.
3. Input the name of your epub file when prompted.
4. You will see a numerated list of chapters. Input the numbers of the chapters you want narrated, separated by a comma (,). 
5. Once the program finishes running, you'll see MP3 files of each chapter in `output\\{epub filename}\\joinedBySection`.

Customization
$\cdot$ You can change the voice or narration by modifying `voice` in `tts_google.js` or `tts_openai.js`. 
$\cdot$ You can specify whether to use google cloud's TTS or OpenAI's TTS by changing the import source of `converter` in `audiobook.js` script:
`const converter = require('./tts_google.js');`.
