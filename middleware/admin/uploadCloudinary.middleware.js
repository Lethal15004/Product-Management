const streamUpload=require('../../helpers/streamUpload.helper');

module.exports.uploadSingle= async (req,res,next)=>{
    if(req.file){
      const uploadToCloudinary= async (buffer)=>{
          let result= await streamUpload(buffer);
          req.body[req.file.fieldname]=result.url;
      }
      await uploadToCloudinary(req.file.buffer);
      next();
    }
    else{
      next();
    } 
}