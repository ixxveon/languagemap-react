function CoachingAccessDenied({ onGoMap, onGoPremium }) {
    return (
        <div className="coaching-access-denied">
            <div className="coaching-access-badge">FREE PLAN</div>

            <h2>AI Coaching은 Premium 플랜에서 이용할 수 있어요</h2>

            <p>
                지도 학습에서 연습한 내용을 기반으로 실제 AI와 실전 회화, 발음 평가,
                맞춤 피드백까지 이어서 학습할 수 있습니다.
            </p>

            <div className="coaching-access-features">
                <div>• AI 실전 회화 연습</div>
                <div>• 발음 정확도 분석</div>
                <div>• 개인 맞춤 피드백</div>
                <div>• 추천 학습 콘텐츠 제공</div>
            </div>

            <div className="coaching-access-buttons">
                <button type="button" className="secondary-button" onClick={onGoMap}>
                    지도 학습 계속하기
                </button>

                <button type="button" className="primary-button" onClick={onGoPremium}>
                    Premium 시작하기
                </button>
            </div>
        </div>
    );
}

export default CoachingAccessDenied;