/**
 * ========================================
 * Common Functions
 * ========================================
 */

/**
 * 스크롤 시 헤더 스타일 변경
 * - 50px 이상 스크롤 시 is-scrolled 클래스 추가
 * - 그림자 효과 적용
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');

  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });
}


/**
 * 모바일 메뉴 초기화
 * - 햄버거 버튼 클릭 시 메뉴 토글
 * - 외부 클릭 시 메뉴 닫기
 * - ESC 키 누르면 메뉴 닫기
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuOverlay = document.querySelector('.mobile-menu__overlay');

  if (!menuBtn || !mobileMenu) return;

  // 메뉴 열기
  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // 메뉴 닫기
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // 메뉴 버튼 클릭
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();
  });

  // 닫기 버튼 클릭
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMenu);
  }

  // 오버레이 클릭 시 닫기
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMenu);
  }

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // 메뉴 링크 클릭 시 메뉴 닫기 (선택사항)
  const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__category');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}


/**
 * 스크롤 애니메이션 초기화 (Intersection Observer)
 * - 뷰포트에 들어오면 fade-in 애니메이션 실행
 * - stagger 효과 자동 적용
 * - data-animation 속성으로 애니메이션 타입 지정
 * - data-delay 속성으로 딜레이 지정
 *
 * 사용 예시:
 * <div class="animate-on-scroll">기본 fade-up</div>
 * <div class="animate-on-scroll" data-animation="fade-left">왼쪽에서 등장</div>
 * <div class="animate-on-scroll" data-delay="200">0.2초 딜레이</div>
 */
function initScrollAnimation() {
  // 자동 탐지: 명시적 클래스가 없으면 주요 섹션에 자동 적용
  autoApplyAnimationClasses();

  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(element => {
    observer.observe(element);
  });
}


/**
 * 주요 섹션에 애니메이션 클래스 자동 적용
 * - 섹션 타이틀, 제품 카드, 카테고리 카드 등에 자동 적용
 * - stagger 효과 자동 계산
 */
function autoApplyAnimationClasses() {
  // 이미 animate-on-scroll 클래스가 있으면 건너뛰기
  if (document.querySelectorAll('.animate-on-scroll').length > 0) return;

  // 섹션 헤더 (타이틀)
  const sectionHeaders = document.querySelectorAll('.section-header, .section-title');
  sectionHeaders.forEach(el => {
    el.classList.add('animate-on-scroll');
  });

  // 제품 카드 - stagger 효과
  const productGrids = document.querySelectorAll('.product-grid');
  productGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.classList.add('animate-on-scroll');
      card.dataset.delay = Math.min(index * 100, 500).toString();
    });
  });

  // 카테고리 카드 - stagger 효과
  const categoryGrids = document.querySelectorAll('.category-nav__grid');
  categoryGrids.forEach(grid => {
    const cards = grid.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
      card.classList.add('animate-on-scroll');
      card.dataset.animation = 'scale-up';
      card.dataset.delay = (index * 100).toString();
    });
  });

  // 브랜드 스토리 섹션
  const brandStoryImage = document.querySelector('.brand-story__image');
  const brandStoryText = document.querySelector('.brand-story__text');
  if (brandStoryImage) {
    brandStoryImage.classList.add('animate-on-scroll');
    brandStoryImage.dataset.animation = 'fade-right';
  }
  if (brandStoryText) {
    brandStoryText.classList.add('animate-on-scroll');
    brandStoryText.dataset.animation = 'fade-left';
    brandStoryText.dataset.delay = '200';
  }

  // Trust/Awards 섹션
  const trustTitle = document.querySelector('.trust-awards__title');
  if (trustTitle) {
    trustTitle.classList.add('animate-on-scroll');
  }
  const awardItems = document.querySelectorAll('.award-item');
  awardItems.forEach((item, index) => {
    item.classList.add('animate-on-scroll');
    item.dataset.delay = (index * 100).toString();
  });

  // NOTE: Hero 섹션은 CSS animation이 이미 적용되어 있으므로 제외
  // .hero__content에는 main.css에서 fadeInUp 애니메이션이 적용됨

  // 브랜드 페이지 요소들
  const brandHeroContent = document.querySelector('.brand-hero__content');
  if (brandHeroContent) {
    brandHeroContent.classList.add('animate-on-scroll');
    brandHeroContent.dataset.animation = 'fade';
  }

  // Philosophy 섹션
  const philosophyContent = document.querySelector('.brand-philosophy__content');
  if (philosophyContent) {
    philosophyContent.classList.add('animate-on-scroll');
  }

  // Technology 카드
  const techCards = document.querySelectorAll('.tech-card');
  techCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll');
    card.dataset.delay = (index * 150).toString();
  });

  // Timeline 아이템
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.classList.add('animate-on-scroll');
    item.dataset.animation = index % 2 === 0 ? 'fade-right' : 'fade-left';
    item.dataset.delay = '100';
  });

  // Values 카드
  const valueCards = document.querySelectorAll('.value-card');
  valueCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll');
    card.dataset.delay = (index * 100).toString();
  });

  // CTA 섹션
  const ctaContent = document.querySelector('.brand-cta__content');
  if (ctaContent) {
    ctaContent.classList.add('animate-on-scroll');
    ctaContent.dataset.animation = 'scale-up';
  }

  // ----------------------------------------
  // 제품 페이지 (products.html)
  // ----------------------------------------

  // 페이지 헤더
  const pageHeader = document.querySelector('.page-header__content');
  if (pageHeader) {
    pageHeader.classList.add('animate-on-scroll');
    pageHeader.dataset.animation = 'fade';
  }

  // 필터 바
  const filterBar = document.querySelector('.filter-bar__content');
  if (filterBar) {
    filterBar.classList.add('animate-on-scroll');
    filterBar.dataset.delay = '200';
  }

  // ----------------------------------------
  // 제품 상세 페이지 (product-detail.html)
  // ----------------------------------------

  // 제품 갤러리
  const productGallery = document.querySelector('.product-gallery');
  if (productGallery) {
    productGallery.classList.add('animate-on-scroll');
    productGallery.dataset.animation = 'fade-right';
  }

  // 제품 정보
  const productDetails = document.querySelector('.product-details');
  if (productDetails) {
    productDetails.classList.add('animate-on-scroll');
    productDetails.dataset.animation = 'fade-left';
    productDetails.dataset.delay = '200';
  }

  // 탭 섹션
  const tabsSection = document.querySelector('.product-tabs');
  if (tabsSection) {
    tabsSection.classList.add('animate-on-scroll');
  }

  // 관련 제품
  const relatedTitle = document.querySelector('.related-products .section-title');
  if (relatedTitle) {
    relatedTitle.classList.add('animate-on-scroll');
  }

  // ----------------------------------------
  // 고객지원 페이지 (support.html)
  // ----------------------------------------

  // 지원 카드
  const supportCards = document.querySelectorAll('.support-card');
  supportCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll');
    card.dataset.delay = (index * 100).toString();
  });

  // FAQ 아이템
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    item.classList.add('animate-on-scroll');
    item.dataset.delay = Math.min(index * 50, 300).toString();
  });

  // 지원 섹션 타이틀
  const supportTitles = document.querySelectorAll('.support-section__title');
  supportTitles.forEach(title => {
    title.classList.add('animate-on-scroll');
  });

  // ----------------------------------------
  // 장바구니 페이지 (cart.html)
  // ----------------------------------------

  // 장바구니 컨테이너
  const cartContainer = document.querySelector('.cart__container');
  if (cartContainer) {
    cartContainer.classList.add('animate-on-scroll');
    cartContainer.dataset.animation = 'fade';
  }
}


/**
 * 부드러운 스크롤
 * - 내부 링크 클릭 시 부드럽게 스크롤
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // # 또는 빈 링크는 건너뛰기
      if (href === '#' || !href) return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/**
 * 이미지 레이지 로딩 폴백
 * - loading="lazy" 미지원 브라우저 대응
 */
function initLazyLoading() {
  // 브라우저가 loading="lazy"를 지원하면 건너뛰기
  if ('loading' in HTMLImageElement.prototype) return;

  const images = document.querySelectorAll('img[loading="lazy"]');

  if (images.length === 0) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}


/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollAnimation();
  initSmoothScroll();
  initLazyLoading();
});
