const express=require('express')
const {getUserController, postUserController, loginUserController, requestForVacineController, updateUserController, changePassWordController} =require('../conrollers/userController.js');
const userLoginMiddleware = require('../middleware/userAuthenticationMiddleware.js');

 const user_router=express.Router();

 user_router.get('/users',userLoginMiddleware,getUserController)
 user_router.post('/addUsers',postUserController)
 user_router.post('/userLogin',loginUserController)
 user_router.get('/users/:id',userLoginMiddleware,requestForVacineController)
 user_router.put('/updateUser',userLoginMiddleware,updateUserController)
 user_router.put('/userPassword',userLoginMiddleware,changePassWordController)
 
 
 
 module.exports= user_router         