import { User } from "../models/user.model.js";

export const removeExpiredSchedules = async ( req, res ) => {
    try {
        const now = new Date();
        const user = await User.findById( req.user._id );

        if(!user){
            res.status(404).json({ message : "User not found", success : false });
            return;
        }

        user.mySchedules = user.mySchedules.filter(schedule => new Date(schedule.end_time) >= now);

        await user.save();

        res.status(200).json({ message : "Expired schedules are removed." , success : true });
    } catch (error) {
        res.status(500).json({ message : "Internal Server Error", success : false });
        console.error(error);
    }
}