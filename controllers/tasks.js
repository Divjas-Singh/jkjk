import { dbFunc } from "./dbFunctions.js";

export const getAllbyID = async (req, res) => {
  try {
    // const { user_id } = req.body;
    const { user_id } = req.user;
    const [result] = await dbFunc(
      `SELECT * from tasks where user_id=? ORDER BY date_created DESC;`,
      [user_id]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
export const createTask = async (req, res) => {
  // console.log(req.body);
  try {
    const { task_description, task_title } = req.body;
    const { user_id } = req.user;
    const [result] = await dbFunc(
      `INSERT INTO tasks (user_id, task_title, task_description) 
        VALUES (?, ?, ?);`,
      [user_id, task_title, task_description]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
export const updateTask = async (req, res) => {
  try {
    const { task_id, task_title, task_description } = req.body;
    const [result] = await dbFunc(
      `UPDATE tasks SET task_title = ?, task_description = ? WHERE task_id = ?;`,
      [task_title, task_description, task_id]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
export const taskCompleted = async (req, res) => {
  try {
    const { task_id, task_status } = req.body;
    const [result] = await dbFunc(
      `UPDATE tasks
      SET completed = ?
      WHERE task_id = ?;`,
      [task_status, task_id]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
export const getOne = async (req, res, next, searchby = "task_id") => {
  try {
    const { task_title, task_id, user_id } = req.body;
    switch (searchby) {
      case "task_title":
        value = task_title;
        break;
      case "task_id":
        value = task_id;
        break;
      default:
        break;
    }
    const [result] = await dbFunc(
      `SELECT * from tasks where ${searchby}= ? and user_id= ? `,
      [value, user_id]
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
export const deleteTask = async (req, res) => {
  try {
    const { task_id } = req.body;

    const [result] = await dbFunc(`DELETE FROM tasks WHERE task_id = ?;`, [
      task_id,
    ]);
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.log(err);
  }
};
