function YoutubeRecommendationSection({ contents }) {
  return (
    <section className="youtube-recommendation-section" aria-labelledby="youtube-title">
      <div className="coaching-section-head">
        <p className="coaching-kicker">YouTube Picks</p>
        <h2 id="youtube-title">오늘 주제 추천 영상</h2>
      </div>
      <div className="youtube-video-grid">
        {contents.map((video, index) => (
          <article key={`${video.videoUrl}-${index}`} className="youtube-video-card">
            <div className="youtube-thumbnail" aria-hidden="true">
              {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt="" />
              ) : (
                <span>VIDEO</span>
              )}
            </div>
            <div>
              <span className="youtube-video-meta">
                {video.channelTitle}
              </span>
              <h3>{video.videoTitle}</h3>
              <p>{video.videoSummary}</p>
              {video.videoUrl ? (
                <a href={video.videoUrl} target="_blank" rel="noreferrer" className="youtube-video-link">
                  영상 보기
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default YoutubeRecommendationSection;
