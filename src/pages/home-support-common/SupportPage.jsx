import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../api/user/supportService';
import { useMapingoStore } from '../../store/user/useMapingoStore';
import '../../styles/user/SupportPage.css';

const TABS = [
  { id: 'notices', label: '공지사항' },
  { id: 'faq', label: 'FAQ' },
  { id: 'inquiry', label: '1:1 문의하기' },
];

const NOTICE_FILTERS = ['전체', '업데이트', '점검', '이벤트'];

// ── 공지사항 탭 ──────────────────────────────────────────
function NoticesTab({ onNoticeClick }) {
  const [filter, setFilter] = useState('전체');
  const notices = supportService.fetchSupportNotices();

  const filtered = filter === '전체'
    ? notices
    : notices.filter((n) => n.kind === filter);

  return (
    <div className="mapingo-support-tab-content">
      <div className="mapingo-support-filter-row">
        {NOTICE_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`mapingo-filter-chip${filter === f ? ' mapingo-filter-chip--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="mapingo-list-card">
        <div className="mapingo-selectable-list">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="mapingo-post-card"
              onClick={() => onNoticeClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="mapingo-post-head">
                <strong>{item.title}</strong>
                <span className="mapingo-list-meta">{item.meta}</span>
              </div>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FAQ 탭 ───────────────────────────────────────────────
function FaqTab() {
  const faqs = supportService.fetchSupportFaqs();

  return (
    <div className="mapingo-support-tab-content">
      <div className="mapingo-list-card">
        <div className="mapingo-selectable-list">
          {faqs.map((item) => (
            <article key={item.id} className="mapingo-post-card">
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 문의하기 탭 ──────────────────────────────────────────
function InquiryTab() {
  const categories = supportService.fetchSupportInquiryTemplates();
  const inquiryForm = useMapingoStore((state) => state.supportInquiryForm);
  const inquiries = useMapingoStore((state) => state.supportInquiries);
  const setSupportInquiryForm = useMapingoStore((state) => state.setSupportInquiryForm);
  const resetSupportInquiryForm = useMapingoStore((state) => state.resetSupportInquiryForm);
  const addSupportInquiry = useMapingoStore((state) => state.addSupportInquiry);
  const [view, setView] = useState('list'); // 'list' | 'form'

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupportInquiryForm({ ...inquiryForm, [name]: value });
  };

  const handleSubmit = () => {
    if (!inquiryForm.title || !inquiryForm.body) return;
    addSupportInquiry(inquiryForm);
    resetSupportInquiryForm();
    setView('list');
  };

  if (view === 'form') {
    return (
      <div className="mapingo-support-tab-content">
        <div className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <h3>문의 작성</h3>
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => setView('list')}
            >
              ← 돌아가기
            </button>
          </div>
          <div className="mapingo-inquiry-form">
            <label className="mapingo-field">
              <span className="mapingo-field-label">문의 유형</span>
              <select className="mapingo-select" name="category" value={inquiryForm.category} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="mapingo-field">
              <span className="mapingo-field-label">제목</span>
              <input className="mapingo-input" name="title" value={inquiryForm.title} onChange={handleChange} placeholder="문의 제목을 입력해보세요" />
            </label>
            <label className="mapingo-field">
              <span className="mapingo-field-label">문의 내용</span>
              <textarea className="mapingo-textarea" name="body" value={inquiryForm.body} onChange={handleChange} style={{resize: 'none', minHeight: ' 300px'}}placeholder="문의 내용을 적어보세요" />
            </label>
            <button type="button" className="mapingo-submit-button" onClick={handleSubmit}>
              문의 등록하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mapingo-support-tab-content">
      <div className="mapingo-list-card">
        <div className="mapingo-card-header-row">
          <h3>내 문의</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="mapingo-submit-button"
              style={{ padding: '6px 16px', fontSize: '13px', margin:'0'}}
              onClick={() => setView('form')}
            >
              문의하기
            </button>
          </div>
        </div>
        <div className="mapingo-selectable-list">
          {inquiries.map((item) => (
            <article key={item.id} className="mapingo-post-card">
              <div className="mapingo-post-head">
                <strong>{item.title}</strong>
                <span className="mapingo-list-meta">{item.status}</span>
              </div>
              <p>{item.category}</p>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 메인 SupportPage ─────────────────────────────────────
function SupportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notices');

  return (
    <div className="mapingo-dashboard">
      <section className="mapingo-domain-entry">
        <h1>고객지원</h1>
        <p className="mapingo-domain-entry-copy">Mapingo는 여러분들의 이야기를 귀기울여 듣습니다.</p>

        {/* 탭 카드 (클릭하면 탭 전환) */}
        <div className="mapingo-domain-entry-grid">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`mapingo-domain-entry-card${activeTab === tab.id ? ' mapingo-domain-entry-card--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <h3>{tab.label}</h3>
              <p>
                {tab.id === 'notices' && '서비스 변경과 주요 업데이트 내용을 먼저 확인해요.'}
                {tab.id === 'faq' && '자주 묻는 질문을 빠르게 찾아볼 수 있어요.'}
                {tab.id === 'inquiry' && '게시판 형태로 문의를 남기고 상태를 확인해요.'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 탭 콘텐츠 */}
      <section className="mapingo-page-section">
        

        {activeTab === 'notices' && (
          <NoticesTab onNoticeClick={(id) => navigate(`/support/notices/${id}`)} />
        )}
        {activeTab === 'faq' && <FaqTab />}
        {activeTab === 'inquiry' && <InquiryTab />}
      </section>
    </div>
  );
}

export default SupportPage;
