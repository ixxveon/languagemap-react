import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PingPopLogo from '../../components/user/PingPopLogo';
import { useAuth } from '../../hooks/user/useAuth';

function SignupPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signup, isSubmitting, errorMessage, setErrorMessage, loginWithGoogle } = useAuth();
    const [form, setForm] = useState({
        name: '',
        birthDate: '',
        address: '',
        phone: '',
        email: '',
        password: '',
        passwordConfirm: '',
        agreeAll: false,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
    });

    
    useEffect(() => {
    const error = searchParams.get('error') || sessionStorage.getItem('signupError');
    sessionStorage.removeItem('signupError');
    if (error === 'already_exists') {
        setErrorMessage('이미 가입된 소셜 계정입니다. 로그인 페이지에서 소셜 로그인을 이용해주세요.');
    }
}, []);

    // 하이픈 자동 포맷 (화면 표시용 UI 로직)
    const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => {
            if (name === 'agreeAll') {
                return {
                    ...current,
                    agreeAll: checked,
                    agreeTerms: checked,
                    agreePrivacy: checked,
                    agreeMarketing: checked,
                };
            }
            const next = {
                ...current,
                [name]: name === 'phone'
                    ? formatPhoneNumber(value)
                    : type === 'checkbox' ? checked : value,
            };
            if (name.startsWith('agree')) {
                next.agreeAll = next.agreeTerms && next.agreePrivacy && next.agreeMarketing;
            }
            return next;
        });
    };

    const handleSignup = async () => {
        await signup(form);
    };

    return (
        <section className="mapingo-signup-shell">
            <article className="mapingo-signup-card">
                <div className="mapingo-login-card-head">
                    <div className="mapingo-login-logo-shell">
                        <PingPopLogo className="mapingo-login-logo" />
                    </div>
                    <div>
                        <h2>Mapingo Sign Up</h2>
                        <p>회원가입 후 학습을 시작해보세요</p>
                    </div>
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-name">이름</label>
                    <input id="mapingo-signup-name" className="mapingo-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="홍길동" />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-birth">생년월일</label>
                    <input id="mapingo-signup-birth" className="mapingo-input" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-address">주소</label>
                    <input id="mapingo-signup-address" className="mapingo-input" type="text" name="address" value={form.address} onChange={handleChange} placeholder="서울시 강남구" />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-phone">전화번호</label>
                    <input id="mapingo-signup-phone" className="mapingo-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="010-1234-5678" />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-email">이메일</label>
                    <input id="mapingo-signup-email" className="mapingo-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@mapingo.ai" />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-password">비밀번호</label>
                    <input id="mapingo-signup-password" className="mapingo-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••••" />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-signup-password-confirm">비밀번호 확인</label>
                    <input id="mapingo-signup-password-confirm" className="mapingo-input" type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange} placeholder="••••••••••" />
                </div>

                <div className="mapingo-signup-agreement">
                    <label className="mapingo-login-check">
                        <input type="checkbox" name="agreeAll" checked={form.agreeAll} onChange={handleChange} />
                        <strong>전체 동의</strong>
                    </label>
                    <div className="mapingo-signup-agreement-list">
                        <label className="mapingo-login-check">
                            <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                            <span>서비스 이용약관에 동의합니다.</span>
                        </label>
                        <label className="mapingo-login-check">
                            <input type="checkbox" name="agreePrivacy" checked={form.agreePrivacy} onChange={handleChange} />
                            <span>개인정보 수집 및 이용에 동의합니다.</span>
                        </label>
                        <label className="mapingo-login-check">
                            <input type="checkbox" name="agreeMarketing" checked={form.agreeMarketing} onChange={handleChange} />
                            <span>마케팅 정보 수신에 동의합니다. (선택)</span>
                        </label>
                    </div>
                </div>

                {errorMessage ? <p className="mapingo-form-error">{errorMessage}</p> : null}

                <button type="button" className="mapingo-login-primary" onClick={handleSignup} disabled={isSubmitting}>
                    {isSubmitting ? '회원가입 중...' : '이메일로 회원가입'}
                </button>

                <div className="mapingo-login-divider">
                    <span>또는</span>
                </div>

                <button
                    type="button"
                    className="mapingo-login-social"
                    onClick={() => {
                        if (!form.agreeTerms || !form.agreePrivacy) {
                            setErrorMessage('필수 약관에 동의해주세요.');
                            return;
                        }
                        sessionStorage.setItem('oauthFrom', 'signup');
                        loginWithGoogle();
                    }}
                >
                    G 구글로 회원가입
                </button>

                <div className="mapingo-login-footer">
                    <span>이미 계정이 있나요?</span>
                    <button type="button" className="mapingo-link-button" onClick={() => navigate('/login')}>로그인</button>
                </div>
            </article>
        </section>
    );
}

export default SignupPage;