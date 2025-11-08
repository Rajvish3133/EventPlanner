const express=require('express');
const { insertUserRSVP } = require('../controllers/event.user.controller');

const routes=express.Router();

routes.put('/:userId/:eventId',insertUserRSVP);

module.exports=routes;