# DUOBACK 리디자인

인체공학 의자 브랜드 듀오백의 웹사이트를 현대적인 디자인으로 재구성한 프로젝트입니다.

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [구현 내용](#구현-내용)
- [해결 과제](#해결-과제)
- [프로젝트 구조](#프로젝트-구조)

---

## 프로젝트 개요

### 배경
기존 듀오백 웹사이트는 전형적인 쇼핑몰 레이아웃으로, 정보 과밀과 시각적 계층 구조의 부재가 문제였습니다. 이 프로젝트는 브랜드 프리미엄 이미지에 맞는 현대적 웹사이트로 재구성하는 것을 목표로 했습니다.

### 목표
- 미니멀하고 깔끔한 UI로 브랜드 아이덴티티 강화
- 모바일 우선 반응형 디자인 구현
- 직관적인 제품 탐색 경험 제공
- 접근성 기준 준수 (ARIA, 키보드 네비게이션)

### 타겟
재택근무 직장인, 학생, 인체공학 의자에 관심 있는 사용자

---

## 기술 스택

### Frontend
- HTML5 (시맨틱 마크업)
- CSS3 (Grid, Flexbox, CSS Variables)
- JavaScript ES6+ (Vanilla JS)

### 방법론
- BEM - CSS 네이밍 규칙
- Mobile First - 모바일 우선 반응형 설계
- Progressive Enhancement - 점진적 향상

### 최적화
- Intersection Observer API (스크롤 애니메이션)
- Lazy Loading (이미지 지연 로딩)
- CSS Variables (테마 관리)

---

## 주요 기능

### 페이지 구성
- 메인: 텍스트 중심 Hero, 카테고리 네비게이션, 베스트셀러, 브랜드 스토리
- 제품 목록: 그리드 레이아웃, 정렬, 필터링, 리스트/그리드 뷰
- 제품 상세: 이미지 갤러리, 옵션 선택, 탭 네비게이션, 관련 제품
- 브랜드: 브랜드 스토리, 핵심 기술, 연혁 타임라인
- 고객지원: FAQ 아코디언, A/S 신청, 매장 안내
- 장바구니: 수량 조절, 주문 요약, 결제

### 핵심 기능
- 제품 데이터 관리: `products-data.js` 단일 데이터 소스 관리
- 검색: 실시간 제품 검색 (이름, 카테고리, 키워드)
- 장바구니: LocalStorage 기반 상태 관리
- 반응형: Mobile (768px) / Tablet (1024px) / Desktop (1920px)
- 스크롤 애니메이션: Intersection Observer 기반 페이드인
- 접근성: ARIA 속성, 키보드 네비게이션, 스크린리더 지원

---

## 구현 내용

### 디자인 시스템
```css
/* 컬러 */
--color-text-primary: #151B22;
--color-accent: #2B7C73;
--color-accent-secondary: #B46A4B;

/* 타이포그래피 */
--font-primary: 'IBM Plex Sans KR';
--font-secondary: 'Space Grotesk';
--font-serif: 'Newsreader';

/* 스페이싱 (8px 기반) */
--space-4: 1rem;    /* 16px */
--space-8: 2rem;    /* 32px */
--space-16: 4rem;   /* 64px */
```

### 제품 데이터 구조
```javascript
// products-data.js - 단일 데이터 소스
window.PRODUCTS = [
  {
    id: 'q1w',
    name: 'Q1W 메쉬',
    category: '사무용 의자',
    price: 890000,
    images: [...],
    colors: [...],
    specs: {...},
    keywords: ['Q1W', '메쉬', '사무용']
  }
];
```

### 레이아웃
```css
/* Hero - 텍스트 중심 단일 컬럼 */
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

/* 컨테이너 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}
```

---

## 해결 과제

### 1. 이미지 최적화
초기 로딩 시 모든 이미지가 동시에 로드되어 속도가 저하되는 문제가 있었습니다. `loading="lazy"` 속성과 `width/height` 명시로 CLS를 방지했습니다.

```html
<img src="product.jpg" loading="lazy" width="600" height="600" alt="제품">
```

### 2. 제품 데이터 중복
각 페이지마다 제품 데이터가 하드코딩되어 유지보수가 어려웠습니다. `products-data.js` 단일 데이터 소스로 통합했습니다.

```javascript
// 모든 페이지에서 공통 데이터 사용
window.PRODUCTS = [{...}, {...}];
```

### 3. 접근성
스크린 리더와 키보드 네비게이션이 지원되지 않았습니다. ARIA 속성과 키보드 이벤트 핸들링을 추가했습니다.

```html
<div role="dialog" aria-modal="true" aria-labelledby="title">
  <button aria-label="메뉴 닫기">닫기</button>
</div>
```

```javascript
// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
```

### 4. 모바일 메뉴
햄버거 버튼만 있고 실제 메뉴가 구현되지 않았습니다. 슬라이드 인 방식의 모바일 메뉴를 구현했습니다.

```javascript
function openMenu() {
  mobileMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
```

### 5. SEO
Open Graph 메타태그가 없어 소셜 공유 시 미리보기가 표시되지 않았습니다. OG 및 Twitter Card 메타태그를 추가했습니다.

```html
<meta property="og:title" content="DUOBACK | 인체공학 의자">
<meta property="og:image" content="images/products/DK-073W(1).jpg">
```

---

## 프로젝트 구조

```
duoback/
├── index.html
├── products.html
├── product-detail.html
├── brand.html
├── support.html
├── cart.html
├── css/
│   ├── reset.css
│   ├── common.css           # CSS Variables, 공통 스타일
│   ├── main.css
│   ├── products.css
│   ├── product-detail.css
│   ├── brand.css
│   ├── support.css
│   ├── cart.css
│   └── responsive.css
├── js/
│   ├── common.js            # 헤더, 메뉴, 애니메이션
│   ├── products-data.js     # 제품 데이터 (단일 소스)
│   ├── products.js          # 제품 목록 로직
│   ├── product-detail.js
│   ├── cart.js              # 장바구니 로직
│   ├── cart-page.js
│   ├── search.js
│   └── support.js
├── images/
│   ├── products/
│   └── awards/
└── docs/
    ├── README.md
    ├── PORTFOLIO.md
    ├── CHANGELOG.md
    └── WORKLOG.md
```

---

## 향후 개선 방향

1. 실제 백엔드 API 연동
2. 구조화된 데이터 (Schema.org) 추가
3. 성능 측정 및 최적화 (Lighthouse 기준)
4. 접근성 심화 검증 (WCAG 2.1 AA)

---

작성: 2026.01
프로젝트: DUOBACK 리디자인 포트폴리오
