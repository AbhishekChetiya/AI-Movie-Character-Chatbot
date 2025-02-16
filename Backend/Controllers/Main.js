import { User } from "../Model/user.model.js";
import { avengers_endgame } from "../Model/Dialogue.model.js";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004", temperature: 0 });
const modelforChat = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
import { cacheData, getCachedData } from "../index.js";

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const isExist = await User.findOne({ $or: [{ email }] });
  if (isExist) {
    return res.status(400).json({ message: "User Already Present" });
  }

  try {
    await User.create({ name, email, password });
    return res.status(200).json({ message: "User Successfully Login" })
  } catch (error) {
    const checkUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!checkUser) {
      return res.status(500).json({ message: "Something went wrong while registering the user" });
    }
  }
  return res.status(200).json({ message: "User Successfully Login" });
};

const loginuser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Unauthorized User" });
  }

  const check = await user.isPasswordCorrect(password);
  if (!check) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  const RefreshToken = generateRefreshToken(user);
  user.refreshToken = RefreshToken;
  user.save({ validateBeforeSave: false });
  res.res.setHeader("Content-Type", "application/json");
  return res.status(200).
    cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).
    json(JSON.stringify({ RefreshToken , message: "User Successfully Login" }));
};

const getDialogue = async (req, res) => {
  const get_dialogue = req.body.message;
  const cacheKey = `dialogue:${get_dialogue}`;
  let results = null;
  res.res.setHeader("Content-Type", "application/json");
  try {
    // Check if the result is already cached
    let response = await getCachedData(cacheKey);
    if (response != null && response != undefined) {
      return res.status(200).json(JSON.stringify({ message: response }));
    }
   
    const result = await model.embedContent(get_dialogue);
    const embedding = result.embedding.values; 
    
    // Perform vector search
    results = await avengers_endgame.aggregate([
      {
        $vectorSearch: {
          index: "default",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 1,
        },
      },
    ]);
   
    if (results.length === 0) {
      return res.status(404).json(JSON.stringify({ message: "No matching dialogue found." }));
    }

    const generationConfig = {
      temperature: 0.3,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = modelforChat.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpful assistant. Use the provided context to generate accurate and relevant responses to user-given dialogue. 
              We find dialogue in the Avenger_EndGame Movie using the provided context through the Similarity search. 
              I will provide you the user search dialogue and dialogue I find using the similarity search.
              Now, only respond to the user as similar dialogue from the Avenger_EndGame Movie.`,
            },
          ],
        },
      ],
    });

    // Send the user's input and the found dialogue to the chat session
    const queryResult = await chatSession.sendMessage(
      `User provided this dialogue: ${get_dialogue}\n\nThrough the similarity search, we found this dialogue from the Avenger Movie: "${results[0].dialogue}"`
    );

    response = queryResult.response.text();
    
    // Cache the response in Redis
    cacheData(cacheKey, response);

    return res.status(200).json(JSON.stringify({message: response }));
  } catch (error) {
  
    if (results && results.length > 0) {
     
      await cacheData(cacheKey, results[0].dialogue);
      return res.status(200).json(JSON.stringify({ message: results[0].dialogue }));
    }

    return res.status(500).json(JSON.stringify({ message: "Something went wrong while processing the dialogue." }));
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.id,
      { refreshToken: "" },
      { new: true }
    );
    return res.status(200).
      clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      }).json({ message: "User Logged Out Successfully" });
  }
  catch (error) {
    return res.status(500).json({ message: "Something went wrong while logging out the user" });
  }
};
export { registerUser, loginuser, getDialogue, logout };