const express=require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { userRegister, userLogin, getProfile, logOut } = require('../controllers/auth.controller');


const routes=express.Router();

routes.post('/register',userRegister)
routes.post('/login',userLogin)
routes.get('/profile',authMiddleware,getProfile)
routes.post('/logout',authMiddleware,logOut)


module.exports=routes;