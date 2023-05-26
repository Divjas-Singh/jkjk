import express from "express";

import * as adminControls from "../controllers/admins.js";
import * as userControls from "../controllers/users.js";

const adminRouter = express.Router();
adminRouter.post("/login", adminControls.loginAdmin);
adminRouter.post("/logout", userControls.logoutUser);
adminRouter.post("/getAllUsers", adminControls.getAllusers); //login token added
adminRouter.get("/searchUser/id/:id", adminControls.CustomSearchUser); //login token verified
adminRouter.get("/searchUser/mail/:mail", adminControls.CustomSearchUserMail); //login token verified

export default adminRouter;
