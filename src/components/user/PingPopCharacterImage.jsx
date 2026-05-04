const getCharacterImagePath = (level) => {
  if (level >= 60) return '/assets/characters/pingpop-badge-lv60.png?v=9';
  if (level >= 50) return '/assets/characters/pingpop-badge-lv50.png?v=9';
  if (level >= 40) return '/assets/characters/pingpop-badge-lv40.png?v=9';
  if (level >= 30) return '/assets/characters/pingpop-badge-lv30.png?v=9';
  if (level >= 20) return '/assets/characters/pingpop-badge-lv20.png?v=9';
  return '/assets/characters/pingpop-badge-lv10.png?v=9';
};

function PingPopCharacterImage({ className = '', alt = 'PingPop character', level = 10 }) {
  const levelClassName = level >= 30 && level < 40 ? 'is-level-30' : '';
  const imageClassName = [className, levelClassName].filter(Boolean).join(' ');

  return <img src={getCharacterImagePath(level)} alt={alt} className={imageClassName} />;
}

export default PingPopCharacterImage;
