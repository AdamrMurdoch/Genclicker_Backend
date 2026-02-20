const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) 
    {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => 
    {
      if (err)
      {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = payload.user;
      next();
    });
  } 
  catch (e) 
  {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { requireAuth };