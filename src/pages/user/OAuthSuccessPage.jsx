import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../api/user/authService';
import { useMapingoStore } from '../../store/user/useMapingoStore';

function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const setSession = useMapingoStore((state) => state.setSession);

    useEffect(() => {
        const code = searchParams.get('code');

        // code가 없으면 로그인 페이지로
        if (!code) {
            navigate('/login');
            return;
        }

        // code로 accessToken 교환
        authService.exchangeOauthCode(code)
            .then((session) => {
                setSession(session);

                // 프로필 미완성이면 프로필 입력 페이지로
                if (session.profileRequired) {
                    navigate('/profile');
                } else {
                    navigate('/');
                }
            })
            .catch(() => {
                navigate('/login');
            });
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <p>로그인 처리 중입니다...</p>
        </div>
    );
}

export default OAuthSuccessPage;