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
        exchangeOauthCode(code)
            .then((session) => {
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