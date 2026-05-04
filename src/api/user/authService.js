import axiosInstance from './axiosInstance';

// ─────────────────────────────────────────
// 일반 로그인
// POST /api/auth/login
// ─────────────────────────────────────────
async function loginWithEmail({ email, password, rememberMe }) {
    if (!email || !password) {
        const error = new Error('이메일과 비밀번호를 입력해주세요.');
        error.status = 400;
        throw error;
    }

    const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
    });

    // accessToken은 localStorage에 저장
    // refreshToken은 HttpOnly Cookie로 자동 저장됨
    const accessToken = response.data.accessToken;
    localStorage.setItem('accessToken', accessToken);

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
}

// ─────────────────────────────────────────
// 일반 회원가입
// POST /api/auth/signup
// ─────────────────────────────────────────
async function signupWithEmail({ email, password, name }) {
    if (!email || !password || !name) {
        const error = new Error('필수 입력값을 확인해주세요.');
        error.status = 400;
        throw error;
    }

    await axiosInstance.post('/api/auth/signup', {
        email,
        password,
        name,
    });

    // 회원가입 성공 후 자동 로그인
    return loginWithEmail({ email, password, rememberMe: false });
}

// ─────────────────────────────────────────
// 로그아웃
// POST /api/auth/logout
// ─────────────────────────────────────────
async function logout() {
    try {
        await axiosInstance.post('/api/auth/logout');
    } finally {
        localStorage.removeItem('accessToken');
    }
    return { success: true };
}

// ─────────────────────────────────────────
// Google OAuth 로그인 시작
// 백엔드로 리다이렉트 (axios 아님)
// ─────────────────────────────────────────
function loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}

// ─────────────────────────────────────────
// OAuth code 교환
// POST /api/auth/oauth/tokens
// ─────────────────────────────────────────
async function exchangeOauthCode(code) {
    const response = await axiosInstance.post('/api/auth/oauth/tokens', { code });

    const accessToken = response.data.accessToken;
    localStorage.setItem('accessToken', accessToken);

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
}

export const authService = {
    loginWithEmail,
    signupWithEmail,
    logout,
    loginWithGoogle,
    exchangeOauthCode,
};