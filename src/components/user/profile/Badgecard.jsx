const BadgeCard = ({ badge }) => {
    return (
    <div>
        <img src={badge.imageUrl} alt={badge.badgeName} width={80} />
        <h3>{badge.badgeName}</h3>
        <p>{badge.description}</p>
        <p>획득 조건: {badge.conditionType}</p>
        <p>조건 값: {badge.conditionValue}</p>
    </div>
    );
};

export default BadgeCard;