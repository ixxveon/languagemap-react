function ReturnActionBar({ onRetry }) {
  return (
    <section className="return-action-bar" aria-label="코칭 마무리 액션">
      <div>
        <p className="coaching-kicker">Finish</p>
        <h2>오늘 연습이 끝났습니다</h2>
      </div>
      <div className="return-action-buttons">
        <button type="button" className="mapingo-ghost-button" onClick={onRetry}>
          다시 연습하기
        </button>
        <a className="mapingo-primary-button" href="/map">
          지도 학습 페이지로 돌아가기
        </a>
      </div>
    </section>
  );
}

export default ReturnActionBar;
