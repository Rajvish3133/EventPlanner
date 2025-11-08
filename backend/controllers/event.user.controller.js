const User = require('../models/user.model');
const Event = require('../models/Even.module');

const insertUserRSVP = async (req, res) => {
    try {
        const userId = req.params.userId;
        const eventId = req.params.eventId;
        const { status } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // ✅ Check if RSVP already exists in USER.rsvps
        const existingUserRSVP = user.rsvps.find(
            r => String(r.eventId) === String(eventId)
        );

        if (existingUserRSVP) {
            // ✅ Update status & timestamp
            existingUserRSVP.status = status;
            existingUserRSVP.updatedAt = new Date();
        } else {
            // ✅ Insert new
            user.rsvps.push({
                eventId,
                status,
                updatedAt: new Date(),
            });
        }

        await user.save();

        // ✅ Same logic for EVENT.rsvps
        const existingEventRSVP = event.rsvps.find(
            r => String(r.userId) === String(userId)
        );

        if (existingEventRSVP) {
            // ✅ Update status & timestamp in event.rsvps
            existingEventRSVP.status = status;
            existingEventRSVP.updatedAt = new Date();
        } else {
            // ✅ Insert new
            event.rsvps.push({
                userId,
                status,
                updatedAt: new Date(),
            });
        }

        await event.save();

        return res.status(200).json({
            msg: 'RSVP saved successfully',
            event,
        });

    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};

module.exports = { insertUserRSVP };
