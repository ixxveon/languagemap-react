import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { useMapingoStore } from '../../store/user/useMapingoStore';

function AccountDeletePage() {
  const navigate = useNavigate();
  const clearSession = useMapingoStore((state) => state.clearSession);
  const [confirmText, setConfirmText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleDelete = () => {
    if (confirmText !== '탈퇴합니다') return;

    clearSession();
    setIsCompleted(true);
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Account"
        title="회원 탈퇴"
        description="백엔드 삭제 API 전 단계이기 때문에, 프론트 프로토타입 기준으로 탈퇴 확인 흐름과 세션 종료 경험을 먼저 검증하는 화면입니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/settings/account')}>
            계정 설정으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-admin-grid">
        <article className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>탈퇴 전 확인</h3>
          </div>
          <div className="mapingo-selectable-list">
            <article className="mapingo-post-card">
              <strong>학습 기록과 즐겨찾기 정보가 초기화됩니다.</strong>
              <p>실제 서비스에서는 복구 정책과 보관 기간이 함께 안내될 수 있습니다.</p>
            </article>
            <article className="mapingo-post-card">
              <strong>프리미엄 구독 정보 확인이 필요합니다.</strong>
              <p>결제 해지와 회원 탈퇴가 분리될 수 있으므로 결제 상태를 먼저 확인하는 흐름이 필요합니다.</p>
            </article>
          </div>
        </article>

        <article className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>탈퇴 확인 입력</h3>
          </div>
          <div className="mapingo-admin-form">
            <p className="mapingo-preview-copy">계속 진행하려면 아래 입력칸에 `탈퇴합니다`를 정확히 입력해주세요.</p>
            <input
              className="mapingo-input"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="탈퇴합니다"
            />
            <div className="mapingo-admin-action-row">
              <button type="button" className="mapingo-submit-button" onClick={handleDelete}>
                탈퇴 진행
              </button>
              <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/premium/plans')}>
                결제 상태 확인
              </button>
            </div>
            {isCompleted ? (
              <div className="mapingo-empty-state">
                프론트 프로토타입 기준으로 세션이 종료되었습니다. 실제 서비스에서는 서버 탈퇴 처리 후 홈으로 이동합니다.
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AccountDeletePage;
