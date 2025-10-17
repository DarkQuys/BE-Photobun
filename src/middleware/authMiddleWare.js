const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

const authMiddleWareAdmin = (req , res, next)=>{
    const authHeader = req.headers.authorization
    console.log(req.headers)
    if (!authHeader) {
      return res.status(401).json({ status: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ status: 'Forbidden' });
      }
      const { payload } = user;
      console.log(payload)
      if (payload.isAdmin === "admin") {
        next();
      } else {
        res.status(403).json({ status: 'Forbidden' });
      }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(req.headers)
    if (!authHeader) {
      return res.status(401).json({ status: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json({ status: 'Forbidden' });
      }
  
      const { payload } = user;
      console.log(payload)
      if (payload.id === userId || payload.isAdmin === "admin") {
        next();
      } else {
        res.status(403).json({ status: 'Forbidden' });
      }
    });
  };


module.exports={
    authUserMiddleWare ,
    authMiddleWareAdmin
}