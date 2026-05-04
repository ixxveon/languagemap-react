import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import '../../styles/user/SettingsPage.css';

// ── 설정 옵션 데이터 ─────────────────────────────────────

const LANGUAGE_OPTIONS = [
  { value: 'en', label: '영어', emoji: '🇺🇸' },
  { value: 'jp', label: '일본어(준비중)', emoji: '🇯🇵' },
  { value: 'cn', label: '중국어(준비중)', emoji: '🇨🇳' },
];

const THEME_OPTIONS = [
  { value: 'light', label: '라이트모드', emoji: '🌞' },
  { value: 'dark', label: '다크모드', emoji: '🌙' },
  { value: 'system', label: '시스템 설정', emoji: '⚙️' },
];

const NOTIFICATION_OPTIONS = [
  { value: 'all', label: '모든 알림 받기', emoji: '🔔' },
  { value: 'off', label: '알림 받지 않기', emoji: '🔕' },
];

// ── 선택 팝업 컴포넌트 ───────────────────────────────────

function SettingsModal({ title, options, currentValue, onSelect, onClose }) {
  return (
    <>
      {/* 오버레이 */}
      <div
        className="mapingo-modal-overlay"
        onClick={onClose}
        role="presentation"
      />
      {/* 팝업 */}
      <div className="mapingo-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="mapingo-modal-header">
          <h2 className="mapingo-modal-title">{title}</h2>
          <button
            type="button"
            className="mapingo-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <ul className="mapingo-modal-list">
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`mapingo-modal-option${currentValue === opt.value ? ' is-selected' : ''}`}
                onClick={() => { onSelect(opt.value); onClose(); }}
              >
                <span className="mapingo-modal-option-emoji">{opt.emoji}</span>
                <span className="mapingo-modal-option-label">{opt.label}</span>
                {currentValue === opt.value && (
                  <span className="mapingo-modal-option-check">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ── 설정 카드 컴포넌트 ───────────────────────────────────

function SettingCard({ label, emoji, value, onClick }) {
  return (
    <div className="mapingo-setting-group">
      <p className="mapingo-setting-group-label">{label}</p>
      <button
        type="button"
        className="mapingo-setting-card"
        onClick={onClick}
      >
        <span className="mapingo-setting-emoji">{emoji}</span>
        <strong className="mapingo-setting-value">{value}</strong>
      </button>
    </div>
  );
}

// ── 메인 SettingsPage ────────────────────────────────────

function SettingsPage() {
  const navigate = useNavigate();

  // store에서 설정값 가져오기 (없으면 로컬 state로 대체)
  const language = useMapingoStore((state) => state.language) ?? 'en';
  const theme = useMapingoStore((state) => state.theme) ?? 'light';
  const notification = useMapingoStore((state) => state.notification) ?? 'off';
  const setLanguage = useMapingoStore((state) => state.setLanguage) ?? (() => {});
  const setTheme = useMapingoStore((state) => state.setTheme) ?? (() => {});
  const setNotification = useMapingoStore((state) => state.setNotification) ?? (() => {});

  const [openModal, setOpenModal] = useState(null); // 'language' | 'theme' | 'notification' | null

  const currentLanguage = LANGUAGE_OPTIONS.find((o) => o.value === language) ?? LANGUAGE_OPTIONS[0];
  const currentTheme = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[0];
  const currentNotification = NOTIFICATION_OPTIONS.find((o) => o.value === notification) ?? NOTIFICATION_OPTIONS[1];

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-domain-entry">
        <h1>환경설정</h1>
        <p className="mapingo-domain-entry-copy">mapingo를 편리하게 사용하기 위한 기능들이 있어요!</p>

        <div className="mapingo-settings-grid">
          <SettingCard
            label="학습언어"
            emoji={currentLanguage.emoji}
            value={currentLanguage.label}
            onClick={() => setOpenModal('language')}
          />
          <SettingCard
            label="시스템 색상"
            emoji={currentTheme.emoji}
            value={currentTheme.label}
            onClick={() => setOpenModal('theme')}
          />
          <SettingCard
            label="알림설정"
            emoji={currentNotification.emoji}
            value={currentNotification.label}
            onClick={() => setOpenModal('notification')}
          />
        </div>
      </section>

      {/* 팝업 */}
      {openModal === 'language' && (
        <SettingsModal
          title="학습언어 선택"
          options={LANGUAGE_OPTIONS}
          currentValue={language}
          onSelect={setLanguage}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'theme' && (
        <SettingsModal
          title="시스템 색상 선택"
          options={THEME_OPTIONS}
          currentValue={theme}
          onSelect={setTheme}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === 'notification' && (
        <SettingsModal
          title="알림 설정"
          options={NOTIFICATION_OPTIONS}
          currentValue={notification}
          onSelect={setNotification}
          onClose={() => setOpenModal(null)}
        />
      )}
    </div>
  );
}

export default SettingsPage;
