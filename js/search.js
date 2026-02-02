/**
 * ========================================
 * Search Functionality
 * ========================================
 */

/**
 * 제품 데이터 (공통 데이터 사용)
 */
const productsData = window.PRODUCTS || [];

function formatPrice(value) {
  if (typeof value !== 'number') return '';
  return `₩${value.toLocaleString('ko-KR')}`;
}


/**
 * Search Manager
 */
const SearchManager = {
  modal: null,
  input: null,
  searchResults: null,
  searchEmpty: null,
  searchNoResults: null,
  clearBtn: null,
  closeBtn: null,
  overlay: null,

  /**
   * 초기화
   */
  init() {
    this.modal = document.getElementById('searchModal');
    this.input = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');
    this.searchEmpty = document.getElementById('searchEmpty');
    this.searchNoResults = document.getElementById('searchNoResults');
    this.clearBtn = document.getElementById('searchClear');
    this.closeBtn = document.getElementById('searchClose');
    this.overlay = document.querySelector('.search-modal__overlay');

    if (!this.modal) return;

    this.attachEvents();
  },

  /**
   * 이벤트 리스너 연결
   */
  attachEvents() {
    // 검색 버튼 클릭 (헤더의 검색 아이콘)
    const searchButtons = document.querySelectorAll('.header__action-btn[aria-label="검색"]');
    searchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // 검색 입력
    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Clear 버튼 표시/숨김
      if (query) {
        this.clearBtn.style.display = 'flex';
      } else {
        this.clearBtn.style.display = 'none';
      }

      // 검색 실행
      this.search(query);
    });

    // Clear 버튼
    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.clearBtn.style.display = 'none';
      this.input.focus();
      this.showEmpty();
    });

    // Close 버튼
    this.closeBtn.addEventListener('click', () => {
      this.close();
    });

    // Overlay 클릭
    this.overlay.addEventListener('click', () => {
      this.close();
    });

    // ESC 키
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.close();
      }
    });

    // Enter 키 - 첫 번째 결과로 이동
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstResult = this.searchResults.querySelector('.search-result-item');
        if (firstResult) {
          window.location.href = firstResult.href;
        }
      }
    });
  },

  /**
   * 모달 열기
   */
  open() {
    this.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // 포커스
    setTimeout(() => {
      this.input.focus();
    }, 100);
  },

  /**
   * 모달 닫기
   */
  close() {
    this.modal.classList.remove('is-open');
    document.body.style.overflow = '';

    // 리셋
    this.input.value = '';
    this.clearBtn.style.display = 'none';
    this.showEmpty();
  },

  /**
   * 검색 실행
   */
  search(query) {
    if (!query) {
      this.showEmpty();
      return;
    }

    // 검색어를 소문자로 변환 (대소문자 구분 없이 검색)
    const lowerQuery = query.toLowerCase();

    // 제품 검색
    const results = productsData.filter(product => {
      // 제품명에서 검색
      if (product.name?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // 카테고리에서 검색
      if (product.category?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // 키워드에서 검색
      if ((product.keywords || []).some(keyword =>
        keyword.toLowerCase().includes(lowerQuery)
      )) {
        return true;
      }

      // 하이라이트/요약에서 검색
      if ((product.highlights || []).some(highlight =>
        highlight.toLowerCase().includes(lowerQuery)
      )) {
        return true;
      }

      if (product.summary?.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      return false;
    });

    // 결과 표시
    if (results.length > 0) {
      this.showResults(results);
    } else {
      this.showNoResults();
    }
  },

  /**
   * Empty 상태 표시
   */
  showEmpty() {
    this.searchEmpty.style.display = 'flex';
    this.searchNoResults.style.display = 'none';
    this.searchResults.classList.remove('has-results');
    this.searchResults.innerHTML = '';
  },

  /**
   * No Results 상태 표시
   */
  showNoResults() {
    this.searchEmpty.style.display = 'none';
    this.searchNoResults.style.display = 'flex';
    this.searchResults.classList.remove('has-results');
    this.searchResults.innerHTML = '';
  },

  /**
   * 검색 결과 표시
   */
  showResults(results) {
    this.searchEmpty.style.display = 'none';
    this.searchNoResults.style.display = 'none';
    this.searchResults.classList.add('has-results');

    // 결과 HTML 생성
    this.searchResults.innerHTML = results.map(product => `
      <a href="product-detail.html?id=${product.id}" class="search-result-item">
        <div class="search-result-item__image">
          <img src="${product.images?.[0] || ''}" alt="${product.name}">
        </div>
        <div class="search-result-item__info">
          <div class="search-result-item__name">${product.name}</div>
          <div class="search-result-item__category">${product.category}</div>
          <div class="search-result-item__price">${formatPrice(product.price)}</div>
        </div>
      </a>
    `).join('');
  }
};


/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  SearchManager.init();
});
