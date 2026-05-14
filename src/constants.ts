import { CountryInfo } from "./types";

export const COUNTRIES: CountryInfo[] = [
  {
    id: "jp",
    name: "일본",
    nameEn: "Japan",
    emoji: "🇯🇵",
    voltage: "100V",
    plugType: "Type A (2-pin)",
    weatherSummary: "현재 대부분 맑음, 낮 기온 18-22도 예상."
  },
  {
    id: "us",
    name: "미국",
    nameEn: "USA",
    emoji: "🇺🇸",
    voltage: "120V",
    plugType: "Type A / B",
    weatherSummary: "지역별 편차 큼. 뉴욕 기준 흐림, 기온 15-20도."
  },
  {
    id: "de",
    name: "독일",
    nameEn: "Germany",
    emoji: "🇩🇪",
    voltage: "230V",
    plugType: "Type C / F",
    weatherSummary: "대체로 흐리고 비 가능성 있음. 기온 10-15도."
  },
  {
    id: "vn",
    name: "베트남",
    nameEn: "Vietnam",
    emoji: "🇻🇳",
    voltage: "220V",
    plugType: "Type A / C / G",
    weatherSummary: "고온 다습. 하노이 기준 28-32도 습도 높음."
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
