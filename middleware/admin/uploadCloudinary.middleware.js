const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.API_SECRET
})


module.exports.uploadSingle= async (req,res,next)=>{
    if(req.file){
      let streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );

          streamifier.createReadStream(buffer).pipe(stream);
        });
      };
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