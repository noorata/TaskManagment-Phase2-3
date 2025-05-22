import jwt from "jsonwebtoken";

const authenticate = (req) => {
  console.log("Request Headers:", req.headers);  // سيساعدك هذا في التحقق من وجود الـ Authorization header

  if (!req || !req.headers || !req.headers.authorization) {
    throw new Error('Authorization header missing');
  }

  const authHeader = req.headers.authorization || "";
  console.log("Authorization Header:", authHeader);  // هذا سيوضح لك محتوى الـ Authorization header

  const token = authHeader.split(" ")[1];  // تقسيم الـ header للحصول على الـ token بعد "Bearer"

  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, "1234$");  // تحقق من الـ token باستخدام السر
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export default authenticate;
