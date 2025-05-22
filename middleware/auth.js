import jwt from "jsonwebtoken";

const authenticate = (req) => {
  console.log("Request Headers:", req.headers);

  if (!req || !req.headers || !req.headers.authorization) {
    throw new Error('Authorization header missing');
  }

  const authHeader = req.headers.authorization || "";
  console.log("Authorization Header:", authHeader); 

  const token = authHeader.split(" ")[1];

  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, "1234$");
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export default authenticate;
