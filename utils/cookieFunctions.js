import jwt from "jsonwebtoken";
import Errorhandler from "./ErrorHandlerClass.js";

export const verifyLogInToken = async (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const { logInAuth } = req.cookies;
  if (logInAuth) {
    const decoded = jwt.verify(logInAuth, secretKey);
    req.user = decoded;
    next();
  } else {
    console.log("token not present");
    next(new Errorhandler("Unauthorized/err", 403));
  }
};

export const setCookie = async (
  cookieType,
  res,
  statusCode,
  cookieStatus,
  jsonMsg,
  userLevel = "user",
  user_id
) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  let payload = {
    isadmin: userLevel === "user" ? false : true,
    user_id,
  };
  const token = jwt.sign(payload, secretKey);

  console.log(
    {
      success: true,
      COD: statusCode,
      message: jsonMsg,
      userLevel,
      user_id,
    },
    cookieType
  );
  const x = await res.header;

  res.cookie(cookieType, token, {
    httpOnly: false,
    maxAge: 1000 * 60 * 15,
    sameSite: "None",
  });
  res.status(statusCode).json({
    success: true,
    COD: statusCode,
    message: jsonMsg,
    userLevel,
    user_id,
    x,
  });
};

export const getIDforNote = (req, res, next) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const { logInAuth } = req.cookies;
  if (logInAuth) {
    const decoded = jwt.verify(logInAuth, secretKey);
    req.user = decoded;
    next();
  } else {
    return res.status(401).json({ success: false, message: "not logged in" });
  }
};
