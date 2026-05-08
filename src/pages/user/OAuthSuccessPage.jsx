import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/user/useAuth';
import { useMapingoStore } from '../../store/user/useMapingoStore';

function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { exchangeOauthCode } = useAuth();
    const clearSession = useMapingoStore((state) => state.clearSession);
    const executed = useRef(false);

    useEffect(() => {
        if (executed.current) return;
        executed.current = true;

        const code = searchParams.get('code');
        if (!code) {
            navigate('/login');
            return;
        }

        const fromSignup = sessionStorage.getItem('oauthFrom') === 'signup';
        sessionStorage.removeItem('oauthFrom');

        exchangeOauthCode(code)
            .then((session) => {
                console.log('session:', session);
                console.log('profileRequired:', session.profileRequired);
                console.log('fromSignup:', fromSignup);

                if (fromSignup && !session.profileRequired) {
                    // ✅ 세션 초기화 후 에러 메시지 남기고 /signup으로 이동
                    clearSession();
                    localStorage.removeItem('accessToken');
                    sessionStorage.setItem('signupError', 'already_exists');
                    navigate('/signup');
                    return;
                }

                if (session.profileRequired) {
                    navigate('/profile/setup');
                } else {
                    navigate('/');
                }
            })
            .catch((error) => {
                console.log('OAuth 에러:', error);
                navigate('/login');
            });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>로그인 처리 중입니다...</p>
        </div>
    );
}

export default OAuthSuccessPage;