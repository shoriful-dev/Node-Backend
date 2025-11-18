const { asyncHandler } = require("../../utils/asyncHandler");

exports.authguard = asyncHandler(async(req,res,next)=> {
    console.log(req.headers);
    
})