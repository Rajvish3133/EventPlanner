const express=require('express');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const cors = require('cors');


require('dotenv').config();
const app=express();
const PORT=process.env.PORT

app.use(express.json());
app.use(cookieParser());


// app.use('/',(req,res)=>{
//     res.send('API is running...');
// });
app.use(
  cors({
    origin: "*", // allow all domains
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use('/api/auth',authRoutes);
app.use('/api/events', require('./routes/event.routes'));


app.listen(PORT,()=>{
    connectDb();
    console.log('Server is running on port '+PORT);
})

