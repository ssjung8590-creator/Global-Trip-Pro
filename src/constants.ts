import { CountryInfo } from "./types";

export const COUNTRIES: CountryInfo[] = [
  {
    id: "jp",
    name: "일본",
    nameEn: "Japan",
    emoji: "🇯🇵",
    voltage: "100V",
    plugType: "Type A (2-pin)",
    weatherSummary: "현재 대부분 맑음, 낮 기온 18-22도 예상. 야외 활동하기 좋은 날씨입니다.",
    forecast: [
      { day: "월", temp: "21°", condition: "☀️" },
      { day: "화", temp: "22°", condition: "☀️" },
      { day: "수", temp: "19°", condition: "☁️" },
      { day: "목", temp: "18°", condition: "🌧️" },
      { day: "금", temp: "20°", condition: "⛅" },
      { day: "토", temp: "23°", condition: "☀️" },
      { day: "일", temp: "22°", condition: "☀️" },
    ]
  },
  {
    id: "us",
    name: "미국",
    nameEn: "USA",
    emoji: "🇺🇸",
    voltage: "120V",
    plugType: "Type A / B",
    weatherSummary: "뉴욕 기준 흐림, 기온 15-20도. 일교차가 크니 가벼운 겉옷을 챙기세요.",
    forecast: [
      { day: "월", temp: "18°", condition: "☁️" },
      { day: "화", temp: "17°", condition: "🌧️" },
      { day: "수", temp: "16°", condition: "🌧️" },
      { day: "목", temp: "19°", condition: "⛅" },
      { day: "금", temp: "21°", condition: "☀️" },
      { day: "토", temp: "22°", condition: "☀️" },
      { day: "일", temp: "20°", condition: "☁️" },
    ]
  },
  {
    id: "cn",
    name: "중국",
    nameEn: "China",
    emoji: "🇨🇳",
    voltage: "220V",
    plugType: "Type A / C / I",
    weatherSummary: "베이징 기준 맑음, 기온 20-25도. 대기질 보통. 야외 활동 시 마스크 착용 권장.",
    forecast: [
      { day: "월", temp: "23°", condition: "☀️" },
      { day: "화", temp: "25°", condition: "☀️" },
      { day: "수", temp: "24°", condition: "⛅" },
      { day: "목", temp: "22°", condition: "☁️" },
      { day: "금", temp: "21°", condition: "☀️" },
      { day: "토", temp: "24°", condition: "☀️" },
      { day: "일", temp: "26°", condition: "☀️" },
    ]
  },
  {
    id: "sg",
    name: "싱가포르",
    nameEn: "Singapore",
    emoji: "🇸🇬",
    voltage: "230V",
    plugType: "Type G (3-pin)",
    weatherSummary: "열대 기후. 스콜(갑작스런 비) 주의, 기온 28-32도 습도 높음. 항상 우산을 휴대하세요.",
    forecast: [
      { day: "월", temp: "31°", condition: "⛈️" },
      { day: "화", temp: "30°", condition: "⛈️" },
      { day: "수", temp: "32°", condition: "🌦️" },
      { day: "목", temp: "31°", condition: "☀️" },
      { day: "금", temp: "32°", condition: "☀️" },
      { day: "토", temp: "33°", condition: "🌦️" },
      { day: "일", temp: "31°", condition: "⛈️" },
    ]
  },
  {
    id: "uk",
    name: "영국",
    nameEn: "United Kingdom",
    emoji: "🇬🇧",
    voltage: "230V",
    plugType: "Type G (3-pin)",
    weatherSummary: "런던 기준 흐리고 가끔 비. 기온 12-18도. 변덕스러운 날씨에 대비해 우비나 우산을 준비하세요.",
    forecast: [
      { day: "월", temp: "15°", condition: "☁️" },
      { day: "화", temp: "14°", condition: "🌧️" },
      { day: "수", temp: "16°", condition: "🌦️" },
      { day: "목", temp: "17°", condition: "☁️" },
      { day: "금", temp: "18°", condition: "⛅" },
      { day: "토", temp: "16°", condition: "🌧️" },
      { day: "일", temp: "15°", condition: "☁️" },
    ]
  },
  {
    id: "de",
    name: "독일",
    nameEn: "Germany",
    emoji: "🇩🇪",
    voltage: "230V",
    plugType: "Type C / F",
    weatherSummary: "대체로 흐리고 비 가능성 있음. 기온 10-15도. 쌀쌀한 날씨이니 따뜻한 옷차림이 필요합니다.",
    forecast: [
      { day: "월", temp: "12°", condition: "☁️" },
      { day: "화", temp: "11°", condition: "🌧️" },
      { day: "수", temp: "13°", condition: "🌧️" },
      { day: "목", temp: "14°", condition: "⛅" },
      { day: "금", temp: "15°", condition: "☀️" },
      { day: "토", temp: "14°", condition: "☁️" },
      { day: "일", temp: "13°", condition: "🌧️" },
    ]
  },
  {
    id: "fr",
    name: "프랑스",
    nameEn: "France",
    emoji: "🇫🇷",
    voltage: "230V",
    plugType: "Type C / E",
    weatherSummary: "파리 기준 맑음. 기온 15-22도 일교차 주의. 낮에는 따뜻하지만 저녁엔 쌀쌀할 수 있습니다.",
    forecast: [
      { day: "월", temp: "19°", condition: "☀️" },
      { day: "화", temp: "21°", condition: "☀️" },
      { day: "수", temp: "22°", condition: "☀️" },
      { day: "목", temp: "20°", condition: "⛅" },
      { day: "금", temp: "18°", condition: "☁️" },
      { day: "토", temp: "19°", condition: "☀️" },
      { day: "일", temp: "21°", condition: "☀️" },
    ]
  },
  {
    id: "vn",
    name: "베트남",
    nameEn: "Vietnam",
    emoji: "🇻🇳",
    voltage: "220V",
    plugType: "Type A / C / G",
    weatherSummary: "고온 다습. 하노이 기준 28-32도 습도 높음. 통풍이 잘 되는 옷을 준비하세요.",
    forecast: [
      { day: "월", temp: "30°", condition: "⛅" },
      { day: "화", temp: "31°", condition: "☀️" },
      { day: "수", temp: "32°", condition: "☀️" },
      { day: "목", temp: "30°", condition: "🌦️" },
      { day: "금", temp: "29°", condition: "⛈️" },
      { day: "토", temp: "31°", condition: "☀️" },
      { day: "일", temp: "32°", condition: "☀️" },
    ]
  },
  {
    id: "th",
    name: "태국",
    nameEn: "Thailand",
    emoji: "🇹🇭",
    voltage: "220V",
    plugType: "Type A / B / C / O",
    weatherSummary: "방콕 기준 무더운 날씨. 기온 30-35도 예상. 자외선이 강하니 선크림과 모자를 챙기세요.",
    forecast: [
      { day: "월", temp: "33°", condition: "☀️" },
      { day: "화", temp: "34°", condition: "☀️" },
      { day: "수", temp: "35°", condition: "☀️" },
      { day: "목", temp: "33°", condition: "⛅" },
      { day: "금", temp: "32°", condition: "🌦️" },
      { day: "토", temp: "34°", condition: "☀️" },
      { day: "일", temp: "35°", condition: "☀️" },
    ]
  },
  {
    id: "tw",
    name: "대만",
    nameEn: "Taiwan",
    emoji: "🇹🇼",
    voltage: "110V",
    plugType: "Type A / B",
    weatherSummary: "타이베이 기준 흐림. 기온 22-26도. 실내 에어컨이 강할 수 있으니 가벼운 가디건을 추천합니다.",
    forecast: [
      { day: "월", temp: "24°", condition: "☁️" },
      { day: "화", temp: "25°", condition: "☁️" },
      { day: "수", temp: "23°", condition: "🌧️" },
      { day: "목", temp: "22°", condition: "🌧️" },
      { day: "금", temp: "24°", condition: "⛅" },
      { day: "토", temp: "26°", condition: "☀️" },
      { day: "일", temp: "25°", condition: "⛅" },
    ]
  },
  {
    id: "hk",
    name: "홍콩",
    nameEn: "Hong Kong",
    emoji: "🇭🇰",
    voltage: "220V",
    plugType: "Type G (3-pin)",
    weatherSummary: "흐리고 습함. 기온 24-28도. 소나기 가능성이 있으니 우산을 챙기세요.",
    forecast: [
      { day: "월", temp: "26°", condition: "☁️" },
      { day: "화", temp: "27°", condition: "🌦️" },
      { day: "수", temp: "28°", condition: "☀️" },
      { day: "목", temp: "26°", condition: "⛈️" },
      { day: "금", temp: "25°", condition: "🌧️" },
      { day: "토", temp: "27°", condition: "⛅" },
      { day: "일", temp: "28°", condition: "☀️" },
    ]
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // 필수
  { id: '1', name: '여권 (신분증)', category: '필수', completed: false, icon: '🛂' },
  { id: '2', name: '여행자보험', category: '필수', completed: false, icon: '📄' },
  { id: '3', name: '트래블카드 / 신용카드', category: '필수', completed: false, icon: '💳' },
  { id: '4', name: '환전 (현지 화폐)', category: '필수', completed: false, icon: '💵' },
  { id: '5', name: '마스크', category: '필수', completed: false, icon: '😷' },
  
  // 전자기기
  { id: '6', name: '변환콘센트 (멀티어댑터)', category: '전자기기', completed: false, icon: '🔌' },
  { id: '7', name: '노트북 & 거치대', category: '전자기기', completed: false, icon: '💻' },
  { id: '8', name: '핸드폰 / 워치 충전기', category: '전자기기', completed: false, icon: '🔋' },
  { id: '9', name: '멀티탭 (긴 것)', category: '전자기기', completed: false, icon: '🔌' },
  { id: '10', name: '보조배터리 (기내휴대)', category: '전자기기', completed: false, icon: '🔋' },
  { id: '11', name: '이어폰 / 비행기 귀마개', category: '전자기기', completed: false, icon: '🎧' },
  
  // 세면/위생
  { id: '12', name: '슬리퍼 (기내/호텔용)', category: '세면/위생', completed: false, icon: '🩴' },
  { id: '13', name: '면도기 / 칫솔 / 치약', category: '세면/위생', completed: false, icon: '🪥' },
  { id: '14', name: '치실 / 워터픽', category: '세면/위생', completed: false, icon: '🦷' },
  { id: '15', name: '바디로션 / 얼굴로션', category: '세면/위생', completed: false, icon: '🧴' },
  { id: '16', name: '물티슈 / 휴지', category: '세면/위생', completed: false, icon: '🧻' },
  { id: '17', name: '안경닦이 / 빗', category: '세면/위생', completed: false, icon: '👓' },
  { id: '18', name: '우산 / 모자 / 핫팩', category: '세면/위생', completed: false, icon: '🌂' },
  
  // 의류
  { id: '19', name: '정장 (자켓/바지/셔츠)', category: '의류', completed: false, icon: '👔' },
  { id: '20', name: '코트 / 스웨터', category: '의류', completed: false, icon: '🧥' },
  { id: '21', name: '얇은패딩 / 바람막이', category: '의류', completed: false, icon: '🧥' },
  { id: '22', name: '내복 / 잠옷 / 실내복', category: '의류', completed: false, icon: '👕' },
  { id: '23', name: '속옷 / 양말 / 손수건', category: '의류', completed: false, icon: '🧦' },
  { id: '24', name: '장갑', category: '의류', completed: false, icon: '🧤' },
  
  // 식량/상비약
  { id: '25', name: '영양제 / 상비약 (타이레놀 등)', category: '식량/상비약', completed: false, icon: '💊' },
  { id: '26', name: '햇반 / 컵라면 / 김치', category: '식량/상비약', completed: false, icon: '🍜' },
  { id: '27', name: '말린 국 / 김 / 견과류', category: '식량/상비약', completed: false, icon: '🥜' },
  { id: '28', name: '숟가락 / 나무젓가락 / 과일칼', category: '식량/상비약', completed: false, icon: '🍴' },
  { id: '29', name: '종이컵 / 위생봉투', category: '식량/상비약', completed: false, icon: '🥤' },
  
  // 기타/가방
  { id: '30', name: '세탁물 봉지 / 키친타올', category: '기타/가방', completed: false, icon: '🧺' },
  { id: '31', name: '에코백 / 여유 가방', category: '기타/가방', completed: false, icon: '👜' },
  { id: '32', name: '캐리어 내부 사진 찍기', category: '기타/가방', completed: false, icon: '📸' },
];
