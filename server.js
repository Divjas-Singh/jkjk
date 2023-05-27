//_______________IMPORTS____________________
import express, { response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import dbConnect from "./data/database.js";
import userRouter from "./routes/user.js";
import errorcalled from "./middlewares/ErrorMiddleware.js";
import adminRouter from "./routes/admin.js";
import taskRouter from "./routes/task.js";
import cors from "cors";
//__________________________________________
const __dirname = path.resolve();
dotenv.config({ path: "./data/.env" });
const app = express();
const dbPool = dbConnect();
console.log(dbPool.pool.config.connectionConfig.host);

//___________MIDDLEWARE____________________
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Set-Cookie,Content-Type, Accept"
//   );
//   next();
// });
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: "Set-Cookie",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//_____________ROUTES______________________
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);

app.get("/", (req, res, next) => {
  res.send("API working");
});

//____CUSTOM MIDDLEWARE ERROR______________
app.use(errorcalled);

//_____________SERVER______________________
app.listen(process.env.PORT, () => {
  console.log("server is online on " + process.env.PORT);
});
