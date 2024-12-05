import { Mentor } from "../models/mentor.model.js";
import { User } from "../models/user.model.js";

export const getExploreContent = async (req, res) => {
    try {
        const { field } = req.body;
        const user_input_field = field.trim().toLowerCase();

        if(user_input_field === 'recommendation'){
            const mentee = await User.findById(req.user._id);
            res.status(200).json({ content: mentee.matchedWith, success: true });
            return;
        }
        const results = await Mentor.aggregate([
            { $match: { field: { $regex: `^${user_input_field}$`, $options: 'i' } } },
            // { $sample: { size: 8 } },
        ]);

        if(!results.length){
            res.status(404).json({ message: "No mentors found matching the field", success: false });
            return;
        }
      
        res.status(200).send({ content: results, success: true });

    } catch (error) {
        res.status(500).json({ message : "Internal Server Error", success : false });
        console.log(error);
    }
}