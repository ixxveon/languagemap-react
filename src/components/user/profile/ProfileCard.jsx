const ProfileCard = ({ profile }) => {
    if (!profile) return null;

    return (
    <section>
        <h2>학습 프로필</h2>

        <p>현재 학습 레벨: Lv.{profile.level}</p>
        <p>누적 경험치: {profile.exp}</p>
        <p>총 학습 횟수: {profile.totalStudyCount}</p>
    </section>
    );
};

export default ProfileCard;