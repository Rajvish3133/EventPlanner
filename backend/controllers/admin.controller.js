const Even=require('../models/Even.module');



const createEvent = async (req, res) => {
    try {
        const { title, description, date, cloudinaryID, location, category, startTime, endTime } = req.body;

        const newEvent = new Even({
            title,
            description,
            date,
            cloudinaryID,
            location,
            category,
            startTime,
            endTime
        });

        await newEvent.save();
        return res.status(201).json({ msg: 'Event created', event: newEvent });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });

    }
}

const getEvents = async (req, res) => {
    try {
        const events = await Even.find();
        return res.status(200).json({ events });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
}

const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updates = req.body;

        const event = await Even.findByIdAndUpdate(eventId, updates, { new: true });
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        return res.status(200).json({ msg: 'Event updated', event });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
}

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Even.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        return res.status(200).json({ msg: 'Event deleted successfully', event });
    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
}


module.exports={createEvent,getEvents,updateEvent,deleteEvent};