import { Mentor } from "../models/mentor.model.js";
import { google } from 'googleapis';
import fs from 'fs';
import { User } from "../models/user.model.js";

// Load credentials
let googleCredentials = {"web":{"client_id":"95005054001-7scm85immvtv22gt70q2glajks7asneq.apps.googleusercontent.com","project_id":"mentor-mentee-443205","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:3000/redirect"],"javascript_origins":["http://localhost:3000"]}}

const credentials = googleCredentials;
const { client_id, client_secret, redirect_uris } = credentials.web;

// Set up OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Generate auth URL for Google login
export const loginAuth = async (req, res) => {
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', // Ensure refresh token is granted
            scope: ['https://www.googleapis.com/auth/calendar.events'],
        });
        res.status(200).json({ success: true, google_auth_url: authUrl });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
        console.error('Error generating auth URL:', error);
    }
};

// Handle Google OAuth callback and exchange code for tokens
export const handleGoogleCallback = async (req, res) => {
    try {
        const { code } = req.body; // Get the authorization code from the request body

        // Exchange the authorization code for tokens
        const { tokens } = await oAuth2Client.getToken(code);

        // Set the tokens to the OAuth2 client
        oAuth2Client.setCredentials(tokens);

        // Save the tokens to a file
        fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));

        res.status(200).json({ success: true, message: "Authentication successful!", tokens });
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        res.status(500).json({ success: false, message: "Failed to authenticate" });
    }
};

// Generate Google Meet link by creating an event
export const generateMeetingLink = async (req, res) => {
    try {
        const { summary, description, startTime, endTime, attendees, user_id, mentor_id } = req.body;
        // Load credentials
        // const credentials = JSON.parse(fs.readFileSync('./creditentials.json'));
        const credentials = googleCredentials;
        const { client_id, client_secret, redirect_uris } = credentials.web;

        // Set up OAuth2 client
        const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0]
        );

        if (fs.existsSync('tokens.json')) {
            const tokens = JSON.parse(fs.readFileSync('tokens.json'));
            oAuth2Client.setCredentials(tokens);
          }
        // Ensure oAuth2Client has credentials set
        if (!oAuth2Client.credentials) {
            return res.status(403).json({ message: "Unauthorized. Please authenticate first.", success: false });
        }

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const event = {
            summary,
            description,
            start: { dateTime: startTime, timeZone: 'UTC' },
            end: { dateTime: endTime, timeZone: 'UTC' },
            attendees: attendees.map(email => ({ email })),
            conferenceData: {
                createRequest: { requestId: `meet-${Date.now()}` },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1, // Required for creating Google Meet links
        });

        const mentor = await Mentor.findOne({ _id : mentor_id});
        if(!mentor){
            res.status(404).json({ message : "Mentor not Found", success : false });
        }

        const user = await User.findOneAndUpdate(
            { _id: user_id }, 
            {
                $push: {
                    mySchedules: {
                        mentor_id: mentor._id.toString(),
                        mentor_name: mentor.name,
                        start_time: startTime,
                        end_time: endTime,
                        meeting_link: response.data.hangoutLink
                    },
                    myMatches : mentor
                }
            },
            { new: true }
        );

        await Mentor.findByIdAndUpdate(mentor_id, {
            $push: {
                bookedMenteeIds: user_id,
            },
        });
        if(!user){
            res.status(404).json({ message : "User not Found", success : false });
        }

        res.status(200).json({
            success: true,
            message: 'Event created successfully!',
            meetLink: response.data.hangoutLink,
        });
    } catch (error) {
        res.status(500).json({ message: error.response?.data || error.message || "Internal Server Error", success: false });
        console.error('Error creating meeting link:', error.response?.data || error.message);
    }
};

// Example route to get mentor details
export const getMentorDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const mentor = await Mentor.findOne({ _id: id });
        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found', success: false });
        }
        res.status(200).json({ success: true, mentor });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
        console.error('Error fetching mentor details:', error);
    }
};

// Example route to update agreed mentees
export const updateAgreedMentee = async (req, res) => {
    try {
        const { mentee_id, mentor_id } = req.body;

        await Mentor.findByIdAndUpdate(mentor_id, {
            $push: {
                agreedMenteeIds: mentee_id,
            },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
        console.error('Error updating agreed mentee:', error);
    }
};