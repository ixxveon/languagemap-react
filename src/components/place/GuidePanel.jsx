function GuidePanel() {
    return (
        <div className="map-domain-panel map-domain-panel-overlay map-domain-panel-guide">
            <div className="map-domain-panel-empty">
                <p className="map-domain-panel-kicker">Mapingo Guide</p>
                <h2>마커를 눌러 장소 학습 패널을 열어보세요.</h2>
                <p>수도 버튼으로 도시를 이동하고, 마커를 누르면 장소 설명과 학습 시나리오를 바로 볼 수 있습니다.</p>

                <div className="map-domain-empty-list">
                    <article>
                        <strong>도시 이동</strong>
                        <span>상단 버튼으로 주요 수도를 빠르게 이동합니다.</span>
                    </article>

                    <article>
                        <strong>마커 선택</strong>
                        <span>지도 위 마커를 누르면 상세 장소 패널이 즉시 열립니다.</span>
                    </article>

                    <article>
                        <strong>영어 학습 시작</strong>
                        <span>학습하기를 누르면 실제 채팅방처럼 직접 입력하며 대화할 수 있습니다.</span>
                    </article>
                </div>
            </div>
        </div>
    );
}

export default GuidePanel;