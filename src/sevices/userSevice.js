var bcrypt = require('bcryptjs')
var salt = bcrypt.genSaltSync(10)
const User = require('../model/userModel')
const Us = require('../model/usModel')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
// const bcrypt = require('bcrypt');
const { genneralAccessToken, genneralRefreshToken } = require('./jwtService')
const createUser = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const { name ,email ,confirm } = newUser 
        try {
            if(!email){
                reject({
                    status:"errrr"
                })
            }
            if (newUser.password === confirm) {
                console.log('goood')
                const hash = bcrypt.hashSync(newUser.password , salt)
                const password = hash 
                //const name = email 

                const createdUser =await User.create({
                    name ,
                    email, 
                    password,
              
                })
                if (createdUser) {
                    resolve({
                        status: "OK",
                        message: "GOOD" ,
                        data :createdUser
                    })
                }
            }
        } catch (e) {
            reject({
                status : "Create error"
            })
        }
    })
}
const upUs = (newUser) => {
    return new Promise(async(resolve, reject) => {
        const { email ,password  } = newUser 
        try {
            const user=  await Us.findOne({email : email })
            if(!user){
                reject({
                    status:"errrr"
                })
            }
            if (password) {
                console.log('goood')
                const hash = bcrypt.hashSync(newUser.password , salt)
                //const password = hash 
                console.log(hash)
                //const name = email 
               
                console.log(user)
            
                user.password = password 
                const run  = await Us.findByIdAndUpdate(user._id , { 
                    password : hash
                  },
                  {
                    new: true, 
                  
                  } )
                resolve({
                    status: "OK",
                    message: "GOOD" ,
                    data :user
                })
            }
        } catch (e) {
            reject({
                status : "Create error"
            })
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser =await User.find()
            if(!allUser){
                resolve({
                    status : 'Dont Create'
                })
            }
            resolve({
                status : "Good !" ,
                data : allUser
            })
            
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}
// await Model.updateMany(
//     {}, // filter rỗng = tất cả documents
//     { $set: { fieldName: newValue } }
//   );
const getUserDetail = (paramId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userId = paramId
            const user = await User.findOne({
                _id : userId 
            }) 
            resolve({
                status: "Tốt Sý!",
                user : user 
            })
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}

const forgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email } = data;
            const user = await User.findOne({ email });
          
            if (!user) {
                reject({
                    status : "sendmail error"
                })
            }
            console.log(user)
            // Tạo token reset password
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // Token có hiệu lực 1 giờ
            console.log(resetToken)
            console.log(resetTokenExpiry)
            // Lưu token vào database
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();
        
            // Cấu hình email
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'quockp2@gmail.com',
                pass: 'uehduvgzqiudrksp'
              }
            });
        
            // Link reset password
            const resetUrl = `http://your-domain.com/reset-password/${resetToken}`;
        
            // Nội dung email
            const mailOptions = {
              from: 'quockp2@gmail.com',
              to: email,
              subject: 'Reset Password',
              html: `
                <p>Bạn đã yêu cầu reset password.</p>
                <p>Click vào link sau để reset password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Link này sẽ hết hạn sau 1 giờ.</p>
              `
            };
        
            // Gửi email
            await transporter.sendMail(mailOptions);
        
            resolve({
                status: "success!",
                user : user 
            })
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
}
const resetPassword = (data , token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { password ,confirm } = data;
            
            const user = await User.findOne({
              resetPasswordToken: token,
              resetPasswordExpires: { $gt: Date.now() }
            });
        
            if (!user || password!==confirm) {
                reject({
                    status : "error"
                })
            }
            
            // Hash password mới
           // const salt = await bcrypt.genSalt(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            
            console.log("hash" ,hashedPassword)
            // Update password và xóa token
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        
            resolve({
                status: "success!",
                user : user 
            })
            5


                    
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}

const loginUser = (userlogin) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user =await User.findOne({
                email : userlogin.email
            })
            console.log("Aaaa", user)
           if (user) {
            console.log(userlogin.password)
               console.log(bcrypt.compareSync(userlogin.password ,user.password))
             
                   if (bcrypt.compareSync(userlogin.password ,user.password)){
                       console.log('succsess')
                       console.log(userlogin.password)
                       // console.log(user.id)
                       // console.log(user.isAmin)
                           const access_token =await genneralAccessToken({
                               id : user.id,
                               isAdmin : user.isAdmin 
                           } )
                           const refresh_token =await genneralRefreshToken({
                               id :user.id,
                               isAdmin : user.isAdmin
                           })
                       resolve({
                           status :"Ok",
                           data : user ,
                           access_token ,
                           refresh_token
                       })
               }
               else {
                resolve({
                    status :"Sai mật khẩu",
                })
               }
                 
               }
            
        }
        catch (e) {
            reject({
                status : "Create error"
            })
        }        
    })
    
}
module.exports = {
    createUser,
    getAllUser,
    getUserDetail,
    loginUser,
    upUs,
    forgotPassword,
    resetPassword
}