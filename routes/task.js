import express from "express";

import * as taskFunctions from "../controllers/tasks.js";
import { getIDforNote } from "../utils/cookieFunctions.js";

const taskRouter = express.Router();
taskRouter.post("/getAll", getIDforNote, taskFunctions.getAllbyID);
taskRouter.post("/create", getIDforNote, taskFunctions.createTask);
taskRouter.post("/update", getIDforNote, taskFunctions.updateTask);
taskRouter.post("/taskComplete", getIDforNote, taskFunctions.taskCompleted);
taskRouter.post("/getOne", getIDforNote, taskFunctions.getOne);
taskRouter.post("/delete", getIDforNote, taskFunctions.deleteTask);

export default taskRouter;
