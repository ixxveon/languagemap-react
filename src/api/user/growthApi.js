import axiosInstance from "../axiosInstance";

export const getGrowthReport = async () => {
    const response = await axiosInstance.get("/api/growth/report");
    return response.data;
};