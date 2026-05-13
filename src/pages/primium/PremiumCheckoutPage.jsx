import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useEffect } from 'react';  
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { subscriptionService } from '../../api/user/subscriptionService';
import { usePayment } from '../../hooks/user/usePayment';

function PremiumCheckoutPage() {
    const navigate = useNavigate();
    const subscriptionProductId = useMapingoStore((state) => state.subscriptionProductId);
    const isAuthenticated = useMapingoStore((state) => state.isAuthenticated);
    const products = subscriptionService.fetchSubscriptionProducts();
    const selectedProduct =
        products.find((product) => product.id === subscriptionProductId) ?? products[0];

    // 결제 수단 고정 
    const { checkout, isSubmitting, errorMessage } = usePayment();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleCheckout = async () => {
        await checkout({
            productId: subscriptionProductId ?? selectedProduct.id,
            paymentMethod: 'kakao',
        });
    };
    if (!isAuthenticated) return null;

    // 선택된 플랜 없으면 플랜 선택 페이지로 이동
    useEffect(() => {
    if (!subscriptionProductId) {
        navigate('/premium/plans');
        }
    }, [subscriptionProductId, navigate]);

    return (
        <div className="mapingo-dashboard">
            <MapingoPageSection
                eyebrow="Payment"
                title="결제 처리"
                description="선택한 구독 플랜과 결제 수단을 확인하고 결제를 진행하는 화면입니다."
            >
                <div className="mapingo-page-actions">
                    <button
                        type="button"
                        className="mapingo-ghost-button"
                        onClick={() => navigate('/premium/plans')}
                    >
                        플랜 선택으로
                    </button>
                </div>
            </MapingoPageSection>

            <section className="mapingo-admin-grid">
                <article className="mapingo-list-card">
                    <div className="mapingo-card-header-row">
                        <h3>주문 요약</h3>
                    </div>
                    <div className="mapingo-selectable-list">
                        <article className="mapingo-post-card">
                            <strong>{selectedProduct.name}</strong>
                            <p>{selectedProduct.description}</p>
                            <div className="mapingo-inline-badges">
                                <span className="mapingo-inline-badge">{selectedProduct.billingLabel}</span>
                                <span className="mapingo-inline-badge">{selectedProduct.price}</span>
                            </div>
                        </article>
                    </div>
                </article>

                <article className="mapingo-list-card">
                    <div className="mapingo-card-header-row">
                        <h3>결제</h3>
                    </div>
                    <div className="mapingo-admin-form">
                        {errorMessage ? (
                            <p className="mapingo-form-error">{errorMessage}</p>
                        ) : null}

                        <div className="mapingo-admin-action-row" style={{ justifyContent: 'center' }}>
                            <button
                                type="button"
                                className="mapingo-submit-button"
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                style={{ width: '100%' }}
                            >
                                {isSubmitting ? '결제 처리 중...' : '결제하기'}
                            </button>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
}

export default PremiumCheckoutPage;