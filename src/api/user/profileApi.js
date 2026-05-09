import axiosInstance from "../axiosInstance";

export const getLearningProfile = async () => {
    const response = await axiosInstance.get("/api/profile");
    return response.data;
};