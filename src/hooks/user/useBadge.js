import { useEffect, useState } from "react";
import { getUserBadges } from "../../api/user/badgeApi";

export const useBadge = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    getUserBadges()
        .then((data) => {
        setBadges(data);
        })
        .catch((err) => {
        console.error("배지 조회 실패:", err);
        setError(err);
        })
        .finally(() => {
        setLoading(false);
        });
    }, []);

    return { badges, loading, error };
};