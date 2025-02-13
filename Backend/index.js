import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import mongoose, { get } from "mongoose";
const PORT = 5000;
import { StoreData }  from "./forstoringdb.js";


dotenv.config({
  path: './.env'
});
const app = express();
// Example API route
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



// Middleware
// Example using Express.js
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });
app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true
  }
));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());



// Routing 
import { Router } from "express";
import { registerUser ,getDialogue, logout} from "./Controllers/Main.js";
import { loginuser } from "./Controllers/Main.js";
import checkAuth from "./Middleware/CheckAuth.js";
import { verifyJWT } from "./Middleware/Auth.js";
const router = Router();
app.use("/", router);

router.route("/register").post(registerUser)
router.route("/login").post(loginuser);
router.route("/Chat").post( verifyJWT, getDialogue);
router.route("/logout").post(verifyJWT , logout);
app.get("/auth" , checkAuth);

