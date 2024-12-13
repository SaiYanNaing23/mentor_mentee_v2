import { Field } from '../models/field.model.js'
import { Career } from '../models/career.model.js';
import { Specialization } from '../models/specialization.model.js';
import { Skill } from '../models/skill.model.js';
import { User } from '../models/user.model.js';
import { Mentor } from '../models/mentor.model.js';
import ContentBasedRecommender from 'content-based-recommender';

export const field = async (req,res) => {
    try {
        const fields = await Field.find();

        res.status(200).json({ content : fields, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const career = async (req,res) => {
    try {
        const { field, username, country, job_title, company, experience, bio } = req.body;
        const career = await Career.findOne({field : field});
        await User.findByIdAndUpdate(req.user._id,{
            $set : {
                field,
                username,
                country,
                job_title,
                company,
                experience,
                bio
            }
        });

        if(!career){
            res.status(400).json({ message: "Career not found", success: false });
        }

        res.status(200).json({ content : career, success: true });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const specialization= async (req, res) => {
    try {
        const { career } = req.body;

        const specialization = await Specialization.findOne({ career : career })

        if(!specialization){
            res.status(400).json({ message: "Specialization not found", success: false });
        }
        
        await User.findByIdAndUpdate(req.user._id, {
            $set : {
                career,
            }
        })

        res.status(200).json({ content : specialization, success: true });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const getSkill= async (req, res) => {
    try {
        const { specialization } = req.body;
        // Run a MongoDB update query to fix the field name in all documents
        await Skill.updateMany(
            { "specialization ": { $exists: true } }, // Match documents with the incorrect key
            [
                {
                $set: {
                    specialization: {
                    $toLower: { $trim: { input: "$specialization " } } // Trim and convert to lowercase
                    }
                }
                },
                {
                $unset: "specialization " // Remove the old field with the trailing space
                }
            ]
        );          

        const normalizedSpecialization = specialization.trim().toLowerCase();

        const skill = await Skill.findOne({
            specialization: { 
                $regex: new RegExp(`^${normalizedSpecialization}$`, 'i') 
            }
        });
        
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $set : {
                specification: specialization,
            }
        })

        res.status(200).json({ content : skill, success: true });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const updateMenteesChoices = async (req, res) => {
    try {
        const { skills } = req.body;

        // Find the user and get their current skills
        const user = await User.findById(req.user._id);
        const existingSkills = user.skills;

        // Filter skills that are not already in the user's skill set
        const newSkills = skills.filter(skill => !existingSkills.includes(skill));

        // Update only if there are new skills to add
        if (newSkills.length > 0) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    skills: { $each: newSkills },
                }
            });
        }

        res.status(200).json({ message: "Mentees choices updated successfully", success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


export const matching = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { field, career, skills } = user;
        
        // Try to find mentors with case-insensitive match for field and career
        const mentorsFilteredByFieldAndCareer = await Mentor.find({
            field: { $regex: new RegExp(`^${field}$`, "i") },
            career: { $regex: new RegExp(`^${career}$`, "i") }
        });

        // Content based recommender

        // User id and specification
        const posts = [
            {
              id: user._id.toString(),
              content: user.specification.trim(),
            }
        ];

        // Mentor job titles and skills as tags
        const tags = [];
        mentorsFilteredByFieldAndCareer.map((mentor)=> {
            tags.push({
                id: mentor._id.toString(),
                content: mentor.job_title.trim(),
            })
        })

        const recommender = new ContentBasedRecommender({
            minScore: 0.1,
            maxSimilarDocuments: 10
          });

        recommender.trainBidirectional(posts, tags);

        let mentorsFilteredBySpecification = []
        for (let post of posts) {
            const relatedTags = recommender.getSimilarDocuments(post.id);
            mentorsFilteredBySpecification.push(...relatedTags);
        }

        const matchedMentorsBySpecifications = mentorsFilteredByFieldAndCareer.filter(mentor => 
            mentorsFilteredBySpecification.some(idObj => idObj.id === mentor.id)
        );

        // Train by skills
        const mentorFilteredBySpecification = [];
        matchedMentorsBySpecifications.map((mentor)=> {
            mentorFilteredBySpecification.push({
                id: mentor._id.toString(),
                content: mentor.skills.join(" "),
            })
        })

        const userSkills = [
            {
              id: user._id.toString(),
              content: user.skills.join(" "),
            }
        ];

        recommender.trainBidirectional(userSkills, mentorFilteredBySpecification);

        let MatchedByUserSkills = []
        for (let userSkill of userSkills) {
            const relatedTags = recommender.getSimilarDocuments(userSkill.id);
            MatchedByUserSkills.push(...relatedTags);
        }
        
        const matchedMentorsByScores = mentorsFilteredBySpecification.map((mentor) => {
            const skillMatch = MatchedByUserSkills.find(idObj => idObj.id === mentor.id);
            return {
                ...mentor,
                matchScore: mentor.score + (skillMatch ? skillMatch.score : 0)
            };
        });
    
        const sortedMatchedMentors = matchedMentorsByScores
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0,6)

        const topMentors = await Mentor.find({ _id: { $in: sortedMatchedMentors.map((mentor) => mentor.id) } });

        const sortedTopMentors = sortedMatchedMentors.map((mentor) => {
            const fullMentor = topMentors.find((m) => m._id.toString() === mentor.id);
            return {
                ...fullMentor.toObject(),
            };
        });

        const matchedMentors = matchedMentorsBySpecifications.filter((mentor)=> 
            skills.some(userSkill => 
                mentor.skills.some(mentorSkill => 
                    mentorSkill.toLowerCase() === userSkill.toLowerCase()
                )
            )
        )

        await User.findByIdAndUpdate(req.user._id,{
            $push: {
                matchedWith : { $each: sortedTopMentors},
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}

export const searchingMentors = async (req, res) => {
    try {
        const { user_id, jobTitle } = req.body;
        if( !jobTitle && !user_id ){
            return res.status(400).json({ message: "Job title is required", success: false });
        }
  
        const user = [];
        user.push({
            id: user_id.toString(),
            content: jobTitle.trim(),
        })

        const mentors = await Mentor.find()

        const mentorTag = [];
        mentors.map((mentor)=> {
            mentorTag.push({
                id: mentor._id.toString(),
                content: mentor.job_title.trim(),
            })
        })

        const recommender = new ContentBasedRecommender({
            minScore: 0.1,
            maxSimilarDocuments: 100
          });

        recommender.trainBidirectional(user, mentorTag);

        let searchedMentorIds = []
        for (let post of user) {
            const relatedTags = recommender.getSimilarDocuments(post.id);
            searchedMentorIds.push(...relatedTags);
        }

        let finalSearchingMentors = []
        searchedMentorIds.map((mentor) => {
            const filterMentors = mentors.find((m) => m._id.toString() === mentor.id);
            finalSearchingMentors.push(filterMentors)
        })

        return res.status(200).json({ content : finalSearchingMentors , success: true });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}