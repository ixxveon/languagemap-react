import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import { subscriptionService } from '../../api/user/subscriptionService';

function PremiumCheckoutPage() {
  const navigate = useNavigate();
  const subscriptionProductId = useMapingoStore((state) => state.subscriptionProductId);
  const setSubscriptionPlan = useMapingoStore((state) => state.setSubscriptionPlan);
  const markSubscriptionUpdated = useMapingoStore((state) => state.markSubscriptionUpdated);
  const products = subscriptionService.fetchSubscriptionProducts();
  const selectedProduct =
    products.find((product) => product.id === subscriptionProductId) ?? products[0];
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isComplete, setIsComplete] = useState(false);

  const handleCheckout = () => {
    setSubscriptionPlan('Premium');
    markSubscriptionUpdated();
    setIsComplete(true);
  };

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
            <h3>결제 수단</h3>
          </div>
          <div className="mapingo-admin-form">
            <select
              className="mapingo-input"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              <option value="card">신용카드</option>
              <option value="kakao">카카오페이</option>
              <option value="bank">간편 계좌이체</option>
            </select>
            <input className="mapingo-input" placeholder="카드 또는 결제 수단 표시명" />
            <div className="mapingo-admin-action-row">
              <button type="button" className="mapingo-submit-button" onClick={handleCheckout}>
                결제 완료 처리
              </button>
            </div>
            {isComplete ? (
              <div className="mapingo-empty-state">
                결제가 완료된 것으로 처리되었습니다. 실제 서비스에서는 결제 API 응답과
                영수증 번호가 함께 저장됩니다.
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}

export default PremiumCheckoutPage;
