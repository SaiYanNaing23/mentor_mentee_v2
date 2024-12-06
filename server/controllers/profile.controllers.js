import { User } from "../models/user.model.js";

export const updateProfileFields = async (req, res) => {
    try {
        const { user_id, username, job_title, bio, experience } = req.body;

        if (!user_id) {
            return res.status(404).json({ message: "User Id is required", success: false });
        }

        const updates = {};
        if (username) updates.username = username;
        if (job_title) updates.job_title = job_title;
        if (bio) updates.bio = bio;
        if (experience) updates.experience = experience;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields provided to update", success: false });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user_id, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({ message: "Profile updated successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
        console.error(error);
    }
};

export const addSkills = async ( req, res ) => {
    try {
        const { user_id , skill } = req.body;

        if(!user_id){
            res.status(404).json({ message: "User not found", success: false });
        }

        await User.findByIdAndUpdate(
            user_id,
            {
                $push : {
                    skills : skill
                }
            }
        )

        res.status(200).json({ message: "Successfully added skills", success: true });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
        console.error(error)
    }
}