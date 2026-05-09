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
        if (form.password !== form.passwordConfirm) {
            setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        if (!form.agreeTerms || !form.agreePrivacy) {
            setErrorMessage('필수 약관에 동의해주세요.');
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (form.birthDate && new Date(form.birthDate) > today) {
            setErrorMessage('생년월일은 미래 날짜를 선택할 수 없습니다.');
            return;
        }
        const phoneClean = form.phone.replace(/-/g, '');
        if (!/^010\d{8}$/.test(phoneClean)) {
            setErrorMessage('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return;
        }
        try {
            setIsSubmitting(true);
            setErrorMessage('');
            const session = await authService.signupWithEmail({
                ...form,
                phone: phoneClean,
            });
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
        const session = await authService.exchangeOauthCode(code);
        setSession(session);
        return session;
    } catch (error) {
        setErrorMessage(error.message || '소셜 로그인에 실패했습니다.');
        throw error;
    } finally {
        setIsSubmitting(false);
    }
};

    // 프로필 정보 입력
    const setupProfile = async (form) => {
        if (!form.birthDate || !form.address || !form.phoneNumber) {
            setErrorMessage('모든 항목을 입력해주세요.');
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(form.birthDate) > today) {
            setErrorMessage('생년월일은 미래 날짜를 선택할 수 없습니다.');
            return;
        }
        const phoneClean = form.phoneNumber.replace(/-/g, '');
        if (!/^010\d{8}$/.test(phoneClean)) {
            setErrorMessage('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)');
            return;
        }
    try {
        setIsSubmitting(true);
        setErrorMessage('');
        await userService.setupProfile({
                ...form,
                phoneNumber: phoneClean,
            });
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