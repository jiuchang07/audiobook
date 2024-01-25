require('dotenv').config();
global.ePub = require('epubjs').default;
const path = require('path');
const fs = require("fs");
const {
    Configuration,
    OpenAIApi,
    OpenAI
} = require('openai');

let data = {
    GPT_API_KEY: process.env.GPT_API_KEY,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    TEXT: process.env.TEXT,
    TEXT2: process.env.TEXT2,
    TEXT3: process.env.TEXT3,
    TEXT4: process.env.TEXT4
};

const openai = new OpenAI({
    apiKey: data.GPT_API_KEY
});

async function converter(out_path, text) {
  console.log(out_path, text);
  if (text.length <= 0) {
    return;
  }
  const speechFile = path.resolve(out_path);
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  console.log(speechFile);
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

module.exports = converter;
