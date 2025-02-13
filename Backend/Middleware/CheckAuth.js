import jwt from "jsonwebtoken";

const checkAuth = (req, res) => {
  const token = req.cookies.refreshToken; 

  if (!token) return res.status(401).json({ isAuthenticated: false, message: "User not logged in" });
  jwt.verify(token, process.env.TOKEN, (err, user) => {
    if (err) return res.status(403).json({ isAuthenticated: false, message: "Invalid refresh token" });
    return res.json({ isAuthenticated: true, user });
  });
};

export default checkAuth;