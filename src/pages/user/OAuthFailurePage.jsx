import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthFailurePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message');

    const isAlreadyExists = message?.includes('이미 가입된 이메일');
    const isAuthRequestNotFound = message?.includes('authorization_request_not_found');
    const isDeletedUser = message?.includes('탈퇴한 계정');

    return (
        <section style={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <article style={{
                background: 'var(--bg-secondary, #fff)',
                border: '1px solid var(--border, #dee2e6)',
                borderRadius: '1rem',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '480px',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>
                    {isAlreadyExists ? '이미 가입된 계정입니다' : '소셜 로그인 실패'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                    {isAlreadyExists
                        ? '해당 이메일로 이미 일반 계정이 존재합니다. 로그인 페이지에서 소셜 로그인을 이용해주세요.'
                        : isDeletedUser
                        ? '탈퇴한 계정입니다. 신규 가입을 진행해주세요.'
                        : isAuthRequestNotFound
                        ? '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
                        : message || '소셜 로그인 중 오류가 발생했습니다.'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        type="button"
                        className="mapingo-login-primary"
                        style={{ padding: '0.75rem 2rem' }}
                        onClick={() => navigate('/login')}
                    >
                        로그인 페이지로 이동
                    </button>
                    <button
                        type="button"
                        className="mapingo-ghost-button"
                        style={{ padding: '0.75rem 2rem' }}
                        onClick={() => navigate('/signup')}
                    >
                        회원가입으로 이동
                    </button>
                </div>
            </article>
        </section>
    );
}

export default OAuthFailurePage;