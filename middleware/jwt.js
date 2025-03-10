const jwt = require("jsonwebtoken");

const isTeacher = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .json({ status: "Access denied. You Are Not Teacher " });
  }
  console.log(process.env.KEY);

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    if (decoded.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. You are not an admin." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: "Invalid token." });
  }
};

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. You are not an admin." });
    }

    req.user = decoded;
    next(); 

  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { isTeacher, isAdmin };
