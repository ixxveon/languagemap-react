import {
    getStatusLabel,
    getStatusTone,
} from '../../utils/community/friendUtils';

function StatusPill({ status }) {
    return (
        <span className={`community-friends-status-pill is-${getStatusTone(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
}

export default StatusPill;