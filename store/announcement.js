import { create } from "zustand";
import axios from 'axios';
import Cookies from "js-cookie";
import { toast } from "sonner";


export const useAnnouncementStore = create((set)=> ({
    announcement : [],
    fetchAnnouncement : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/announcement/get-accouncement`, credentials,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            set({ announcement : data.announcement })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    },
    createAnnouncement : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/announcement/create`, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            toast.success("Success", {
                description: 'Announcement is successfully created.'
            })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    },
    deleteAnnouncement : async ( credentials ) => {
        try {
            const token = Cookies.get('token');
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/announcement/delete`, credentials, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                }
            })
            toast.success("Success", {
                description: 'Announcement is successfully deleted.'
            })
        } catch (error) {
            console.error(error);
            toast.error("Error", {
                description: error.response.data.message || error.message
            })
        }
    },
}))

