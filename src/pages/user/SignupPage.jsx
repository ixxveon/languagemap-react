import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PingPopLogo from '../../components/user/PingPopLogo';
import { useAuth } from '../../hooks/user/useAuth';

function SignupPage() {
    const navigate = useNavigate();
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
                [name]: type === 'checkbox' ? checked : value,
            };
            if (name.startsWith('agree')) {
                next.agreeAll = next.agreeTerms && next.agreePrivacy && next.agreeMarketing;
            }
            return next;
        });
    };

    const handleSignup = async () => {
        if (form.password !== form.passwordConfirm) {
            setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }
        if (!form.agreeTerms || !form.agreePrivacy) {
            setErrorMessage('필수 약관에 동의해주세요.');
            return;
        }
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
                    <input id="mapingo-signup-birth" className="mapingo-input" type="date" name="birthDate" value={form.birthDate} onChange={handleChange} placeholder="1991-09-03" />
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

                {/* 에러 메시지 표시 */}
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
                    onClick={loginWithGoogle}
                >
                    G 구글로 회원가입
                </button>
                {/* <button type="button" className="mapingo-login-social is-kakao">K 카카오로 회원가입</button> */}

                <div className="mapingo-login-footer">
                    <span>이미 계정이 있나요?</span>
                    <button type="button" className="mapingo-link-button" onClick={() => navigate('/login')}>로그인</button>
                </div>
            </article>
        </section>
    );
}

export default SignupPage;