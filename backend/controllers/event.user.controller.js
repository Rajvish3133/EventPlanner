const User=require('../models/user.model');

const insertUserRSVP=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const eventId=req.params.eventId;

        const user=await User.findById(userId);
        if(!user){
            return res.status(404).json({msg:'User not found'});
        }

        const event=await Even.findById(eventId);
        if(!event){
            return res.status(404).json({msg:'Event not found'});
        }

        event.rsvps.push({userId});
        await event.save();

        return res.status(200).json({msg:'RSVP added',event});
    }catch(error){
        return res.status(500).json({msg:'Server Error: '+error.message});
    }
}

module.exports={insertUserRSVP};