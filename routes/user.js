import express from "express";
import * as userControls from "../controllers/users.js";
import * as adminControls from "../controllers/admins.js";

const userRouter = express.Router();

import { verifyLogInToken } from "../utils/cookieFunctions.js";
userRouter.post("/register", userControls.registerUser); //login token added
userRouter.post("/login", userControls.loginUser); //login token verified
userRouter.get("/logout", verifyLogInToken, userControls.logoutUser); //login token removed
userRouter.post("/delete", verifyLogInToken, userControls.deleteUser); //login token removed
userRouter.get("/check-cookie", (req, res) => {
  if (req.cookies) {
    res.json({ hasCookie: true, cookies: req.cookies });
  } else {
    res.json({ hasCookie: false });
  }
});

export default userRouter;
