import axios from "axios";
import * as cheerio from "cheerio";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { avengers_endgame } from "./Model/Dialogue.model.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function scrapeScript() {
  try {
    console.log(GEMINI_API_KEY)
    console.log("🔍 Fetching script...");
    const url = "https://imsdb.com/scripts/Avengers-Endgame.html";
    const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });

    const $ = cheerio.load(data);
    const scriptText = $("pre").text();

    if (!scriptText) {
      console.log("❌ Could not find the script content on the page.");
      return [];
    }

    const lines = scriptText.split("\n");
    let movieData = [];
    let currentCharacter = null;
    let currentDialogue = [];

    lines.forEach((line) => {
      line = line.trim();
      if (line === "") return;

      if (line === line.toUpperCase() && line.split(" ").length <= 3) {
        if (currentCharacter && currentDialogue.length) {
          movieData.push({ character: currentCharacter, dialogue: currentDialogue.join(" ") });
        }
        currentCharacter = line;
        currentDialogue = [];
      } else if (currentCharacter) {
        currentDialogue.push(line);
      }
    });

    if (currentCharacter && currentDialogue.length) {
      movieData.push({ character: currentCharacter, dialogue: currentDialogue.join(" ") });
    }

    console.log(`✅ Scraped ${movieData.length} dialogues.`);
    return movieData;
  } catch (error) {
    console.error("❌ Error scraping the script:", error);
    return [];
  }
}

async function storeInDatabase(dialogues) {
  try {
    console.log("💾 Storing data in MongoDB...");
    for (let i = 0; i < dialogues.length; i++) {
      const { character, dialogue } = dialogues[i];

      if (!dialogue || !character) continue;

      const ignoredCharacters = ["THE END", "AVENGERS: ENDGAME", "AVENGERS", "ENDGAME"];
      if (ignoredCharacters.includes(character)) continue;

      const result = await model.embedContent(dialogue);
      const embedding = result.embedding.values;
      await avengers_endgame.create({ character, dialogue, embedding });
    }
    console.log("✅ Data stored in MongoDB.");
  } catch (error) {
    console.error("❌ Error storing in database:", error);
  }
}

// Main Function
export const StoreData = async () => {
  const dialogues = await scrapeScript();
  if (dialogues.length > 0) {
    await storeInDatabase(dialogues);
  }
}
StoreData