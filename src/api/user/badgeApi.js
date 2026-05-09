import axiosInstance from "../axiosInstance";

export const getUserBadges = async () => {
    const response = await axiosInstance.get("/api/badges");
    return response.data;
};