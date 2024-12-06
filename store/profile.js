import { create } from "zustand";
import axios from 'axios';
import Cookies from "js-cookie";
import { toast } from "sonner";


export const useProfileStore = create((set)=> ({
    updateUserProfile : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile/update`, credentials,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            toast.success("Success", {
                description : " User profile is updated successfully!"
            })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    },
    addSkill : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/profile/add-skill`, credentials,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            toast.success("Success", {
                description : " Skill is added successfully!"
            })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    }
}))