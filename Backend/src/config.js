import dotenv from "dotenv";
dotenv.config();

console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
 export const config ={
bd:{
 URI:process.env.DB_URI || "mongodb://localhost:27017/IdeartDetalles",

},
server:{
 port:process.env.PORT || 4000,

},
jwt:{
secret: process.env.JWT_SECRET,
expiresIn: process.env.JWT_EXPIRES,
},
email:{
email:"noreply.ideartdetallessv3@gmail.com",
password:process.env.APP_PASSWORD_EMAIL,

},
admin:{
   email: process.env.ADMIN_EMAIL,
   password:process.env.ADMIN_PASSWORD,
},
cloudinary:
{
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true
},
 };
 
 //sdadasSDSD