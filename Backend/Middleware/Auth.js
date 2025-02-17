import jwt from "jsonwebtoken";
import { User } from "../Model/user.model.js";

export const verifyJWT = async (req, res, next) => {
    
    const token = req.cookies.refreshToken;
    if(!token){
        return res.status(403).json( { message: "Access Error"});
    }
    try{
      const decode = jwt.verify(token,process.env.TOKEN);
      const user = await User.findById(decode.id);
      if(!user){
          return res.status(403).json({message: "User Not Found"});
      } 
      req.body.id = decode._id;
      req.body.email = decode.email;
      return next();
    }
    catch(error){ 
        return res.status(403).json({message: "Invaild Token Access Error"});
    }
};
