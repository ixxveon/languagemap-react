import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/user/useAuth';

function OAuthSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { exchangeOauthCode } = useAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) {
            navigate('/login');
            return;
        }

        // 회원가입 페이지에서 왔는지 확인
        const fromSignup = document.referrer.includes('/signup');

        exchangeOauthCode(code)
            .then((session) => {
                
                // 회원가입 페이지에서 왔는데 기존 유저면 에러
                if (fromSignup && !session.isNewUser) {
                    navigate('/oauth/failure?error=ALREADY_EXISTS&message=이미 가입된 소셜 계정입니다. 로그인 페이지에서 소셜 로그인을 이용해주세요.');
                    return;
                }

                if (session.profileRequired) {
                    navigate('/profile/setup');
                } else {
                    navigate('/');
                }
            })
            .catch(() => navigate('/login'));
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>로그인 처리 중입니다...</p>
        </div>
    );
}

export default OAuthSuccessPage;