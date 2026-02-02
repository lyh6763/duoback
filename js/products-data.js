/**
 * ========================================
 * Product Data (Single Source of Truth)
 * ========================================
 */

window.PRODUCTS = [
  {
    id: 'q1w',
    name: 'Q1W 메쉬',
    category: '사무용 의자',
    price: 890000,
    originalPrice: 1200000,
    images: [
      'images/products/Q1W_메쉬(1).jpg',
      'images/products/Q1W_메쉬(2).jpg'
    ],
    colors: [
      { name: '블랙', color: '#000000' },
      { name: '그레이', color: '#9E9E9E' }
    ],
    colorImages: {
      '블랙': 'images/products/Q1W_메쉬(1).jpg',
      '그레이': 'images/products/Q1W_메쉬(2).jpg'
    },
    specs: {
      name: 'Q1W 메쉬',
      category: '사무용 의자',
      size: '670 x 670 x 1200~1300mm',
      seatHeight: '450~550mm',
      backHeight: '700mm',
      armrest: '4D 조절 가능',
      material: '프리미엄 에어 메쉬, 알루미늄 베이스',
      colors: '블랙, 그레이',
      maxWeight: '120kg',
      origin: '대한민국',
      warranty: '3년',
      kc: 'KC-AB-1234-5678'
    },
    keywords: ['Q1W', '메쉬', '사무용', '오피스', '인체공학'],
    summary: '정밀한 서포트와 통기성을 갖춘 프리미엄 오피스 체어.',
    highlights: ['4D 팔걸이', '에어 메쉬', '알루미늄 베이스'],
    popularScore: 92,
    reviewCount: 148,
    releaseDate: '2024-10-18'
  },
  {
    id: 'dk073w',
    name: 'DK-073W',
    category: '학생용 의자',
    price: 650000,
    images: [
      'images/products/DK-073W(1).jpg',
      'images/products/DK-073W(2).jpg',
      'images/products/DK-073W(3).jpg',
      'images/products/DK-073W(4).jpg',
      'images/products/DK-073W(5).jpg'
    ],
    colors: [
      { name: '블랙', color: '#000000' },
      { name: '블루', color: '#2196F3' }
    ],
    colorImages: {
      '블랙': 'images/products/DK-073W(1).jpg',
      '블루': 'images/products/DK-073W(2).jpg'
    },
    specs: {
      name: 'DK-073W',
      category: '학생용 의자',
      size: '670 x 670 x 1150~1250mm',
      seatHeight: '450~550mm',
      backHeight: '650mm',
      armrest: '4D 조절 가능',
      material: '프리미엄 에어 메쉬, 나일론 베이스',
      colors: '블랙, 블루',
      maxWeight: '120kg',
      origin: '대한민국',
      warranty: '3년',
      kc: 'KC-AB-1234-5678'
    },
    keywords: ['DK-073W', 'DK073W', '학생용', '학생', '공부', '책상'],
    summary: '집중 학습을 위한 균형 설계와 부드러운 착좌감.',
    highlights: ['4D 팔걸이', '에어 메쉬', '학생용 설계'],
    popularScore: 85,
    reviewCount: 96,
    releaseDate: '2024-07-05'
  },
  {
    id: 'd3hs',
    name: 'D3-HS 메쉬',
    category: '사무용 의자',
    price: 780000,
    images: [
      'images/products/D3-HS_메쉬(1).jpg',
      'images/products/D3-HS_메쉬(2).jpg',
      'images/products/D3-HS_메쉬(3).jpg',
      'images/products/D3-HS_메쉬(4).jpg'
    ],
    colors: [
      { name: '블랙', color: '#000000' },
      { name: '화이트', color: '#FFFFFF' }
    ],
    colorImages: {
      '블랙': 'images/products/D3-HS_메쉬(1).jpg',
      '화이트': 'images/products/D3-HS_메쉬(2).jpg'
    },
    specs: {
      name: 'D3-HS 메쉬',
      category: '사무용 의자',
      size: '680 x 680 x 1180~1280mm',
      seatHeight: '460~560mm',
      backHeight: '680mm',
      armrest: '3D 조절 가능',
      material: '프리미엄 메쉬, 나일론 베이스',
      colors: '블랙, 화이트',
      maxWeight: '120kg',
      origin: '대한민국',
      warranty: '3년',
      kc: 'KC-AB-1234-5679'
    },
    keywords: ['D3-HS', 'D3HS', '메쉬', '사무용', '오피스'],
    summary: '유연한 3D 팔걸이로 다양한 자세에 대응하는 베스트셀러.',
    highlights: ['3D 팔걸이', '프리미엄 메쉬', '화이트 옵션'],
    popularScore: 88,
    reviewCount: 112,
    releaseDate: '2024-09-02'
  },
  {
    id: 'd043w',
    name: 'D-043W PLUS',
    category: '학생용 의자',
    price: 520000,
    images: [
      'images/products/D-043W_PLUS.jpg'
    ],
    colors: [
      { name: '블랙', color: '#000000' },
      { name: '블루', color: '#2196F3' }
    ],
    colorImages: {
      '블랙': 'images/products/D-043W_PLUS.jpg',
      '블루': 'images/products/D-043W_PLUS.jpg'
    },
    specs: {
      name: 'D-043W PLUS',
      category: '학생용 의자',
      size: '650 x 650 x 1100~1200mm',
      seatHeight: '430~530mm',
      backHeight: '620mm',
      armrest: '고정형',
      material: '메쉬, 나일론 베이스',
      colors: '블랙, 블루',
      maxWeight: '100kg',
      origin: '대한민국',
      warranty: '3년',
      kc: 'KC-AB-1234-5680'
    },
    keywords: ['D-043W', 'D043W', 'PLUS', '플러스', '학생용', '학생'],
    summary: '합리적인 구성과 심플한 라인으로 구성한 학습용 모델.',
    highlights: ['고정형 팔걸이', '경량 베이스', '학생용'],
    popularScore: 79,
    reviewCount: 64,
    releaseDate: '2023-12-12'
  },
  {
    id: 'd2500g',
    name: 'D2500G-DASW',
    category: '사무용 의자',
    price: 950000,
    images: [
      'images/products/D2500G-DASW(1).jpg',
      'images/products/D2500G-DASW(2).jpg'
    ],
    colors: [
      { name: '블랙', color: '#000000' },
      { name: '그레이', color: '#9E9E9E' }
    ],
    colorImages: {
      '블랙': 'images/products/D2500G-DASW(1).jpg',
      '그레이': 'images/products/D2500G-DASW(2).jpg'
    },
    specs: {
      name: 'D2500G-DASW',
      category: '사무용 의자',
      size: '690 x 690 x 1220~1320mm',
      seatHeight: '470~570mm',
      backHeight: '720mm',
      armrest: '4D 조절 가능',
      material: '프리미엄 메쉬, 알루미늄 베이스',
      colors: '블랙, 그레이',
      maxWeight: '130kg',
      origin: '대한민국',
      warranty: '3년',
      kc: 'KC-AB-1234-5681'
    },
    keywords: ['D2500G', 'DASW', '사무용', '오피스', '프리미엄'],
    summary: '프리미엄 라인업에 걸맞은 소재와 밸런스를 갖춘 모델.',
    highlights: ['4D 팔걸이', '알루미늄 베이스', '프리미엄 라인'],
    popularScore: 95,
    reviewCount: 178,
    releaseDate: '2024-11-22'
  }
];
