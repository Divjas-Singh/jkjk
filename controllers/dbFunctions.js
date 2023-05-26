import dbConnect from "../data/database.js";
export const dbFunc = (query, values = []) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dbPool = dbConnect();
      const result = await dbPool.query(query, values);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
