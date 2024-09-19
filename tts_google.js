require('dotenv').config();
const path = require('path');
const fs = require("fs");
const textToSpeech = require('@google-cloud/text-to-speech');

// Initialize the Google Cloud Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient();

async function converter(out_path, text) {
  // console.log(out_path, text);
  if (text.length <= 0) {
    return;
  }

  const speechFile = path.resolve(out_path);

  // Create the request for Google Cloud Text-to-Speech
  const request = {
    input: { text: text },
    voice: {
      languageCode: 'en-US',  // Set your desired language code here
      name: 'en-US-Studio-Q',  // Replace this with the desired voice: /Polyglot-1, Studio-O, Studio-Q, Wavenet-I
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
