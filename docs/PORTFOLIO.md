# DUOBACK 리디자인 - 포트폴리오

인체공학 의자 브랜드 듀오백 웹사이트를 현대적 디자인으로 재구성

## 프로젝트 정보

기간: 2026.01 (약 2주)
역할: 기획, 디자인, 프론트엔드 개발
유형: 개인 프로젝트

---

## 목표

기존 듀오백 웹사이트의 낮은 가독성과 구식 UI를 개선하여 프리미엄 브랜드 이미지에 맞는 현대적 웹사이트로 재구성

개선 방향:
- 미니멀하고 깔끔한 UI
- 모바일 우선 반응형 디자인
- 직관적인 제품 탐색 경험
- 접근성 기준 준수

---

## 기술 스택

Frontend
- HTML5 (시맨틱 마크업)
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript (ES6+, Vanilla JS)

방법론
- BEM (CSS 네이밍)
- Mobile First (반응형 설계)
- Progressive Enhancement

---

## 주요 기능

페이지 구성
- 메인: 텍스트 중심 Hero, 카테고리, 베스트셀러, 브랜드 스토리
- 제품 목록: 그리드/리스트 뷰, 정렬, 필터, URL 파라미터
- 제품 상세: 이미지 갤러리, 옵션 선택, 탭, 관련 제품
- 브랜드: 브랜드 스토리, 핵심 기술, 연혁
- 고객지원: FAQ, A/S 신청, 매장 안내
- 장바구니: 수량 조절, 주문 요약

핵심 구현
- 제품 데이터 관리: `products-data.js` 단일 데이터 소스
- 검색: 실시간 제품 검색 (이름, 카테고리, 키워드)
- 장바구니: LocalStorage 기반 상태 관리
- 반응형: Mobile (768px) / Tablet (1024px) / Desktop (1920px)
- 애니메이션: Intersection Observer 기반 스크롤 효과
- 접근성: ARIA 속성, 키보드 네비게이션

---

## 해결한 과제

### 1. 제품 데이터 중복 제거
각 페이지마다 하드코딩된 제품 데이터로 유지보수가 어려웠습니다. 단일 데이터 소스(`products-data.js`)로 통합하여 일관성을 확보했습니다.

### 2. 이미지 최적화
초기 로딩 시 모든 이미지가 동시 로드되어 속도가 저하되었습니다. `loading="lazy"` 속성과 `width/height` 명시로 CLS를 방지했습니다.

### 3. 접근성 개선
스크린 리더와 키보드 네비게이션이 지원되지 않았습니다. ARIA 속성, 키보드 이벤트 핸들링, ESC 키 모달 닫기를 구현했습니다.

### 4. 모바일 메뉴
햄버거 버튼만 있고 실제 메뉴가 없었습니다. 슬라이드 인 방식의 전체 메뉴 시스템을 구축했습니다.

### 5. SEO 최적화
Open Graph 메타태그가 없어 소셜 공유 미리보기가 표시되지 않았습니다. OG 및 Twitter Card 메타태그를 추가했습니다.

---

## 기술적 특징

디자인 시스템
```css
/* CSS Variables 기반 테마 관리 */
--color-accent: #2B7C73;            /* 테크 그린 */
--color-accent-secondary: #B46A4B;  /* 브론즈 클레이 */
--space-8: 2rem;                    /* 8px 기반 스케일 */
```

레이아웃
```css
/* Hero - 텍스트 중심 */
.hero__content {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

/* 반응형 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
```

데이터 구조
```javascript
window.PRODUCTS = [
  {
    id: 'q1w',
    name: 'Q1W 메쉬',
    category: '사무용 의자',
    price: 890000,
    images: [...],
    colors: [...],
    specs: {...}
  }
];
```

---

## 성과

개선 사항
- 정보 과밀 해소 및 시각적 계층 확립
- 모바일 사용성 대폭 개선 (메뉴, 반응형)
- 제품 데이터 중복 제거로 유지보수성 향상
- 접근성 기준 적용 (ARIA, 키보드)
- SEO 최적화 (OG 메타태그)

배운 점
- Intersection Observer API의 성능 우수성
- CSS Grid의 강력한 반응형 처리
- 접근성 구현의 중요성과 실전 적용
- Vanilla JS로 충분한 인터랙션 구현 가능
- 단일 데이터 소스의 중요성

---

## 향후 개선 방향

1. 백엔드 API 연동 (실제 제품 데이터)
2. 구조화된 데이터 추가 (Schema.org)
3. 성능 측정 및 최적화 (Lighthouse)
4. 접근성 심화 검증 (WCAG 2.1 AA)

---

## 파일 구조

```
duoback/
├── [6개 HTML 페이지]
├── css/ (8개 파일: reset, common, 페이지별, responsive)
├── js/ (8개 파일: common, products-data, 페이지별)
├── images/ (제품 이미지, 인증 로고)
└── docs/ (README, PORTFOLIO, CHANGELOG, WORKLOG)
```

---

작성: 2026.01
분류: 웹 리디자인, 퍼블리싱
