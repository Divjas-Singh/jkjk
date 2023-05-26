import bcrypt from "bcrypt";
import { dbFunc } from "./dbFunctions.js";
import Errorhandler from "../utils/ErrorHandlerClass.js";
import { setCookie } from "../utils/cookieFunctions.js";
import jwt from "jsonwebtoken";
export const searchUser = async (searchby, value) => {
  const [results] = await dbFunc(`SELECT * from users where ${searchby}= ?`, [
    value,
  ]);
  // console.log(results);
  return results;
};
export const registerUser = async (req, res, next) => {
  let { username, email, password } = req.body;
  console.log(username, email, password);
  if (username && email && password) {
    let searchresults = await searchUser("email", email);
    console.log(searchresults);
    if (searchresults.length !== 0) {
      return next(new Errorhandler("email already used try to login", 400));
    }
    password = await bcrypt.hash(password, 10);
    let callresult = await dbFunc(
      `INSERT INTO users (username, email, password) VALUES(?, ?, ?); `,
      [username, email, password]
    );
    if (callresult[0].affectedRows > 0) {
      res.status(201).json({
        success: true,
        COD: 200,
        message: "user Created",
      });
      console.log("user Created");
    } else {
      return next(new Errorhandler("user not Created due to some error", 500));
    }
  } else {
    return next(new Errorhandler("user not Created due to blank input", 406));
  }
};

export const loginUser = async (req, res, next) => {
  let { email, password } = req.body;
  if (!email && !password) {
    return next(new Errorhandler("user not Created due to blank input", 406));
  }
  let searchresults = await searchUser("email", email);
  if (searchresults.length == 0) {
    return next(new Errorhandler("Invalid Email or Password", 401));
  }

  let passAuth = await bcrypt.compare(password, searchresults[0].password);

  if (!passAuth) {
    return next(new Errorhandler("Invalid Email or Password", 401));
  }

  const user_id = searchresults[0].user_id;
  req.body.user_id = user_id;

  setCookie(
    "logInAuth",
    res,
    200,
    "loggedIn",
    "user logged in",
    "user",
    user_id
  );
  console.log(200, user_id);
};

export const logoutUser = (req, res) => {
  res.status(200).cookie("logInAuth", "", { maxAge: 0 }).json({
    success: true,
    message: "user logged out",
    decodedCookie: req.user,
  });
};

export const deleteUser = (req, res) => {
  const { logInAuth } = req.cookies;
  let { email, password } = req.body;
  if (!email && !password) {
    return next(new Errorhandler("user not Created due to blank input", 406));
  }
  if (logInAuth) {
    const secretKey = process.env.JWT_SECRET_KEY;
    jwt.verify(logInAuth, secretKey, async (err, decoded) => {
      if (err) {
        req.user = decoded;
        console.log(err);
        // return res
        //   .status(401)
        //   .json({ verified: false, message: "Unauthorized", err });
        return next(new Errorhandler("Unauthorized/err", 403));
      } else {
        let searchresults = await searchUser("email", email);

        if (searchresults.length == 0) {
          return next(
            new Errorhandler(
              "Cannot Delete User. Invalid Email or Password",
              401
            )
          );
        }
        let passAuth = await bcrypt.compare(
          password,
          searchresults[0].password
        );
        if (!passAuth) {
          return next(
            new Errorhandler(
              "Cannot Delete User. Invalid Email or Password",
              401
            )
          );
        }
        let callresult = await dbFunc(`delete from users where email =?; `, [
          email,
        ]);
        if (callresult[0].affectedRows > 0) {
          res.status(201).cookie("logInAuth", "", { maxAge: 0 }).json({
            success: true,
            COD: 200,
            message: "user deleted",
          });
          console.log("user deleted");
        } else {
          next(new Errorhandler("user not deleted due to some error", 500));
        }
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "not logged in" });
  }
};
