import axiosInstance from "../axiosInstance";

export const getLearningProfile = async () => {
    const response = await axiosInstance.get("/api/profile");
    return response.data;
};

async function readRecentLearningPlaces() {
    const response = await axiosInstance.get('/api/users/me/recent-learning-places');

    return response.data;
}