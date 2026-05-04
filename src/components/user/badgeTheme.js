export function getBadgeTheme(level) {
  if (level >= 60) {
    return { title: '마스터 익스플로러', ribbonColor: '#FFD166', softBg: '#FFF8DB', textColor: '#8A5A00', progress: 96 };
  }

  if (level >= 50) {
    return { title: '골드 가이드', ribbonColor: '#F48FB1', softBg: '#FDF2F8', textColor: '#9D174D', progress: 88 };
  }

  if (level >= 40) {
    return { title: '컬처 컬렉터', ribbonColor: '#B39DDB', softBg: '#F3E8FF', textColor: '#6D28D9', progress: 74 };
  }

  if (level >= 30) {
    return { title: '루트 러너', ribbonColor: '#7FB3FF', softBg: '#DBEAFE', textColor: '#1D4ED8', progress: 62 };
  }

  if (level >= 20) {
    return { title: '호기심 스타터', ribbonColor: '#7EDBD2', softBg: '#E6FFFB', textColor: '#0F766E', progress: 48 };
  }

  return { title: '첫 걸음', ribbonColor: '#B8E986', softBg: '#F7FEE7', textColor: '#4D7C0F', progress: 32 };
}
