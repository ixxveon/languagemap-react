import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapingoMetricGrid, MapingoPageSection } from '../../components/MapingoPageBlocks';
import { adminUserService } from '../../api/admin/user/adminUserService';

const statusClassMap = {
  정상: 'is-active',
  정지: 'is-paused',
  탈퇴: 'is-review',
};

const roleOptions = ['일반 회원', '관리자'];
const statusOptions = ['정상', '정지', '탈퇴'];

function normalizeStatusFromDB(status) {
  if (status === 'SUSPENDED') return '정지';
  if (status === 'DELETED') return '탈퇴';
  return '정상';
}

function statusToDBValue(status) {
  if (status === '정지') return 'SUSPENDED';
  if (status === '탈퇴') return 'DELETED';
  return 'ACTIVE';
}

function normalizeRole(role) {
  return String(role).includes('ADMIN') ? '관리자' : '일반 회원';
}

function AdminMembersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [memberDraft, setMemberDraft] = useState({ status: '', role: '' });

  // DB에서 회원 목록 조회
  const { data: members = [] } = useQuery({
    queryKey: ['adminUsers', searchTerm],
    queryFn: async () => {
      const result = await adminUserService.getAdminUsers(searchTerm || null);
      return result.map((user) => ({
        id: user.userId,
        name: user.name,
        email: user.email,
        status: normalizeStatusFromDB(user.status),
        role: normalizeRole(user.role),
        paymentStatus: '확인 필요',
        joinedAt: user.createdAt?.slice(0, 10) ?? '-',
        lastActive: '-',
        studyCount: 0,
        streakDays: 0,
        goal: '-',
        plan: '-',
        reportHistory: [],
        learningHistory: [],
        phoneNumber: user.phoneNumber ?? '미등록',
        address: user.address ?? '미등록',        
        birthDate: user.birthDate ?? '미등록',    
      }));
    },
  });

  // 회원 상태 변경
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ userId, status }) =>
      adminUserService.updateAdminUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      alert('상태가 변경되었습니다.');
    },
    onError: () => {
      alert('상태 변경에 실패했습니다.');
    },
  });

  const filteredMembers = members;

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedMemberId) ?? null,
    [members, selectedMemberId],
  );

  const handleSelectMember = (member) => {
    setSelectedMemberId(member.id);
    setMemberDraft({
      status: member.status,
      role: member.role,
    });
  };

  const handleSaveSelectedMember = () => {
    if (!selectedMember) return;
    updateStatus({
      userId: selectedMember.id,
      status: statusToDBValue(memberDraft.status),
    });
  };

  const handleCloseSelectedMember = () => {
    setSelectedMemberId(null);
    setMemberDraft({ status: '', role: '' });
  };

  const normalMembers = members.filter((member) => member.status === '정상').length;
  const suspendedMembers = members.filter((member) => member.status === '정지').length;
  const withdrawnMembers = members.filter((member) => member.status === '탈퇴').length;
  const adminMembers = members.filter((member) => member.role === '관리자').length;

  return (
    <div className="mapingo-dashboard">
      <MapingoPageSection
        eyebrow="Admin"
        title="회원 관리"
        description="회원 목록과 상세 정보를 확인하고 회원 상태와 권한을 관리합니다."
      >
        <div className="mapingo-page-actions">
          <button type="button" className="mapingo-ghost-button" onClick={() => navigate('/admin')}>
            관리자 메인으로
          </button>
        </div>
        <MapingoMetricGrid
          items={[
            { label: '전체 회원', value: String(members.length), hint: '등록된 회원 수' },
            { label: '정상 회원', value: String(normalMembers), hint: '정상 이용 가능' },
            { label: '정지 회원', value: String(suspendedMembers), hint: `탈퇴 ${withdrawnMembers}명` },
            { label: '관리자', value: String(adminMembers), },
          ]}
        />
      </MapingoPageSection>

      <section className="mapingo-page-section">
        <div className="mapingo-list-card admin-members-panel">
          <div className="mapingo-card-header-row admin-members-head">
            <div>
              <h3>회원 목록 조회</h3>
              <p className="mapingo-muted-copy">이름, 이메일, 가입일, 상태를 확인하고 상세 조회로 이동합니다.</p>
            </div>
          </div>

          <label className="admin-member-search">
            <span>회원 검색</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="이름 또는 이메일 검색"
            />
          </label>

          <div className="admin-members-result">
            <span>{filteredMembers.length}명 표시 중</span>
            {searchTerm ? (
              <button type="button" className="mapingo-ghost-button" onClick={() => setSearchTerm('')}>
                검색 초기화
              </button>
            ) : null}
          </div>

          <div className="admin-members-table" role="table" aria-label="회원 목록">
            <div className="admin-members-row is-header" role="row">
              <span role="columnheader">회원</span>
              <span role="columnheader">가입일</span>
              <span role="columnheader">상태</span>
              <span role="columnheader">권한</span>
              <span role="columnheader">결제 상태</span>
              <span role="columnheader">최근 활동</span>
              <span role="columnheader">관리</span>
            </div>

            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`admin-members-row ${selectedMember?.id === member.id ? 'is-selected' : ''}`}
                role="row"
              >
                <div className="admin-member-primary" role="cell">
                  <strong>{member.name}</strong>
                  <p>{member.email}</p>
                </div>
                <p role="cell" className="admin-member-last-active">
                  {member.joinedAt}
                </p>
                <div role="cell">
                  <span className={`admin-member-status ${statusClassMap[member.status] ?? 'is-review'}`}>
                    {member.status}
                  </span>
                </div>
                <div role="cell">
                  <span className="mapingo-inline-badge">{member.role}</span>
                </div>
                <p role="cell" className="admin-member-last-active">
                  {member.paymentStatus}
                </p>
                <p role="cell" className="admin-member-last-active">
                  {member.lastActive}
                </p>
                <div role="cell" className="admin-member-actions">
                  <button
                    type="button"
                    className="mapingo-submit-button"
                    onClick={() => handleSelectMember(member)}
                  >
                    상세 조회
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 ? (
            <div className="admin-members-empty">
              <strong>검색 결과가 없습니다.</strong>
              <p>이름 또는 이메일을 다시 확인해 주세요.</p>
            </div>
          ) : null}
        </div>

        {selectedMember ? (
          <div className="admin-member-detail-panel">
            <div className="admin-member-detail-head">
              <div>
                <p className="growth-panel-kicker">회원 상세 조회</p>
                <h3>{selectedMember.name}</h3>
                <p>{selectedMember.email}</p>
              </div>
            </div>

            <div className="admin-member-detail-grid">
              <article className="admin-member-detail-card">
                <p className="mapingo-field-label">생년월일</p>
                <strong>{selectedMember.birthDate ?? '미등록'}</strong>
              </article>
              <article className="admin-member-detail-card">
                <p className="mapingo-field-label">전화번호</p>
                <strong>{selectedMember.phoneNumber ?? '미등록'}</strong>
              </article>
              <article className="admin-member-detail-card">
                <p className="mapingo-field-label">주소</p>
                <strong>{selectedMember.address ?? '미등록'}</strong>
              </article>
            </div>

            <div className="admin-member-detail-controls">
              <label className="mapingo-field">
                <span className="mapingo-field-label">회원 상태 변경</span>
                <select
                  className="mapingo-input"
                  value={memberDraft.status}
                  onChange={(event) =>
                    setMemberDraft((current) => ({ ...current, status: event.target.value }))
                  }
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-member-detail-actions">
              <button
                type="button"
                className="mapingo-submit-button"
                onClick={handleSaveSelectedMember}
              >
                저장
              </button>
              <button
                type="button"
                className="mapingo-ghost-button"
                onClick={handleCloseSelectedMember}
              >
                닫기
              </button>
            </div>

            <div className="admin-entity-stack">
              <section className="admin-entity-section">
                <div className="admin-entity-head">
                  <strong>신고 내역</strong>
                  <span>{selectedMember.reportHistory.length}건</span>
                </div>
                {selectedMember.reportHistory.length > 0 ? (
                  <div className="mapingo-selectable-list">
                    {selectedMember.reportHistory.map((report) => (
                      <article key={report.id} className="mapingo-post-card admin-content-card">
                        <div className="mapingo-admin-item-head">
                          <div>
                            <strong>{report.reason}</strong>
                            <p>{report.createdAt}</p>
                          </div>
                          <span className="mapingo-inline-badge">{report.status}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="admin-content-empty-state">신고 내역이 없습니다.</div>
                )}
              </section>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default AdminMembersPage;