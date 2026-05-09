import axiosInstance from '../axiosInstance';



// 로그인
async function loginWithEmail({ email, password, rememberMe }) {
    if (!email || !password) {
        const error = new Error('이메일과 비밀번호를 입력해주세요.');
        error.status = 400;
        throw error;
    }

    try {
        const response = await axiosInstance.post('/api/auth/login', { email, password });
        const accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        return {
            loginMethod: 'email',
            keepSignedIn: Boolean(rememberMe),
            user: {
                userId: response.data.userId,
                email: response.data.email,
                name: response.data.name,    
                role: response.data.role?.toLowerCase() ?? 'user',
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
        await axiosInstance.post('/api/auth/signup', {
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
        await axiosInstance.post('/api/auth/logout');
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
        const response = await axiosInstance.post('/api/auth/oauth/tokens', { code });
        const accessToken = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        const meResponse = await axiosInstance.get('/api/users/me');
        const user = meResponse.data;

        return {
            loginMethod: 'google',
            keepSignedIn: false,
            profileRequired: response.data.profileRequired,
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name,
                role: user.role.toLowerCase(),
                status: user.status,
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