function YoutubeRecommendationSection({ videos }) {
  return (
    <section className="youtube-recommendation-section" aria-labelledby="youtube-title">
      <div className="coaching-section-head">
        <p className="coaching-kicker">YouTube Picks</p>
        <h2 id="youtube-title">오늘 주제 추천 영상</h2>
      </div>
      <div className="youtube-video-grid">
        {videos.map((video) => (
          <article key={video.id} className="youtube-video-card">
            <div className="youtube-thumbnail" aria-hidden="true">
              <span>{video.thumbnail}</span>
            </div>
            <div>
              <span className="youtube-video-meta">
                {video.channel} · {video.length}
              </span>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default YoutubeRecommendationSection;
