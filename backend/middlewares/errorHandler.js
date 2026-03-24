export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : err.message
  });
};