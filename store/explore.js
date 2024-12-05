import { create } from "zustand";
import axios from 'axios';
import Cookies from "js-cookie";
import { toast } from "sonner";


export const useExploreStore = create((set)=> ({
    mentors : [],
    exploreMentors : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/explore/explore-content`, credentials,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            set({ mentors : data.content })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    }
}))