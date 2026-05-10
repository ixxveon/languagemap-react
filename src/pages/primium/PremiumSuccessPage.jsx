import { useNavigate } from 'react-router-dom';

function PremiumSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="mapingo-dashboard">
            <section style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    🎉 결제가 완료됐습니다!
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    프리미엄 구독이 시작됐어요. 모든 기능을 자유롭게 사용해보세요.
                </p>
                <button
                    type="button"
                    className="mapingo-login-primary"
                    onClick={() => navigate('/')}
                >
                    홈으로 이동
                </button>
            </section>
        </div>
    );
}

export default PremiumSuccessPage;