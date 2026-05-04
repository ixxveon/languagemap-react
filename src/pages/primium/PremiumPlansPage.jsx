import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscriptionService } from '../../api/user/subscriptionService';
import { useMapingoStore } from '../../store/user/useMapingoStore';

function PremiumPlansPage() {
  const navigate = useNavigate();
  const products = subscriptionService.fetchSubscriptionProducts();
  const subscriptionProductId = useMapingoStore((state) => state.subscriptionProductId);
  const setSubscriptionProductId = useMapingoStore((state) => state.setSubscriptionProductId);
  const [toastMessage, setToastMessage] = useState('');

  const handleSelectPlan = (productId) => {
    setSubscriptionProductId(productId);
    setToastMessage('결제 화면으로 이동합니다.');
    navigate('/premium/checkout');
  };

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-premium-hero">
        <p className="mapingo-premium-eyebrow">Premium</p>
        <h1>구독 플랜</h1>
        <p className="mapingo-premium-hero-copy">
          월간/연간 플랜, 가격, 간단한 혜택 요약만 한 화면에서 확인할 수 있습니다.
        </p>
        {toastMessage ? (
          <div className="mapingo-premium-toast" role="status" aria-live="polite">
            <strong>다음 단계</strong>
            <span>{toastMessage}</span>
          </div>
        ) : null}
      </section>

      <section className="mapingo-premium-layout">
        {products.map((product) => {
          const isSelected = subscriptionProductId === product.id;
          const isYearly = product.id === 'yearly';

          return (
            <article
              key={product.id}
              className={`mapingo-premium-plan-card ${isYearly ? 'is-highlighted' : ''} ${isSelected ? 'is-selected' : ''}`}
            >
              {isYearly ? <span className="mapingo-premium-best-value">Best Value</span> : null}
              <p className="mapingo-premium-plan-label">{product.billingLabel}</p>
              <h2>{product.name}</h2>
              <p className="mapingo-premium-plan-description">{product.description}</p>
              <p className="mapingo-premium-plan-price">{product.price}</p>
              <ul className="mapingo-premium-plan-points">
                <li>광고 없이 학습에만 집중할 수 있어요</li>
                <li>프리미엄 전용 콘텐츠와 추가 혜택이 제공돼요</li>
                <li>우선 고객 지원으로 더 빠르게 도움받을 수 있어요</li>
              </ul>
              <button
                type="button"
                className={`mapingo-premium-plan-button ${product.id === 'monthly' ? 'is-monthly' : 'is-yearly'} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelectPlan(product.id)}
              >
                {isSelected ? '선택된 플랜' : '이 플랜으로 진행'}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default PremiumPlansPage;
