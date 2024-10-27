
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name:'dxwxy8bvs',
    api_key:'843369711132216',
    api_secret:'4uYwk4WdNnifstioxRDBkd93OG8',
    secure: true
})
// console.log(cloudinary.config());

module.exports=cloudinary
