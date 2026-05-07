import axios from '../axiosInstance';

// 로그인
async function loginWithEmail({ email, password, rememberMe }) {
    if (!email || !password) {
        const error = new Error('이메일과 비밀번호를 입력해주세요.');
        error.status = 400;
        throw error;
    }

    try {
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('accessToken', response.data.accessToken);
        return {
            loginMethod: 'email',
            keepSignedIn: Boolean(rememberMe),
            user: {
                email,
                name: response.data.name ?? email,
                role: response.data.role ?? 'user',
                status: 'ACTIVE',
                provider: 'local',
            },
        };
    } catch (error) {
        const message = error.response?.data?.message || '로그인에 실패했습니다.';
        const newError = new Error(message);
        newError.status = error.response?.status;
        throw newError;
    }
}

// 회원가입
async function signupWithEmail({ email, password, passwordConfirm, name, birthDate, address, phone, agreeTerms, agreePrivacy, agreeMarketing }) {
    if (!email || !password || !name) {
        const error = new Error('필수 입력값을 확인해주세요.');
        error.status = 400;
        throw error;
    }

    try {
        await axios.post('/api/auth/signup', {
            email,
            password,
            passwordConfirm,
            name,
            birthDate,
            address,
            phoneNumber: phone,
            serviceAgree: agreeTerms,
            privacyAgree: agreePrivacy,
            marketingAgree: agreeMarketing,
        });
    } catch (error) {
        // 400 - 필드 유효성 오류 (첫 번째 메시지 표시)
        if (error.response?.status === 400) {
            const data = error.response?.data?.data;
            if (data && typeof data === 'object') {
                const firstMessage = Object.values(data)[0];
                const newError = new Error(firstMessage);
                newError.status = 400;
                throw newError;
            }
        }
        // 409 - 중복 이메일/전화번호 등
        const message = error.response?.data?.message || '회원가입에 실패했습니다.';
        const newError = new Error(message);
        newError.status = error.response?.status;
        throw newError;
    }

    // 회원가입 성공 후 자동 로그인
    return loginWithEmail({ email, password, rememberMe: false });
}

// 로그아웃
async function logout() {
    try {
        await axios.post('/api/auth/logout');
    } finally {
        localStorage.removeItem('accessToken');
    }
    return { success: true };
}

// Google OAuth 시작
function loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}

// OAuth code 교환
async function exchangeOauthCode(code) {
    try {
        const response = await axios.post('/api/auth/oauth/tokens', { code });
        localStorage.setItem('accessToken', response.data.accessToken);
        return {
            loginMethod: 'google',
            keepSignedIn: false,
            profileRequired: response.data.profileRequired,
            user: {
                role: 'user',
                status: 'ACTIVE',
                provider: 'google',
            },
        };
    } catch (error) {
        const message = error.response?.data?.message || 'OAuth 로그인에 실패했습니다.';
        throw new Error(message);
    }
}

export const authService = {
    loginWithEmail,
    signupWithEmail,
    logout,
    loginWithGoogle,
    exchangeOauthCode,
};