import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminService } from '../../api/adminService';

const emptyForm = {
  title: '',
  category: '업데이트',
  body: '',
  author: '운영팀',
  publishAt: '',
};

const emptyFaqForm = {
  question: '',
  answer: '',
};

const emptyInquiryForm = {
  category: '',
};

const initialSupportInquiries = [
  {
    id: 1,
    category: '로그인/회원가입 문의',
    title: '로그인 후 홈 이동 여부',
    body: '로그인 완료 후 홈으로 이동하는 플로우를 확인하고 싶어요.',
    status: '답변 완료',
    memo: '가이드 문구 안내 완료',
    answer: '네. 시연용 플로우에서는 로그인 완료 후 홈 화면으로 이동합니다.',
    answeredBy: '운영팀',
    answeredAt: '2026-04-23 10:30',
  },
  {
    id: 2,
    category: '학습 기록 문의',
    title: '최근 학습 카드가 비어 보여요',
    body: '최근 학습 카드가 없을 때 기본 데이터가 보이는지 궁금해요.',
    status: '접수됨',
    memo: '재현 확인 필요',
    answer: '',
    answeredBy: '',
    answeredAt: '',
  },
];

const PAGE_SIZE = 3;

function getStatusClassName(status) {
  if (status === '게시 중') return 'is-published';
  if (status === '예약') return 'is-reserved';
  return 'is-draft';
}

function AdminNoticesPage() {
  const navigate = useNavigate();
  const [activeSupportTab, setActiveSupportTab] = useState('notices');
  const [notices, setNotices] = useState(adminService.fetchAdminNotices());
  const [form, setForm] = useState(emptyForm);
  const [editingNoticeId, setEditingNoticeId] = useState(null);
  const [faqs, setFaqs] = useState(() => adminService.fetchAdminSupportFaqs());
  const [faqForm, setFaqForm] = useState(emptyFaqForm);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [inquiryTemplates, setInquiryTemplates] = useState(() => adminService.fetchAdminSupportInquiryTemplates());
  const [inquiryForm, setInquiryForm] = useState(emptyInquiryForm);
  const [editingTemplateIndex, setEditingTemplateIndex] = useState(null);
  const [inquiries, setInquiries] = useState(initialSupportInquiries);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('pinned');
  const [currentPage, setCurrentPage] = useState(1);

  const editingNotice = useMemo(
    () => notices.find((notice) => notice.id === editingNoticeId) ?? null,
    [editingNoticeId, notices],
  );

  const editingFaq = useMemo(
    () => faqs.find((faq) => faq.id === editingFaqId) ?? null,
    [editingFaqId, faqs],
  );

  const scheduledNotices = useMemo(
    () =>
      notices
        .filter((notice) => notice.status === '예약')
        .sort((a, b) => (a.publishAt || '').localeCompare(b.publishAt || '')),
    [notices],
  );

  const filteredNotices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = notices
      .filter((notice) => (categoryFilter === 'all' ? true : notice.category === categoryFilter))
      .filter((notice) => {
        if (!normalizedQuery) return true;
        return `${notice.title} ${notice.body} ${notice.author}`.toLowerCase().includes(normalizedQuery);
      });

    const sorted = [...filtered];

    if (sortBy === 'latest') {
      sorted.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      return sorted;
    }

    if (sortBy === 'publish') {
      sorted.sort((a, b) => (b.publishAt || '').localeCompare(a.publishAt || ''));
      return sorted;
    }

    sorted.sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.date.localeCompare(a.date) || b.id - a.id);
    return sorted;
  }, [categoryFilter, notices, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedNotices = filteredNotices.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingNoticeId(null);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) return;

    if (editingNoticeId) {
      setNotices((current) =>
        current.map((notice) =>
          notice.id === editingNoticeId
            ? {
                ...notice,
                title: form.title.trim(),
                category: form.category,
                body: form.body.trim(),
                author: form.author.trim() || '운영팀',
                publishAt: form.publishAt || notice.publishAt,
              }
            : notice,
        ),
      );
      resetForm();
      return;
    }

    setNotices((current) => [
      {
        id: current.length + 1,
        title: form.title.trim(),
        category: form.category,
        body: form.body.trim(),
        status: form.publishAt ? '예약' : '임시 저장',
        date: '2026-04-23',
        isPinned: false,
        author: form.author.trim() || '운영팀',
        publishAt: form.publishAt || '미정',
      },
      ...current,
    ]);
    resetForm();
    resetPagination();
  };

  const handleEdit = (notice) => {
    setEditingNoticeId(notice.id);
    setForm({
      title: notice.title,
      category: notice.category,
      body: notice.body,
      author: notice.author,
      publishAt: notice.publishAt === '미정' ? '' : notice.publishAt,
    });
  };

  const handleDelete = (noticeId) => {
    const shouldDelete = window.confirm('이 공지를 삭제할까요?');
    if (!shouldDelete) return;

    setNotices((current) => current.filter((notice) => notice.id !== noticeId));

    if (editingNoticeId === noticeId) {
      resetForm();
    }
  };

  const handleTogglePublish = (noticeId) => {
    setNotices((current) =>
      current.map((notice) => {
        if (notice.id !== noticeId) return notice;

        if (notice.status === '게시 중') {
          return { ...notice, status: '임시 저장' };
        }

        if (notice.publishAt && notice.publishAt !== '미정') {
          return { ...notice, status: '예약' };
        }

        return { ...notice, status: '게시 중' };
      }),
    );
  };

  const handleTogglePinned = (noticeId) => {
    setNotices((current) =>
      current.map((notice) =>
        notice.id === noticeId ? { ...notice, isPinned: !notice.isPinned } : notice,
      ),
    );
  };

  const resetFaqForm = () => {
    setFaqForm(emptyFaqForm);
    setEditingFaqId(null);
  };

  const handleSubmitFaq = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    if (editingFaqId) {
      setFaqs((currentFaqs) =>
        currentFaqs.map((faq) =>
          faq.id === editingFaqId
            ? { ...faq, question: faqForm.question.trim(), answer: faqForm.answer.trim() }
            : faq,
        ),
      );
      resetFaqForm();
      return;
    }

    setFaqs((currentFaqs) => [
      {
        id: Math.max(0, ...currentFaqs.map((faq) => faq.id)) + 1,
        question: faqForm.question.trim(),
        answer: faqForm.answer.trim(),
      },
      ...currentFaqs,
    ]);
    resetFaqForm();
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setFaqForm({ question: faq.question, answer: faq.answer });
  };

  const handleDeleteFaq = (faqId) => {
    if (!window.confirm('이 FAQ를 삭제할까요?')) return;
    setFaqs((currentFaqs) => currentFaqs.filter((faq) => faq.id !== faqId));
    if (editingFaqId === faqId) resetFaqForm();
  };

  const resetInquiryForm = () => {
    setInquiryForm(emptyInquiryForm);
    setEditingTemplateIndex(null);
  };

  const handleSubmitInquiryTemplate = () => {
    const category = inquiryForm.category.trim();
    if (!category) return;

    if (editingTemplateIndex != null) {
      setInquiryTemplates((currentTemplates) =>
        currentTemplates.map((template, index) => (index === editingTemplateIndex ? category : template)),
      );
      resetInquiryForm();
      return;
    }

    setInquiryTemplates((currentTemplates) => [category, ...currentTemplates]);
    resetInquiryForm();
  };

  const handleDeleteInquiryTemplate = (templateIndex) => {
    if (!window.confirm('이 문의 유형을 삭제할까요?')) return;
    setInquiryTemplates((currentTemplates) => currentTemplates.filter((_, index) => index !== templateIndex));
    resetInquiryForm();
  };

  const updateInquiry = (inquiryId, updates) => {
    setInquiries((currentInquiries) =>
      currentInquiries.map((inquiry) => (inquiry.id === inquiryId ? { ...inquiry, ...updates } : inquiry)),
    );
  };

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="고객지원 관리"
        description="고객지원 공지사항의 작성, 수정, 삭제, 검색, 필터, 예약 발행, 페이지네이션을 한 화면에서 관리합니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/admin')}>
            관리자 메인으로
          </button>
        </div>
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="admin-content-tab-row admin-support-tabs">
          <button
            type="button"
            className={`admin-content-tab ${activeSupportTab === 'notices' ? 'is-active' : ''}`}
            onClick={() => setActiveSupportTab('notices')}
          >
            공지사항
          </button>
          <button
            type="button"
            className={`admin-content-tab ${activeSupportTab === 'faq' ? 'is-active' : ''}`}
            onClick={() => setActiveSupportTab('faq')}
          >
            FAQ
          </button>
          <button
            type="button"
            className={`admin-content-tab ${activeSupportTab === 'inquiry' ? 'is-active' : ''}`}
            onClick={() => setActiveSupportTab('inquiry')}
          >
            1:1 문의
          </button>
        </div>
      </section>

      {activeSupportTab === 'notices' ? (
      <section className="mapingo-admin-grid">
        <article className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <div>
              <h3>{editingNotice ? '고객지원 공지 수정' : '고객지원 공지 작성'}</h3>
              <span className="mapingo-muted-copy">
                {editingNotice ? '선택한 공지 내용을 수정하고 저장할 수 있어요.' : '새 공지를 작성하고 초안 또는 예약 상태로 추가할 수 있어요.'}
              </span>
            </div>
          </div>

          {editingNotice ? (
            <div className="mapingo-admin-editing-banner">
              <strong>{editingNotice.title}</strong>
              <p>현재 이 공지를 수정 중이에요. 저장하면 목록에 바로 반영됩니다.</p>
            </div>
          ) : null}

          <div className="mapingo-admin-form">
            <input
              className="mapingo-input"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="공지 제목"
            />
            <select
              className="mapingo-input"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="업데이트">업데이트</option>
              <option value="점검">점검</option>
              <option value="이벤트">이벤트</option>
            </select>
            <input
              className="mapingo-input"
              value={form.author}
              onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
              placeholder="작성자"
            />
            <input
              className="mapingo-input"
              type="datetime-local"
              value={form.publishAt}
              onChange={(event) => setForm((current) => ({ ...current, publishAt: event.target.value }))}
            />
            <textarea
              className="mapingo-input mapingo-admin-textarea"
              value={form.body}
              onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))}
              placeholder="공지 본문"
            />

            <div className="mapingo-admin-preview-card">
              <p className="mapingo-field-label">공지 미리보기</p>
              <div className="mapingo-admin-preview-body">
                <div className="mapingo-inline-badges">
                  <span className="mapingo-inline-badge">{form.category || '카테고리'}</span>
                  <span className="mapingo-inline-badge">{form.publishAt ? '예약 발행' : editingNotice ? '수정 중' : '신규 작성'}</span>
                </div>
                <strong>{form.title || '공지 제목이 여기에 표시돼요.'}</strong>
                <p>{form.body || '본문을 입력하면 실제 목록에 노출될 문구를 여기서 미리 볼 수 있어요.'}</p>
                <p className="admin-notice-preview-meta">
                  작성자 {form.author || '운영팀'} · 발행 {form.publishAt || '미정'}
                </p>
              </div>
            </div>

            <div className="mapingo-admin-action-row">
              <button type="button" className="mapingo-submit-button" onClick={handleSubmit}>
                {editingNotice ? '수정 저장' : '공지 추가'}
              </button>
              {editingNotice ? (
                <button type="button" className="mapingo-ghost-button" onClick={resetForm}>
                  취소
                </button>
              ) : null}
            </div>
          </div>
        </article>

        <article className="mapingo-list-card">
          <div className="mapingo-card-header-row">
            <div>
              <h3>고객지원 공지 목록</h3>
              <span className="mapingo-muted-copy">{`${filteredNotices.length}개 표시 중`}</span>
            </div>
          </div>

          {scheduledNotices.length > 0 ? (
            <div className="admin-scheduled-notices">
              <div className="admin-scheduled-head">
                <strong>예약된 공지</strong>
                <span>{`${scheduledNotices.length}개`}</span>
              </div>
              <div className="admin-scheduled-list">
                {scheduledNotices.map((notice) => (
                  <button key={notice.id} type="button" className="admin-scheduled-item" onClick={() => handleEdit(notice)}>
                    <span>{notice.title}</span>
                    <strong>{notice.publishAt}</strong>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mapingo-admin-filter-row admin-notice-toolbar">
            <input
              className="mapingo-input admin-notice-search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                resetPagination();
              }}
              placeholder="제목, 본문, 작성자 검색"
            />
            <div className="mapingo-admin-filter-row">
              <button type="button" className={`mapingo-chip ${categoryFilter === 'all' ? 'is-active' : ''}`} onClick={() => { setCategoryFilter('all'); resetPagination(); }}>
                전체
              </button>
              <button type="button" className={`mapingo-chip ${categoryFilter === '업데이트' ? 'is-active' : ''}`} onClick={() => { setCategoryFilter('업데이트'); resetPagination(); }}>
                업데이트
              </button>
              <button type="button" className={`mapingo-chip ${categoryFilter === '점검' ? 'is-active' : ''}`} onClick={() => { setCategoryFilter('점검'); resetPagination(); }}>
                점검
              </button>
              <button type="button" className={`mapingo-chip ${categoryFilter === '이벤트' ? 'is-active' : ''}`} onClick={() => { setCategoryFilter('이벤트'); resetPagination(); }}>
                이벤트
              </button>
            </div>
            <select
              className="mapingo-input admin-notice-sort"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                resetPagination();
              }}
            >
              <option value="pinned">고정순</option>
              <option value="latest">최신순</option>
              <option value="publish">발행순</option>
            </select>
          </div>

          <div className="mapingo-selectable-list">
            {pagedNotices.map((notice) => (
              <article key={notice.id} className={`mapingo-post-card ${editingNoticeId === notice.id ? 'is-editing' : ''}`}>
                <div className="mapingo-admin-item-head">
                  <div>
                    <div className="admin-notice-title-row">
                      <strong>{notice.title}</strong>
                      {notice.isPinned ? <span className="admin-notice-pin">중요 공지</span> : null}
                    </div>
                    <p>{notice.body}</p>
                    <p className="admin-notice-meta">
                      작성자 {notice.author} · 발행 {notice.publishAt || '미정'}
                    </p>
                  </div>
                  <div className="mapingo-inline-badges">
                    <span className="mapingo-inline-badge">{notice.category}</span>
                    <span className={`admin-notice-status ${getStatusClassName(notice.status)}`}>{notice.status}</span>
                    <span className="mapingo-inline-badge">{notice.date}</span>
                  </div>
                </div>
                <div className="mapingo-admin-action-row">
                  <button type="button" className="mapingo-submit-button" onClick={() => handleTogglePublish(notice.id)}>
                    게시 상태 전환
                  </button>
                  <button type="button" className="mapingo-ghost-button" onClick={() => handleEdit(notice)}>
                    수정
                  </button>
                  <button type="button" className="mapingo-ghost-button" onClick={() => handleTogglePinned(notice.id)}>
                    {notice.isPinned ? '고정 해제' : '상단 고정'}
                  </button>
                  <button type="button" className="mapingo-ghost-button" onClick={() => handleDelete(notice.id)}>
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-pagination">
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
            >
              이전
            </button>
            <span>{`${safeCurrentPage} / ${totalPages}`}</span>
            <button
              type="button"
              className="mapingo-ghost-button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              다음
            </button>
          </div>
        </article>
      </section>
      ) : null}

      {activeSupportTab === 'faq' ? (
        <section className="mapingo-admin-grid">
          <article className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <div>
                <h3>{editingFaq ? 'FAQ 수정' : 'FAQ 작성'}</h3>
                <span className="mapingo-muted-copy">고객지원 FAQ 탭에 표시될 질문과 답변을 관리합니다.</span>
              </div>
            </div>
            <div className="mapingo-admin-form">
              <input
                className="mapingo-input"
                value={faqForm.question}
                onChange={(event) => setFaqForm((current) => ({ ...current, question: event.target.value }))}
                placeholder="질문"
              />
              <textarea
                className="mapingo-input mapingo-admin-textarea"
                value={faqForm.answer}
                onChange={(event) => setFaqForm((current) => ({ ...current, answer: event.target.value }))}
                placeholder="답변"
              />
              <div className="mapingo-admin-action-row">
                <button type="button" className="mapingo-submit-button" onClick={handleSubmitFaq}>
                  {editingFaq ? 'FAQ 수정 저장' : 'FAQ 추가'}
                </button>
                {editingFaq ? (
                  <button type="button" className="mapingo-ghost-button" onClick={resetFaqForm}>
                    취소
                  </button>
                ) : null}
              </div>
            </div>
          </article>

          <article className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <div>
                <h3>FAQ 목록</h3>
                <span className="mapingo-muted-copy">{faqs.length}개 표시 중</span>
              </div>
            </div>
            <div className="mapingo-selectable-list">
              {faqs.map((faq) => (
                <article key={faq.id} className="mapingo-post-card">
                  <div className="mapingo-admin-item-head">
                    <div>
                      <strong>{faq.question}</strong>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                  <div className="mapingo-admin-action-row">
                    <button type="button" className="mapingo-submit-button" onClick={() => handleEditFaq(faq)}>
                      수정
                    </button>
                    <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteFaq(faq.id)}>
                      삭제
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeSupportTab === 'inquiry' ? (
        <section className="mapingo-admin-grid">
          <article className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <div>
                <h3>{editingTemplateIndex != null ? '문의 유형 수정' : '문의 유형 추가'}</h3>
                <span className="mapingo-muted-copy">사용자가 1:1 문의 작성 시 선택하는 유형을 관리합니다.</span>
              </div>
            </div>
            <div className="mapingo-admin-form">
              <input
                className="mapingo-input"
                value={inquiryForm.category}
                onChange={(event) => setInquiryForm({ category: event.target.value })}
                placeholder="예: 결제/구독 문의"
              />
              <div className="mapingo-admin-action-row">
                <button type="button" className="mapingo-submit-button" onClick={handleSubmitInquiryTemplate}>
                  {editingTemplateIndex != null ? '유형 수정 저장' : '유형 추가'}
                </button>
                {editingTemplateIndex != null ? (
                  <button type="button" className="mapingo-ghost-button" onClick={resetInquiryForm}>
                    취소
                  </button>
                ) : null}
              </div>
            </div>

            <div className="admin-support-template-list">
              {inquiryTemplates.map((template, index) => (
                <div key={`${template}-${index}`} className="admin-support-template-item">
                  <span>{template}</span>
                  <div>
                    <button
                      type="button"
                      className="mapingo-ghost-button"
                      onClick={() => {
                        setEditingTemplateIndex(index);
                        setInquiryForm({ category: template });
                      }}
                    >
                      수정
                    </button>
                    <button type="button" className="mapingo-ghost-button" onClick={() => handleDeleteInquiryTemplate(index)}>
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="mapingo-list-card">
            <div className="mapingo-card-header-row">
              <div>
                <h3>1:1 문의 목록</h3>
                <span className="mapingo-muted-copy">{inquiries.length}건 접수</span>
              </div>
            </div>
            <div className="mapingo-selectable-list">
              {inquiries.map((inquiry) => (
                <article key={inquiry.id} className="mapingo-post-card">
                  <div className="mapingo-admin-item-head">
                    <div>
                      <strong>{inquiry.title}</strong>
                      <p>{inquiry.body}</p>
                      <p className="admin-notice-meta">{inquiry.category}</p>
                    </div>
                    <span className="mapingo-inline-badge">{inquiry.status}</span>
                  </div>
                  <div className="admin-content-form-grid">
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">처리 상태</span>
                      <select
                        className="mapingo-input"
                        value={inquiry.status}
                        onChange={(event) => updateInquiry(inquiry.id, { status: event.target.value })}
                      >
                        <option value="접수됨">접수됨</option>
                        <option value="확인 중">확인 중</option>
                        <option value="답변 완료">답변 완료</option>
                      </select>
                    </label>
                    <label className="mapingo-field">
                      <span className="mapingo-field-label">관리자 메모</span>
                      <input
                        className="mapingo-input"
                        value={inquiry.memo}
                        onChange={(event) => updateInquiry(inquiry.id, { memo: event.target.value })}
                      />
                    </label>
                  </div>
                  <div className="admin-support-answer-box">
                    <div className="admin-support-answer-head">
                      <strong>답변 작성</strong>
                      <span>{inquiry.answeredAt || '답변 전'}</span>
                    </div>
                    <textarea
                      className="mapingo-input mapingo-admin-textarea"
                      value={inquiry.answer}
                      onChange={(event) => updateInquiry(inquiry.id, { answer: event.target.value })}
                      placeholder="회원에게 전달할 답변을 입력하세요."
                    />
                    <div className="admin-content-form-grid">
                      <label className="mapingo-field">
                        <span className="mapingo-field-label">답변자</span>
                        <input
                          className="mapingo-input"
                          value={inquiry.answeredBy}
                          onChange={(event) => updateInquiry(inquiry.id, { answeredBy: event.target.value })}
                          placeholder="운영팀"
                        />
                      </label>
                      <label className="mapingo-field">
                        <span className="mapingo-field-label">답변 일시</span>
                        <input
                          className="mapingo-input"
                          type="datetime-local"
                          value={inquiry.answeredAt}
                          onChange={(event) => updateInquiry(inquiry.id, { answeredAt: event.target.value })}
                        />
                      </label>
                    </div>
                    <div className="mapingo-admin-action-row admin-support-answer-actions">
                      <button
                        type="button"
                        className="mapingo-submit-button"
                        onClick={() =>
                          updateInquiry(inquiry.id, {
                            status: '답변 완료',
                            answeredBy: inquiry.answeredBy || '운영팀',
                            answeredAt: inquiry.answeredAt || '2026-04-27T09:00',
                          })
                        }
                        disabled={!inquiry.answer.trim()}
                      >
                        답변 저장
                      </button>
                      <button
                        type="button"
                        className="mapingo-ghost-button"
                        onClick={() => updateInquiry(inquiry.id, { status: '확인 중' })}
                      >
                        확인 중으로 표시
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}

export default AdminNoticesPage;
