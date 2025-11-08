const express=require('express');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/admin.controller');

const routes=express.Router();


routes.post('/eventInsert',createEvent);
routes.get('/getEvents',getEvents);
routes.put('/updateEvent/:id',updateEvent);
routes.delete('/deleteEvent/:id',deleteEvent);
module.exports=routes;