import { formatDate } from '../../utils/community/friendUtils';
import StatusPill from './StatusPill';

function ReportCard({ report, userDirectory }) {
    const reportedUser = userDirectory[report.reported_user_id];

    if (!reportedUser) {
        return null;
    }

    return (
        <article className="community-friends-report-card">
            <div className="community-friends-title-row">
                <h4>{reportedUser.name}</h4>
                <StatusPill status={report.status} />
            </div>

            <p className="community-friends-report-reason">{report.reason}</p>

            <div className="community-friends-meta-row">
                <span>신고일 {formatDate(report.created_at)}</span>
                <span>
                    {report.processed_at
                        ? `처리일 ${formatDate(report.processed_at)}`
                        : '처리 대기 중'}
                </span>
            </div>

            {report.admin_memo ? (
                <div className="community-friends-admin-memo">
                    <strong>관리자 메모</strong>
                    <p>{report.admin_memo}</p>
                </div>
            ) : null}
        </article>
    );
}

export default ReportCard;