const errorcalled = (err, req, res, next) => {
  //   console.log("working");
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    COD: err.statusCode,
    message: err.message,
  });
  console.log({ success: false, COD: err.statusCode, message: err.message });
};
export default errorcalled;
