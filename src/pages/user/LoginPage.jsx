import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PingPopLogo from '../../components/user/PingPopLogo';
import { useAuth } from '../../hooks/user/useAuth';

function LoginPage() {
    const navigate = useNavigate();
    const { login, loginWithGoogle, isSubmitting, errorMessage } = useAuth();
    const [form, setForm] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <section className="mapingo-login-shell">
            <article className="mapingo-login-benefit-card">
                <div className="mapingo-login-benefit-head">
                    <div>
                        <h2>로그인하면 가능한 것</h2>
                        <p>최근 학습 저장, AI 추천 대화, 즐겨찾기, 성장 리포트, 배지, 목표, 프리미엄 코칭까지 개인화된 흐름으로 이어집니다.</p>
                    </div>
                    <span aria-hidden="true">+</span>
                </div>
                <div className="mapingo-login-benefit-divider" />
                <div className="mapingo-login-benefit-list">
                    <article className="mapingo-login-benefit-item">
                        <strong>최근 학습 이어하기</strong>
                        <p>마지막으로 학습한 루트와 대화 미션을 홈과 지도에서 바로 이어서 볼 수 있어요.</p>
                    </article>
                    <article className="mapingo-login-benefit-item">
                        <strong>개인 맞춤 추천</strong>
                        <p>카페, 여행, 출퇴근처럼 자주 고르는 상황을 기준으로 다음 루트를 추천해드려요.</p>
                    </article>
                    <article className="mapingo-login-benefit-item">
                        <strong>성장 기록 확인</strong>
                        <p>연속 학습, 배지 진행도, 발화 점수를 기록해서 학습 흐름을 계속 이어갈 수 있어요.</p>
                    </article>
                </div>
            </article>

            <article className="mapingo-login-card">
                <div className="mapingo-login-card-head">
                    <div className="mapingo-login-logo-shell">
                        <PingPopLogo className="mapingo-login-logo" />
                    </div>
                    <div>
                        <h2>Mapingo Login</h2>
                        <p>학습 데이터를 이어서 불러오세요.</p>
                    </div>
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-login-email">이메일</label>
                    <input
                        id="mapingo-login-email"
                        className="mapingo-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@mapingo.ai"
                    />
                </div>

                <div className="mapingo-field">
                    <label className="mapingo-field-label" htmlFor="mapingo-login-password">비밀번호</label>
                    <input
                        id="mapingo-login-password"
                        className="mapingo-input"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>

                <div className="mapingo-login-meta-row">
                    <label className="mapingo-login-check">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={form.rememberMe}
                            onChange={handleChange}
                        />
                        <span>로그인 상태 유지</span>
                    </label>
                    <button type="button" className="mapingo-link-button">
                        비밀번호 찾기
                    </button>
                </div>

                {/* 에러 메시지 표시 */}
                {errorMessage ? <p className="mapingo-form-error">{errorMessage}</p> : null}

                <button
                    type="button"
                    className="mapingo-login-primary"
                    onClick={() => login(form)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '로그인 중...' : '이메일로 로그인'}
                </button>

                <div className="mapingo-login-divider">
                    <span>또는</span>
                </div>

                <button
                    type="button"
                    className="mapingo-login-social"
                    onClick={loginWithGoogle}
                >
                    G 구글로 계속하기
                </button>
                {/* <button type="button" className="mapingo-login-social is-kakao">
                    K 카카오로 계속하기
                </button> */}

                <div className="mapingo-login-footer">
                    <span>계정이 아직 없나요?</span>
                    <button
                        type="button"
                        className="mapingo-link-button"
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </button>
                </div>
            </article>
        </section>
    );
}

export default LoginPage;