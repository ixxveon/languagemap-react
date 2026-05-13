import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminPaymentService } from '../../api/admin/payment/adminPaymentService';

const paymentStatusClassMap = {
    SUCCESS: 'is-published',
    FAIL: 'is-draft',
    CANCEL: 'is-draft',
};

const paymentStatusLabelMap = {
    SUCCESS: '결제완료',
    FAIL: '결제실패',
    CANCEL: '결제취소',
};

const planTypeLabelMap = {
    MONTHLY: '1개월 플랜',
    YEARLY: '1년 플랜',
};

const planStatusLabelMap = {
    ACTIVE: '구독중',
    CANCELLED: '취소됨',
    EXPIRED: '만료됨',
};

const paymentMethodLabelMap = {
    CARD: '신용카드',
    KAKAOPAY: '카카오페이',
    TRANSFER: '계좌이체',
};

function formatWon(value) {
    return `₩${Number(value).toLocaleString('ko-KR')}`;
}

function AdminPaymentsPage() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: payments = [] } = useQuery({
        queryKey: ['adminPayments'],
        queryFn: () => adminPaymentService.getAdminPayments(),
    });

    const { data: stats } = useQuery({
        queryKey: ['adminPaymentStats'],
        queryFn: () => adminPaymentService.getAdminPaymentStats(),
    });

    const filteredPayments = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return payments.filter((payment) => {
            const matchesStatus =
                statusFilter === 'all' || payment.paymentStatus === statusFilter;
            const matchesSearch =
                !normalizedQuery ||
                [payment.userName, payment.userEmail, payment.merchantUid, payment.impUid]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery);
            return matchesStatus && matchesSearch;
        });
    }, [payments, searchQuery, statusFilter]);

    const statItems = [
        {
            label: '전체 결제',
            value: String(stats?.totalPaymentCount ?? 0),
            hint: '전체 결제 건수',
        },
        {
            label: '결제 완료',
            value: String(stats?.successPaymentCount ?? 0),
            hint: '승인된 결제 건수',
        },
        {
            label: '활성 구독',
            value: String(stats?.activeSubscriptionCount ?? 0),
            hint: '현재 구독중인 회원',
        },
        {
            label: '총 결제액',
            value: formatWon(stats?.totalAmount ?? 0),
            hint: '승인된 결제 합계',
        },
    ];

    return (
        <div className="mapingo-dashboard">
            <MapingoPageSection
                eyebrow="Admin"
                title="결제 관리"
                description="프리미엄 구독 결제 내역, 회원별 결제 상태를 관리합니다."
            >
                <div className="mapingo-page-actions">
                    <button
                        type="button"
                        className="mapingo-ghost-button"
                        onClick={() => navigate('/admin')}
                    >
                        관리자 메인으로
                    </button>
                </div>
            </MapingoPageSection>

            <section className="mapingo-page-section">
                <div className="mapingo-dashboard-stats admin-overview-grid">
                    {statItems.map((stat) => (
                        <article key={stat.label} className="mapingo-stat-card admin-overview-card">
                            <p className="mapingo-stat-label">{stat.label}</p>
                            <strong className="mapingo-stat-value">{stat.value}</strong>
                            <p className="mapingo-stat-hint">{stat.hint}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="mapingo-page-section">
                <div className="mapingo-list-card">
                    <div className="mapingo-card-header-row admin-result-head">
                        <div>
                            <h3>결제 내역</h3>
                            <p className="mapingo-muted-copy">
                                회원, 주문번호, 결제 상태로 검색할 수 있습니다.
                            </p>
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
                        <select
                            className="mapingo-input"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            <option value="all">전체 상태</option>
                            <option value="SUCCESS">결제완료</option>
                            <option value="FAIL">결제실패</option>
                            <option value="CANCEL">결제취소</option>
                        </select>
                    </div>

                    <div className="mapingo-selectable-list">
                        {filteredPayments.length === 0 ? (
                            <div className="admin-content-empty-state">결제 내역이 없습니다.</div>
                        ) : (
                            filteredPayments.map((payment) => (
                                <article
                                    key={payment.paymentId}
                                    className="mapingo-post-card admin-content-card"
                                >
                                    <div className="mapingo-admin-item-head">
                                        <div>
                                            <strong>{payment.merchantUid}</strong>
                                            <p>
                                                {payment.userName} · {payment.userEmail}
                                            </p>
                                        </div>
                                        <span
                                            className={`admin-notice-status ${paymentStatusClassMap[payment.paymentStatus] ?? 'is-draft'}`}
                                        >
                                            {paymentStatusLabelMap[payment.paymentStatus] ?? payment.paymentStatus}
                                        </span>
                                    </div>
                                    <div className="mapingo-admin-meta-grid admin-payment-meta-grid">
                                        <p>
                                            <strong>플랜</strong>
                                            {planTypeLabelMap[payment.planType] ?? '-'}
                                        </p>
                                        <p>
                                            <strong>금액</strong>
                                            {formatWon(payment.paymentAmount ?? 0)}
                                        </p>
                                        <p>
                                            <strong>수단</strong>
                                            {paymentMethodLabelMap[payment.paymentMethod] ?? '-'}
                                        </p>
                                        <p>
                                            <strong>결제일</strong>
                                            {payment.paymentAt?.slice(0, 10) ?? '-'}
                                        </p>
                                        <p>
                                            <strong>구독 상태</strong>
                                            {planStatusLabelMap[payment.planStatus] ?? '-'}
                                        </p>
                                        <p>
                                            <strong>구독 기간</strong>
                                            {payment.planStartAt
                                                ? `${payment.planStartAt.slice(0, 10)} ~ ${payment.planEndAt?.slice(0, 10)}`
                                                : '-'}
                                        </p>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminPaymentsPage;