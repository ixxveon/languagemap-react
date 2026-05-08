import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/user/authService';
import { userService } from '../../api/user/userService';  
import { useMapingoStore } from '../../store/user/useMapingoStore';

export function useAuth() {
    const navigate = useNavigate();
    const setSession = useMapingoStore((state) => state.setSession);
    const clearSession = useMapingoStore((state) => state.clearSession);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 로그인 
    const login = async ({ email, password, rememberMe }) => {
        try {
            setIsSubmitting(true);
            setErrorMessage('');
            const session = await authService.loginWithEmail({ email, password, rememberMe });
            setSession(session);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message || '로그인에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 회원가입 
    const signup = async (form) => {
        try {
            setIsSubmitting(true);
            setErrorMessage('');
            const session = await authService.signupWithEmail(form);
            setSession(session);
            navigate('/');
        } catch (error) {
            setErrorMessage(error.message || '회원가입에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('로그아웃 오류:', error);
        } finally {
            clearSession();
            navigate('/');
        }
    };

    // 구글 로그인
    const loginWithGoogle = () => {
        authService.loginWithGoogle();
    };

    // 소셜 로그인 
const exchangeOauthCode = async (code) => {
    try {
        setIsSubmitting(true);
        console.log('exchangeOauthCode 시작:', code);  // 로그 추가
        const session = await authService.exchangeOauthCode(code);
        console.log('session 받음:', session);  // 로그 추가
        setSession(session);
        return session;
    } catch (error) {
        console.log('exchangeOauthCode 에러:', error);  // 로그 추가
        setErrorMessage(error.message || '소셜 로그인에 실패했습니다.');
        throw error;
    } finally {
        setIsSubmitting(false);
    }
};

    // 프로필 정보 입력
    const setupProfile = async (form) => {
    try {
        setIsSubmitting(true);
        setErrorMessage('');
        await userService.setupProfile(form);
        navigate('/');
    } catch (error) {
        setErrorMessage(error.message || '프로필 입력에 실패했습니다.');
    } finally {
        setIsSubmitting(false);
    }
};


    const restoreSession = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const user = await userService.getMe();
            setSession({
                loginMethod: 'restore',
                keepSignedIn: true,
                user: {
                    userId: user.userId,
                    email: user.email,
                    name: user.name,
                    role: user.role.toLowerCase(),
                    status: user.status,
                    provider: 'local',
                },
            });
        } catch (error) {
            localStorage.removeItem('accessToken');
            clearSession();
        }
    };




    return {
        login,
        signup,
        logout,
        loginWithGoogle,
        restoreSession,
        exchangeOauthCode,
        setupProfile ,
        isSubmitting,
        errorMessage,
        setErrorMessage,
    };
}