require('dotenv').config();
const path = require('path');
const fs = require("fs");
const textToSpeech = require('@google-cloud/text-to-speech');

let data = {
    GPT_API_KEY: process.env.GPT_API_KEY,  // No longer needed for Google Cloud, but can keep if you use it elsewhere.
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,  // Not relevant for this task, but can stay.
    TEXT: process.env.TEXT,
    TEXT2: process.env.TEXT2,
    TEXT3: process.env.TEXT3,
    TEXT4: process.env.TEXT4
};

// Initialize the Google Cloud Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient();

async function converter(out_path, text) {
  console.log(out_path, text);
  if (text.length <= 0) {
    return;
  }

  const speechFile = path.resolve(out_path);

  // Create the request for Google Cloud Text-to-Speech
  const request = {
    input: { text: text },
    voice: {
      languageCode: 'en-US',  // Set your desired language code here
      name: 'en-US-Wavenet-D',  // Replace this with the desired voice: /Polyglot-1, Studio-O
    },
    audioConfig: {
      audioEncoding: 'MP3',
    },
  };

  // Request the conversion
  const [response] = await client.synthesizeSpeech(request);

  // Write the resulting audio to a file
  await fs.promises.writeFile(speechFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${speechFile}`);
}

module.exports = converter;
