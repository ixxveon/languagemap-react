import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/adminService';

const paymentStatusClassMap = {
  결제완료: 'is-published',
  결제대기: 'is-reserved',
  환불완료: 'is-draft',
  결제취소: 'is-draft',
};

function parsePrice(price) {
  return Number(String(price).replace(/[^0-9]/g, '')) || 0;
}

function formatWon(value) {
  return `₩${Number(value).toLocaleString('ko-KR')}`;
}

function buildInitialPayments(members, products) {
  return members.map((member, index) => {
    const product = products[index % products.length] ?? products[0];
    const isPremium = member.plan === 'Premium';

    return {
      id: index + 1,
      orderNo: `PAY-202604-${String(index + 1).padStart(3, '0')}`,
      memberId: member.id,
      productId: product?.id ?? 'monthly',
      productName: product?.name ?? '1개월 플랜',
      amount: isPremium ? parsePrice(product?.price) : 0,
      method: index % 2 === 0 ? '신용카드' : '카카오페이',
      status: isPremium ? '결제완료' : '결제대기',
      paidAt: isPremium ? '2026-04-24 09:30' : '미결제',
      memo: isPremium ? '정상 승인' : '무료 회원 결제 대기',
    };
  });
}

function AdminPaymentsPage() {
  const navigate = useNavigate();
  const [members] = useState(() => adminService.fetchAdminMembers());
  const [products] = useState(() => adminService.fetchAdminSubscriptionProducts());
  const [features, setFeatures] = useState(() => adminService.fetchAdminPremiumFeatureAccess());
  const [payments, setPayments] = useState(() => buildInitialPayments(adminService.fetchAdminMembers(), adminService.fetchAdminSubscriptionProducts()));
  const [selectedMemberId, setSelectedMemberId] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return payments.filter((payment) => {
      const member = members.find((item) => item.id === payment.memberId);
      const matchesMember = selectedMemberId === 'all' || String(payment.memberId) === String(selectedMemberId);
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesSearch =
        !normalizedQuery ||
        [payment.orderNo, payment.productName, payment.method, payment.status, payment.memo, member?.name, member?.email]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesMember && matchesStatus && matchesSearch;
    });
  }, [members, payments, searchQuery, selectedMemberId, statusFilter]);

  const paidTotal = payments
    .filter((payment) => payment.status === '결제완료')
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const premiumMemberCount = members.filter((member) => member.plan === 'Premium').length;
  const waitingCount = payments.filter((payment) => payment.status === '결제대기').length;
  const refundCount = payments.filter((payment) => payment.status === '환불완료').length;

  const stats = [
    { label: '프리미엄 회원', value: premiumMemberCount, hint: '현재 Premium 플랜' },
    { label: '결제 완료액', value: formatWon(paidTotal), hint: '승인된 결제 합계' },
    { label: '결제 대기', value: waitingCount, hint: '확인 필요한 결제' },
    { label: '환불 완료', value: refundCount, hint: '환불 처리된 주문' },
  ];

  const updatePayment = (paymentId, updates) => {
    setPayments((currentPayments) =>
      currentPayments.map((payment) => (payment.id === paymentId ? { ...payment, ...updates } : payment)),
    );
  };

  const handleApprovePayment = (payment) => {
    const product = products.find((item) => item.id === payment.productId) ?? products[0];
    updatePayment(payment.id, {
      amount: parsePrice(product?.price),
      productName: product?.name ?? payment.productName,
      status: '결제완료',
      paidAt: '2026-04-27 09:00',
      memo: '관리자 승인 처리',
    });
  };

  const handleRefundPayment = (payment) => {
    if (!window.confirm('이 결제를 환불 처리할까요?')) return;
    updatePayment(payment.id, {
      status: '환불완료',
      memo: '관리자 환불 처리',
    });
  };

  const handleCancelPayment = (payment) => {
    if (!window.confirm('이 결제를 취소 처리할까요?')) return;
    updatePayment(payment.id, {
      status: '결제취소',
      memo: '관리자 취소 처리',
    });
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="결제 관리"
        description="프리미엄 구독 결제 내역, 회원별 결제 상태, 환불 및 취소 처리를 관리합니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/admin')}>
            관리자 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="mapingo-dashboard-stats admin-overview-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="mapingo-stat-card admin-overview-card">
              <p className="mapingo-stat-label">{stat.label}</p>
              <strong className="mapingo-stat-value">{stat.value}</strong>
              <p className="mapingo-stat-hint">{stat.hint}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mapingo-page-section">
        <div className="mapingo-admin-grid admin-content-layout admin-payment-layout">
          <div className="mapingo-list-card">
            <div className="mapingo-card-header-row admin-result-head">
              <div>
                <h3>결제 내역</h3>
                <p className="mapingo-muted-copy">회원, 주문번호, 결제 상태로 검색하고 운영 처리를 진행합니다.</p>
              </div>
              <span className="mapingo-inline-badge">{filteredPayments.length}건</span>
            </div>

            <div className="admin-payment-filter-bar">
              <input
                className="mapingo-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="회원명, 이메일, 주문번호 검색"
              />
              <select className="mapingo-input" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                <option value="all">전체 회원</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} · {member.email}
                  </option>
                ))}
              </select>
              <select className="mapingo-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">전체 상태</option>
                <option value="결제완료">결제완료</option>
                <option value="결제대기">결제대기</option>
                <option value="환불완료">환불완료</option>
                <option value="결제취소">결제취소</option>
              </select>
            </div>

            <div className="mapingo-selectable-list">
              {filteredPayments.map((payment) => {
                const member = members.find((item) => item.id === payment.memberId);

                return (
                  <article key={payment.id} className="mapingo-post-card admin-content-card">
                    <div className="mapingo-admin-item-head">
                      <div>
                        <strong>{payment.orderNo}</strong>
                        <p>{member?.name ?? '회원 없음'} · {member?.email ?? '-'}</p>
                      </div>
                      <span className={`admin-notice-status ${paymentStatusClassMap[payment.status] ?? 'is-draft'}`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="mapingo-admin-meta-grid admin-payment-meta-grid">
                      <p><strong>플랜</strong>{payment.productName}</p>
                      <p><strong>금액</strong>{formatWon(payment.amount)}</p>
                      <p><strong>수단</strong>{payment.method}</p>
                      <p><strong>결제일</strong>{payment.paidAt}</p>
                    </div>
                    <label className="mapingo-field admin-payment-memo">
                      <span className="mapingo-field-label">운영 메모</span>
                      <input
                        className="mapingo-input"
                        value={payment.memo}
                        onChange={(event) => updatePayment(payment.id, { memo: event.target.value })}
                      />
                    </label>
                    <div className="mapingo-admin-action-row admin-content-card-actions">
                      <button type="button" className="mapingo-submit-button" onClick={() => handleApprovePayment(payment)}>
                        승인
                      </button>
                      <button type="button" className="mapingo-ghost-button" onClick={() => handleRefundPayment(payment)}>
                        환불
                      </button>
                      <button type="button" className="mapingo-ghost-button" onClick={() => handleCancelPayment(payment)}>
                        취소
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mapingo-form-card">
            <div className="mapingo-card-header-row admin-builder-head">
              <div>
                <h3>플랜과 프리미엄 권한</h3>
                <p className="mapingo-muted-copy">결제 화면에 노출되는 구독 플랜과 프리미엄 기능 접근 문구를 확인합니다.</p>
              </div>
            </div>

            <div className="admin-payment-plan-list">
              {products.map((product) => (
                <article key={product.id} className="admin-payment-plan-card">
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                  </div>
                  <div className="mapingo-inline-badges">
                    <span className="mapingo-inline-badge">{product.billingLabel}</span>
                    <span className="mapingo-inline-badge">{product.price}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="admin-entity-stack admin-payment-feature-stack">
              <section className="admin-entity-section">
                <div className="admin-entity-head">
                  <strong>프리미엄 기능 권한</strong>
                  <span>{features.length}개</span>
                </div>
                <div className="mapingo-selectable-list">
                  {features.map((feature) => (
                    <article key={feature.id} className="mapingo-post-card admin-content-card">
                      <div className="mapingo-admin-item-head">
                        <div>
                          <strong>{feature.title}</strong>
                          <p>{feature.lockedCopy} · {feature.unlockedCopy}</p>
                        </div>
                      </div>
                      <div className="admin-content-form-grid">
                        <label className="mapingo-field">
                          <span className="mapingo-field-label">잠금 문구</span>
                          <input
                            className="mapingo-input"
                            value={feature.lockedCopy}
                            onChange={(event) =>
                              setFeatures((currentFeatures) =>
                                currentFeatures.map((item) =>
                                  item.id === feature.id ? { ...item, lockedCopy: event.target.value } : item,
                                ),
                              )
                            }
                          />
                        </label>
                        <label className="mapingo-field">
                          <span className="mapingo-field-label">사용 가능 문구</span>
                          <input
                            className="mapingo-input"
                            value={feature.unlockedCopy}
                            onChange={(event) =>
                              setFeatures((currentFeatures) =>
                                currentFeatures.map((item) =>
                                  item.id === feature.id ? { ...item, unlockedCopy: event.target.value } : item,
                                ),
                              )
                            }
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPaymentsPage;
