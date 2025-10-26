import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import connectToDB  from "./utils/database.js";
import cors from "cors";
import systemPromptGen from "./utils/system-prompt-generator.js";
import Roadmap from "./Models/roadmap.js";
import express from "express";

dotenv.config();

const PORT = process.env.PORT || 3000;

if (!process.env.DB_URI || !process.env.JWT_SECRET_KEY || !process.env.GEMINI_API_KEY) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

const app = express();
app.use(express.json());
app.use(cors({
origin: '*',
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']
}));


// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function main(topic, difficulty, outcome) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: systemPromptGen(topic, difficulty, outcome),
    // Add generationConfig to explicitly request JSON output (Best Practice)
    config: {
        responseMimeType: "application/json",
    }
  });

  // 1. Get the raw text output from the model.
  const rawText = response.text; 

  // 2. Remove markdown code fences (```json\n...\n```) if they exist.
  // This RegEx searches for anything starting with '```' and ending with '```'
  // and captures the content between them.
  let jsonString = rawText.trim();
  
  if (jsonString.startsWith('```')) {
    const match = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (match && match[1]) {
      jsonString = match[1].trim(); // Use the captured group (the content inside the fences)
    } else {
      // Fallback for cases where it starts with ``` but isn't perfectly matched
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    }
  }

  // 3. Parse the cleaned string into a usable JavaScript object.
  try {
    const jsonObject = JSON.parse(jsonString);
    console.log("Successfully parsed JSON object:", jsonObject);
    
    // You can now access the data directly:
    console.log("Topic:", jsonObject.topic);
    console.log("Total Hours:", jsonObject.estimatedTotalHours);
    console.log("Number of Modules:", jsonObject.modules.length);

    // Return the object for use in your MERN backend logic (Phase 2)
    return jsonObject; 
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    console.log("Raw text that failed to parse:", rawText);
    return null; // Return null or throw error on failure
  }
}

//main();

app.post('/api/generate', async (req, res) => {
  try {
    const { topic, difficulty, outcome } = req.body;

    if(!topic || !difficulty || !outcome) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await main(topic, difficulty, outcome);
    if(result) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'An error occurred' });
    }
  } catch (error) {
    console.error("Error in /api/generate:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    const roadmapData = req.body;

   const newRoadmap = new Roadmap({
            ...roadmapData,
            //userId: userId, // Attaches the authenticated user ID
        });
        
        // This single line saves the entire nested document to MongoDB
        const savedRoadmap = await newRoadmap.save(); 
        
        res.status(201).json(savedRoadmap);
  } catch (error) {
    console.error("Error in /api/save:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



//app.use('/user', userRouter);
//app.use('/expense', expenseRouter);


//connect the database
connectToDB()
  .then(() => {
    console.log(`Connected with DB!`);
    app.listen(PORT, () => console.log(`Server is running @ PORT:${PORT}`));
  })
  .catch((err) => console.log(`Server Crashed with error: ${err}`));
