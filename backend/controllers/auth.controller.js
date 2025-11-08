// const mongoose=require('mongoose');
const User=require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
// const { sendOTP, resetOTP } = require('./otp.controller');

const userRegister=async(req,res)=>{
    const {name,email,password,Phonenumber,role}=req.body;

    // console.log('Register Request Body:', req.body);
    try{
        const exist=await User.findOne({email})
        console.log('Existing User:', exist);
        if(exist)
        {
            return res.status(400).json({msg:'User Already Exist'})
        }
        const newUser=new User({
            name,
            email,
            password,
            Phonenumber,
            role,
        });

        const token=newUser.generateToken();
     
        await newUser.save();
        return res.status(201).json({msg:'User Registered Successfully',
            role: newUser.role,
            token: token
        })
    }
    catch(error)
    {
        return res.status(500).json({msg:'Server Error: ' + error.message});
    }
}

const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({msg:'Invalid Email or Password'})
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch)
        {
            return res.status(400).json({msg:'Invalid Email or Password'});
        }

        const token=user.generateToken();

        res.cookie('token', token, {
            httpOnly: true,
         
              secure: false, // true in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })

        return res.status(200).json({
            msg:"User Login Successfully",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                Phonenumber: user.Phonenumber
            }
        })
    }
    catch(error){
        return res.status(500).json({msg:'Server Error:'+ error.message});
    }
}
const getProfile = async (req, res) => {
  try {
    console.log('Authenticated User ID:', req.user._id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};


const logOut=async(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({msg:'User logged out successfully'});
}



module.exports={userRegister,userLogin,getProfile,logOut};