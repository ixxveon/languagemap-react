import { useEffect, useState } from "react";
import { getLearningProfile } from "../../api/user/profileApi";

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    getLearningProfile()
        .then((data) => {
        setProfile(data);
        })
        .catch((err) => {
        console.error("학습 프로필 조회 실패:", err);
        setError(err);
        })
        .finally(() => {
        setLoading(false);
        });
    }, []);

    return { profile, loading, error };
};