import { useNavigate } from 'react-router-dom';

const adminCards = [
  {
    id: 'members',
    title: '회원 관리',
    description: '회원 상태, 플랜, 최근 활동을 확인하고 검토가 필요한 사용자를 빠르게 확인합니다.',
    path: '/admin/members',
  },
  {
    id: 'support',
    title: '고객지원 관리',
    description: '고객지원에 노출되는 공지사항 작성, 예약, 게시 상태를 한 화면에서 관리합니다.',
    path: '/admin/support',
  },
  {
    id: 'content',
    title: '콘텐츠 관리',
    description: '장소, 시나리오, 미션 콘텐츠 생성과 운영 상태를 관리자 화면에서 조정합니다.',
    path: '/admin/content',
  },
  {
    id: 'payments',
    title: '결제 관리',
    description: '프리미엄 구독 결제 내역, 결제 상태, 환불과 취소 처리를 관리합니다.',
    path: '/admin/payments',
  },
  {
    id: 'growth',
    title: '성장 리포트 관리',
    description: '성장 지표 리포트 하이라이트, 배지 옵션, 목표 제안과 학습 기록을 관리합니다.',
    path: '/admin/growth',
  },
  {
    id: 'community',
    title: '커뮤니티 관리',
    description: '커뮤니티 메인, 친구 관리, 순위 비교, 즐겨찾기 페이지 구성을 한곳에서 관리합니다.',
    path: '/admin/community',
  },
];

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-domain-entry admin-domain-entry">
        <p className="mapingo-eyebrow">ADMIN</p>
        <h1>관리자 대시보드</h1>
        <p className="mapingo-domain-entry-copy">
          회원, 공지, 콘텐츠, 커뮤니티 운영 상태를 한 번에 확인하고 필요한 관리 화면으로 바로 이동할
          수 있습니다.
        </p>

        <div className="admin-dashboard-layout">
          <div className="mapingo-domain-entry-grid admin-entry-grid admin-entry-grid-wide">
            {adminCards.map((card) => (
              <button
                key={card.id}
                type="button"
                className="mapingo-domain-entry-card admin-entry-card"
                onClick={() => navigate(card.path)}
              >
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
