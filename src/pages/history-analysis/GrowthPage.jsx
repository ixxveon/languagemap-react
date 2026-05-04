import { useNavigate } from 'react-router-dom';
import DemoFlowCompact from '../../components/DemoFlowCompact';

const growthCards = [
  {
    id: 'progress',
    title: '성장 지표',
    description: '발음, 유창성, 학습 횟수를 한눈에 확인할 수 있어요.',
    path: '/growth/progress',
  },
  {
    id: 'insights',
    title: '학습 기록',
    description: '설정과 최근 완료 기록, 진행 현황을 함께 볼 수 있어요.',
    path: '/growth/insights',
  },
];

function GrowthPage() {
  const navigate = useNavigate();

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-domain-entry">
        <p className="mapingo-eyebrow">성장 리포트</p>
        <h1>성장 리포트</h1>
        <p className="mapingo-domain-entry-copy">보고 싶은 항목을 선택해 자세한 내용을 확인해보세요.</p>
        <div className="mapingo-domain-entry-grid growth-entry-grid">
          {growthCards.map((card) => (
            <button key={card.id} type="button" className="mapingo-domain-entry-card growth-entry-card" onClick={() => navigate(card.path)}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </button>
          ))}
        </div>
      </section>

      <DemoFlowCompact activePath="/growth" />
    </div>
  );
}

export default GrowthPage;
