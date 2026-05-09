import { useEffect, useState } from "react";
import { getGrowthReport } from "../../api/user/growthApi";

export const useGrowthReport = () => {
    const [growthReport, setGrowthReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    getGrowthReport()
        .then((data) => setGrowthReport(data))
        .catch((err) => {
        console.error("성장 리포트 조회 실패:", err);
        setError(err);
        })
        .finally(() => setLoading(false));
    }, []);

    return { growthReport, loading, error };
};