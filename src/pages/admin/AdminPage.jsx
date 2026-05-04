import { useNavigate } from 'react-router-dom';
import { adminService } from '../../api/adminService';

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
    id: 'coaching',
    title: 'AI 코칭 관리',
    description: 'AI 코칭 모드, 연습 프롬프트, 발음 복습 문장, 추천 영상을 관리합니다.',
    path: '/admin/coaching',
  },
  {
    id: 'growth',
    title: '성장 리포트 관리',
    description: '성장 지표, 리포트 하이라이트, 레벨 옵션, 목표 제안과 학습 기록을 관리합니다.',
    path: '/admin/growth',
  },
  {
    id: 'community',
    title: '커뮤니티 관리',
    description: '커뮤니티 메인, 친구 관리, 순위 비교, 즐겨찾기 페이지 구성을 한 곳에서 관리합니다.',
    path: '/admin/community',
  },
];

function AdminPage() {
  const navigate = useNavigate();
  const members = adminService.fetchAdminMembers();
  const notices = adminService.fetchAdminNotices();
  const communityPages = adminService.fetchAdminCommunityPages();

  const stats = [
    {
      label: '전체 회원',
      value: members.length,
      hint: '현재 등록된 사용자 수',
    },
    {
      label: '검토 필요 회원',
      value: members.filter((member) => member.status === '검토 필요').length,
      hint: '상태 확인이 필요한 계정',
    },
    {
      label: '게시 중 공지',
      value: notices.filter((notice) => notice.status === '게시 중').length,
      hint: '현재 노출 중인 공지',
    },
    {
      label: '관리 중 페이지',
      value: communityPages.length,
      hint: '관리자에서 제어하는 커뮤니티 화면',
    },
  ];

  const quickTasks = [
    '검토 필요 회원 상태 확인',
    '게시 예정 공지 문구 검수',
    '커뮤니티 페이지 노출 상태 점검',
    '콘텐츠 운영 우선순위 확인',
  ];

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-domain-entry admin-domain-entry">
        <p className="mapingo-eyebrow">Admin</p>
        <h1>관리자 대시보드</h1>
        <p className="mapingo-domain-entry-copy">
          회원, 공지, 콘텐츠, 커뮤니티 운영 상태를 한 번에 확인하고 필요한 관리 화면으로 바로 이동할 수
          있습니다.
        </p>

        <div className="mapingo-dashboard-stats admin-overview-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="mapingo-stat-card admin-overview-card">
              <p className="mapingo-stat-label">{stat.label}</p>
              <strong className="mapingo-stat-value">{stat.value}</strong>
              <p className="mapingo-stat-hint">{stat.hint}</p>
            </article>
          ))}
        </div>

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

          <article className="admin-quick-panel">
            <p className="admin-quick-kicker">오늘 확인할 항목</p>
            <h3>운영 체크리스트</h3>
            <div className="admin-quick-list">
              {quickTasks.map((task) => (
                <div key={task} className="admin-quick-item">
                  <span className="admin-quick-dot" aria-hidden="true" />
                  <p>{task}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default AdminPage;
