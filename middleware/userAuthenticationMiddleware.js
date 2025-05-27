const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");


const userLoginMiddleware = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (error, decorded) => {
      if (error) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized user",
          error: err.message,
        });
      } else 
      {
	//console.log(decorded)
	req.user=decorded
  console.log(req.user.userId)
	next()
      }
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Authentication failed",
      error
    });
  }
};

module.exports=userLoginMiddleware