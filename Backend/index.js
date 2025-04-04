import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
const PORT = process.env.PORT || 5000;

dotenv.config({
  path: './.env'
});
const app = express();


app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

dotenv.config({
  path: './.env'
});

const connection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);

    // StoreData();
    app.on("error", (error) => {
      console.log("ERROR: ", error)
      throw error;
    })
  }
  catch (error) {
    console.log("App Listen At Port", `${PORT}`)
    console.log("ERROR: ", error);
    throw error
  }
};
connection();


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.set("trust proxy", 1);

// Middleware
app.use(cors(
  {
    origin: ['https://ai-movie-character-chatbot.vercel.app', "http://localhost:5173"],
    credentials: true
  }
));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// rate limiter

const limiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: "Too many requests from this IP, please try again after an Second"
});
app.use("/Chat", limiter);


// Routing 
import { Router } from "express";
import { registerUser, getDialogue, logout } from "./Controllers/Main.js"; // getDialogue,
import { loginuser } from "./Controllers/Main.js";
import checkAuth from "./Middleware/CheckAuth.js";
import { verifyJWT } from "./Middleware/Auth.js";
const router = Router();
app.use("/", router);

router.route("/register").post(registerUser)
router.route("/login").post(loginuser);
router.route("/Chat").post(verifyJWT, getDialogue);
router.route("/logout").post(logout);
app.get("/auth", checkAuth);

// Connect with the Redis 
// import { createClient } from 'redis';

// const client = createClient({
//   username: 'default',
//   password: `${process.env.REDIS_PASSWORD}`,
//   socket: {
//     host: `${process.env.REDIS_HOST}`,
//     port: `${process.env.REDIS_PORT}`,
//     reconnectStrategy: retries => {
//       const baseDelay = 100;
//       const maxDelay = 1000;
//       return Math.min(baseDelay * 2 ** retries, maxDelay);
//     },
//     keepAlive: true
//   }
// });

// export default client;

// await client.connect().then(() => {
//   console.log("Connected to Redis successfully!");
// }).catch(err => {
//   console.log("Redis Connection Failed:", err);
// });


// const cacheData = async (key, data) => {

//   const reply = await client.set(key, data, 'EX', 1000 * 60 * 60 * 40);
//   console.log("Cache Response:", reply);
// };

// const getCachedData = async (key, callback) => {

//   const val = await client.get(key);

//   return val;
// };



// export { cacheData, getCachedData };