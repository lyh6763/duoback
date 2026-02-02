/**
 * ========================================
 * Products Page Interactions
 * ========================================
 */

const ProductsPage = {
  grid: null,
  items: [],
  products: [],
  productMap: new Map(),
  filteredProducts: [],
  activeCategory: 'all',
  sortPrice: null,
  sortPopular: null,
  sortNew: null,
  viewToggles: null,
  categoryConfig: {
    all: {
      title: '전체 제품',
      subtitle: 'All Products',
      matches: []
    },
    office: {
      title: '사무용 의자',
      subtitle: 'Office Chairs',
      matches: ['사무용 의자']
    },
    student: {
      title: '학생용 의자',
      subtitle: 'Student Chairs',
      matches: ['학생용 의자']
    },
    gaming: {
      title: '게이밍 의자',
      subtitle: 'Gaming Chairs',
      matches: ['게이밍 의자']
    },
    premium: {
      title: '프리미엄 의자',
      subtitle: 'Premium Chairs',
      matches: ['프리미엄 의자']
    }
  },

  init() {
    this.grid = document.getElementById('productGrid');
    if (!this.grid) return;

    this.products = window.PRODUCTS || [];
    this.productMap = new Map(this.products.map(product => [product.id, product]));
    this.activeCategory = this.getCategoryParam();
    this.filteredProducts = this.filterProducts(this.activeCategory);

    this.renderProducts(this.filteredProducts);
    this.updateHeader(this.activeCategory);

    this.sortPrice = document.getElementById('sortPrice');
    this.sortPopular = document.getElementById('sortPopular');
    this.sortNew = document.getElementById('sortNew');
    this.viewToggles = Array.from(document.querySelectorAll('.view-toggle'));

    this.cacheItems();
    this.enhanceCards();
    this.attachEvents();
    this.syncViewToggle('grid');
    this.updateCount();
    this.applyCardAnimations();
  },

  getCategoryParam() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('category');
    if (!value) return 'all';
    return this.categoryConfig[value] ? value : 'all';
  },

  filterProducts(categoryKey) {
    const config = this.categoryConfig[categoryKey] || this.categoryConfig.all;
    if (!config || categoryKey === 'all' || config.matches.length === 0) {
      return this.products.slice();
    }
    return this.products.filter(product => config.matches.includes(product.category));
  },

  renderProducts(list) {
    if (!this.grid) return;

    const products = Array.isArray(list) ? list : [];
    this.grid.innerHTML = '';
    if (products.length === 0) {
      this.renderEmptyState();
      return;
    }

    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
      const card = this.createProductCard(product);
      fragment.appendChild(card);
    });
    this.grid.appendChild(fragment);
  },

  renderEmptyState() {
    const empty = document.createElement('div');
    empty.className = 'products-empty';
    empty.innerHTML = `
      <p class="products-empty__title">해당 카테고리 제품이 준비 중입니다.</p>
      <p class="products-empty__desc">다른 카테고리를 확인해 주세요.</p>
    `;
    this.grid.appendChild(empty);
  },

  createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'product-card';

    const defaultColor = product.colors?.[0]?.name || '';
    const imageSrc = product.colorImages?.[defaultColor] || product.images?.[0] || '';
    const imageAlt = `${product.name} ${defaultColor}`.trim() || product.name;
    const originalPrice = typeof product.originalPrice === 'number'
      ? `<span class=\"product-card__price-original\">${this.formatPrice(product.originalPrice)}</span>`
      : '';

    const colorsMarkup = (product.colors || []).map((color) => {
      const border = color.color === '#FFFFFF' ? ' border: 1px solid #E5E2DC;' : '';
      return `<span class=\"color-dot\" style=\"background-color: ${color.color};${border}\" aria-label=\"${color.name}\" data-color=\"${color.name}\"></span>`;
    }).join('');

    article.dataset.selectedColor = defaultColor;

    article.innerHTML = `
      <a href=\"product-detail.html?id=${product.id}\" class=\"product-card__link\">
        <div class=\"product-card__image\">
          <img src=\"${imageSrc}\" alt=\"${imageAlt}\" loading=\"lazy\" width=\"600\" height=\"600\">
        </div>
        <div class=\"product-card__info\">
          <h3 class=\"product-card__name\">${product.name}</h3>
          <p class=\"product-card__category\">${product.category}</p>
          <div class=\"product-card__colors\">
            ${colorsMarkup}
          </div>
          <div class=\"product-card__price\">
            <span class=\"product-card__price-current\">${this.formatPrice(product.price)}</span>
            ${originalPrice}
          </div>
        </div>
      </a>
    `;

    return article;
  },

  cacheItems() {
    const cards = Array.from(this.grid.querySelectorAll('.product-card'));
    this.items = cards.map((card, index) => {
      const id = this.getProductId(card);
      const product = this.productMap.get(id);
      const priceText = card.querySelector('.product-card__price-current')?.textContent || '';

      return {
        id,
        card,
        index,
        product,
        price: typeof product?.price === 'number' ? product.price : this.parsePrice(priceText),
        popularScore: product?.popularScore || 0,
        reviewCount: product?.reviewCount || 0,
        releaseDate: product?.releaseDate ? new Date(product.releaseDate).getTime() : 0
      };
    });
  },

  attachEvents() {
    if (this.sortPrice) {
      this.sortPrice.addEventListener('change', () => {
        if (this.sortPrice.value) {
          this.resetSorts(['sortPopular', 'sortNew']);
        }
        this.applySort();
      });
    }

    if (this.sortPopular) {
      this.sortPopular.addEventListener('change', () => {
        if (this.sortPopular.value) {
          this.resetSorts(['sortPrice', 'sortNew']);
        }
        this.applySort();
      });
    }

    if (this.sortNew) {
      this.sortNew.addEventListener('change', () => {
        if (this.sortNew.value) {
          this.resetSorts(['sortPrice', 'sortPopular']);
        }
        this.applySort();
      });
    }

    if (this.viewToggles.length > 0) {
      this.viewToggles.forEach(btn => {
        btn.addEventListener('click', () => {
          const view = btn.dataset.view || 'grid';
          this.syncViewToggle(view);
        });
      });
    }
  },

  resetSorts(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  },

  applySort() {
    if (this.items.length === 0) {
      this.renderProducts([]);
      return;
    }
    const sortMode = this.getActiveSort();
    if (!sortMode) {
      this.renderItems(this.items.slice().sort((a, b) => a.index - b.index));
      return;
    }

    const sorted = this.items.slice().sort((a, b) => {
      switch (sortMode) {
        case 'price-low':
          return a.price - b.price || a.index - b.index;
        case 'price-high':
          return b.price - a.price || a.index - b.index;
        case 'popular':
          return b.popularScore - a.popularScore || a.index - b.index;
        case 'review':
          return b.reviewCount - a.reviewCount || a.index - b.index;
        case 'newest':
          return b.releaseDate - a.releaseDate || a.index - b.index;
        case 'oldest':
          return a.releaseDate - b.releaseDate || a.index - b.index;
        default:
          return a.index - b.index;
      }
    });

    this.renderItems(sorted);
  },

  getActiveSort() {
    if (this.sortPrice?.value === 'low') return 'price-low';
    if (this.sortPrice?.value === 'high') return 'price-high';

    if (this.sortPopular?.value === 'popular') return 'popular';
    if (this.sortPopular?.value === 'review') return 'review';

    if (this.sortNew?.value === 'newest') return 'newest';
    if (this.sortNew?.value === 'oldest') return 'oldest';

    return null;
  },

  renderItems(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => fragment.appendChild(item.card));
    this.grid.innerHTML = '';
    this.grid.appendChild(fragment);
  },

  syncViewToggle(view) {
    const isList = view === 'list';
    this.grid.classList.toggle('product-grid--list', isList);

    this.viewToggles.forEach(btn => {
      const isActive = btn.dataset.view === view;
      btn.classList.toggle('view-toggle--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  },

  getProductId(card) {
    const link = card.querySelector('.product-card__link');
    const href = link?.getAttribute('href') || '';

    try {
      const url = new URL(href, window.location.origin);
      return url.searchParams.get('id') || null;
    } catch (error) {
      const match = href.match(/id=([^&]+)/);
      return match ? match[1] : null;
    }
  },

  parsePrice(value) {
    const numeric = value.replace(/[^0-9]/g, '');
    return numeric ? parseInt(numeric, 10) : 0;
  },

  formatPrice(value) {
    if (typeof value !== 'number') return '';
    return `₩${value.toLocaleString('ko-KR')}`;
  },

  enhanceCards() {
    this.items.forEach(item => {
      if (!item.product) return;
      this.hydrateCard(item.card, item.product);
    });
  },

  hydrateCard(card, product) {
    const info = card.querySelector('.product-card__info');
    if (!info) return;

    const priceBlock = info.querySelector('.product-card__price');
    const summaryEl = this.ensureElement(info, 'p', 'product-card__summary', priceBlock);
    if (summaryEl) summaryEl.textContent = product.summary || '';

    const highlightsEl = this.ensureElement(info, 'div', 'product-card__highlights', priceBlock);
    if (highlightsEl) {
      const highlights = product.highlights || [];
      highlightsEl.innerHTML = highlights.map(text => (
        `<span class="product-badge">${text}</span>`
      )).join('');
    }

    const chipsEl = this.ensureElement(info, 'div', 'product-card__color-chips', priceBlock);
    if (chipsEl) {
      this.renderColorChips(chipsEl, card, product);
    }

    const priceCurrentEl = info.querySelector('.product-card__price-current');
    if (priceCurrentEl && typeof product.price === 'number') {
      priceCurrentEl.textContent = this.formatPrice(product.price);
    }

    const priceOriginalEl = info.querySelector('.product-card__price-original');
    if (priceOriginalEl) {
      if (typeof product.originalPrice === 'number') {
        priceOriginalEl.textContent = this.formatPrice(product.originalPrice);
        priceOriginalEl.style.display = 'inline';
      } else {
        priceOriginalEl.style.display = 'none';
      }
    }

    let actions = card.querySelector('.product-card__actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'product-card__actions';
      card.appendChild(actions);
    }

    let detailLink = actions.querySelector('.product-card__detail');
    if (!detailLink) {
      detailLink = document.createElement('a');
      detailLink.className = 'btn btn--secondary btn--small product-card__detail';
      detailLink.href = `product-detail.html?id=${product.id}`;
      detailLink.textContent = '자세히 보기';
      actions.appendChild(detailLink);
    }

    let addBtn = actions.querySelector('.product-card__add');
    if (!addBtn) {
      addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn btn--primary btn--small product-card__add';
      addBtn.textContent = '장바구니 담기';
      actions.appendChild(addBtn);
    }

    if (!addBtn.dataset.bound) {
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedColor = this.getSelectedColor(card, product);
        this.quickAddToCart(product, selectedColor);
      });
      addBtn.dataset.bound = 'true';
    }
  },

  ensureElement(parent, tag, className, beforeNode) {
    let el = parent.querySelector(`.${className}`);
    if (!el) {
      el = document.createElement(tag);
      el.className = className;
      if (beforeNode) {
        parent.insertBefore(el, beforeNode);
      } else {
        parent.appendChild(el);
      }
    }
    return el;
  },

  quickAddToCart(product, selectedColor) {
    if (!window.CartManager) {
      alert('장바구니 기능을 사용할 수 없습니다.');
      return;
    }

    const fallbackColor = product.colors?.[0]?.name || '';
    const color = selectedColor || fallbackColor;
    const image = product.colorImages?.[color] || product.images?.[0] || '';
    const cartItem = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: this.formatPrice(product.price),
      selectedColor: color,
      quantity: 1,
      image: image
    };

    const success = window.CartManager.addToCart(cartItem);

    if (window.CartNotification) {
      if (success) {
        window.CartNotification.show(`${product.name} (${color}) 1개를 장바구니에 담았습니다.`, 'success');
      } else {
        window.CartNotification.show('장바구니에 담기 실패했습니다.', 'error');
      }
    } else if (!success) {
      alert('장바구니에 담기 실패했습니다.');
    }
  },

  getSelectedColor(card, product) {
    if (card.dataset.selectedColor) return card.dataset.selectedColor;
    const activeChip = card.querySelector('.color-chip.is-active');
    if (activeChip?.dataset?.color) return activeChip.dataset.color;
    return product.colors?.[0]?.name || '';
  },

  renderColorChips(container, card, product) {
    const colors = product.colors || [];
    if (colors.length === 0) return;

    const selected = card.dataset.selectedColor || colors[0].name;

    if (!container.dataset.ready) {
      container.innerHTML = '';
      const fragment = document.createDocumentFragment();

      colors.forEach((color, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'color-chip';
        button.dataset.color = color.name;
        button.dataset.index = String(index);
        button.setAttribute('aria-pressed', color.name === selected ? 'true' : 'false');

        const swatch = document.createElement('span');
        swatch.className = 'color-chip__swatch';
        swatch.style.backgroundColor = color.color;
        if (color.color === '#FFFFFF') {
          swatch.style.border = '1px solid #E5E2DC';
        }

        const label = document.createElement('span');
        label.className = 'color-chip__label';
        label.textContent = color.name;

        button.appendChild(swatch);
        button.appendChild(label);
        fragment.appendChild(button);
      });

      container.appendChild(fragment);
      container.dataset.ready = 'true';
    }

    this.setSelectedColor(card, product, selected);

    container.querySelectorAll('.color-chip').forEach(button => {
      if (!button.dataset.bound) {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          const colorName = button.dataset.color || '';
          const index = parseInt(button.dataset.index || '0', 10);
          this.setSelectedColor(card, product, colorName, index);
        });
        button.dataset.bound = 'true';
      }
    });
  },

  setSelectedColor(card, product, colorName, colorIndex) {
    const colors = product.colors || [];
    const index = Number.isInteger(colorIndex)
      ? colorIndex
      : Math.max(0, colors.findIndex(color => color.name === colorName));

    const resolvedIndex = index >= 0 ? index : 0;
    const resolvedColor = colors[resolvedIndex]?.name || colorName || colors[0]?.name || '';

    card.dataset.selectedColor = resolvedColor;
    card.dataset.selectedColorIndex = String(resolvedIndex);

    const chips = card.querySelectorAll('.color-chip');
    chips.forEach(chip => {
      const isActive = chip.dataset.color === resolvedColor;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    this.syncColorDots(card, resolvedColor);
    this.updateCardImage(card, product, resolvedIndex, resolvedColor);
  },

  syncColorDots(card, selectedColor) {
    const dots = card.querySelectorAll('.product-card__colors .color-dot');
    if (dots.length === 0) return;

    dots.forEach(dot => {
      const label = dot.dataset.color || dot.getAttribute('aria-label') || '';
      const isActive = label === selectedColor;
      dot.classList.toggle('is-active', isActive);
      if (!dot.dataset.color && label) {
        dot.dataset.color = label;
      }
    });
  },

  updateCardImage(card, product, colorIndex, colorName) {
    const img = card.querySelector('.product-card__image img');
    if (!img) return;

    const colorImages = product.colorImages || {};
    const images = product.images || [];
    const target = colorImages[colorName] || images[colorIndex % images.length];
    if (target) {
      img.src = target;
      img.alt = `${product.name} ${colorName}`.trim();
    }
  },
  updateCount() {
    const countEl = document.querySelector('.page-header__count strong');
    if (!countEl) return;
    countEl.textContent = String(this.filteredProducts.length);
  },

  updateHeader(categoryKey) {
    const config = this.categoryConfig[categoryKey] || this.categoryConfig.all;
    const titleEl = document.querySelector('.page-header__title');
    const subtitleEl = document.querySelector('.page-header__subtitle');

    if (titleEl && config?.title) titleEl.textContent = config.title;
    if (subtitleEl && config?.subtitle) subtitleEl.textContent = config.subtitle;
  },

  applyCardAnimations() {
    if (!this.grid) return;

    const cards = this.grid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
      card.classList.add('animate-on-scroll');
      card.dataset.delay = Math.min(index * 100, 500).toString();
    });

    if (typeof initScrollAnimation === 'function') {
      initScrollAnimation();
    }
  }
};

/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  ProductsPage.init();
});
