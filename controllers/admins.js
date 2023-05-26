import Errorhandler from "../utils/ErrorHandlerClass.js";
import jwt from "jsonwebtoken";
import { dbFunc } from "./dbFunctions.js";
import bcrypt from "bcrypt";
import { setCookie } from "../utils/cookieFunctions.js";
import { searchUser } from "./users.js";

export const getAllusers = async (req, res, next) => {
  const { email, password } = req.body;
  const searchresults = await searchUser("email", email);
  if (searchresults[0].admin == false) {
    return next(new Errorhandler("Unauthorized User", 401));
  }
  if (searchresults.length == 0) {
    return next(new Errorhandler("Invalid Email or Password", 400));
  }

  let passAuth = await bcrypt.compare(password, searchresults[0].password);

  if (!passAuth) {
    return next(new Errorhandler("Invalid Email or Password", 400));
  }
  if (searchresults[0].admin == false) {
    return next(new Errorhandler("Unauthorized User", 401));
  }
  const [results] = await dbFunc(`SELECT * from users;`);
  res.status(200).json({
    success: true,
    COD: 200,
    INFO: results,
  });
};

export const CustomSearchUser = async (
  req,
  res,
  next,
  searchby = "user_id"
) => {
  // const { email } = req.body;
  const { id } = req.params;
  const [results] = await dbFunc(`SELECT * from users where ${searchby}= ? ;`, [
    id,
  ]);

  res.status(200).json({
    success: true,
    COD: 200,
    INFO: results[0],
  });
};
export const CustomSearchUserMail = async (
  req,
  res,
  next,
  searchby = "email"
) => {
  // const { email } = req.body;
  const { mail } = req.params;
  const [results] = await dbFunc(`SELECT * from users where ${searchby}= ? ;`, [
    mail,
  ]);
  if (results[0]) {
    res.status(200).json({
      success: true,
      COD: 200,
      INFO: results[0],
    });
  } else {
    res.status(200).json({
      success: false,
      COD: 400,
    });
  }
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  const searchresults = await searchUser("email", email);

  if (searchresults.length == 0) {
    return next(new Errorhandler("Invalid Email or Password", 400));
  }
  if (searchresults[0].admin == false) {
    return next(new Errorhandler("Unauthorized User", 401));
  }

  const user_id = searchresults[0].user_id;
  let passAuth = await bcrypt.compare(password, searchresults[0].password);

  if (!passAuth) {
    return next(new Errorhandler("Invalid Email or Password", 400));
  }
  setCookie(
    "logInAuth",
    res,
    200,
    "loggedIn",
    "admin logged in",
    "admin",
    user_id
  );
};
