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

        // ✅ Check if the user already has an RSVP for this event
        const existingRSVP = user.rsvps.find(
            r => String(r.eventId) === String(eventId)
        );

        if (existingRSVP) {
            // ✅ Update status + updatedAt
            existingRSVP.status = status;
            existingRSVP.updatedAt = new Date();
        } else {
            // ✅ Insert new RSVP
            user.rsvps.push({
                eventId,
                status,
                updatedAt: new Date(),
            });
        }

        await user.save();

        return res.status(200).json({
            msg: 'RSVP saved successfully',
            rsvps: user.rsvps,
        });

    } catch (error) {
        return res.status(500).json({ msg: 'Server Error: ' + error.message });
    }
};

module.exports = { insertUserRSVP };
