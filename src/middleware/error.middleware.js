
export const errorHandler = ( err,req,res,next ) =>{

   console.log("called",err.statusCode,err.message,err);
    
   const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
}