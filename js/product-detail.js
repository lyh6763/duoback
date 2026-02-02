/**
 * ========================================
 * Product Detail Page Functions
 * ========================================
 */

/**
 * 제품 데이터 (공통 데이터 사용)
 */
const productData = (window.PRODUCTS || []).reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

function formatPrice(value) {
  if (typeof value !== 'number') return '';
  return `₩${value.toLocaleString('ko-KR')}`;
}

/**
 * URL에서 제품 ID 가져오기
 */
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || 'dk073w'; // 기본값: dk073w
}

/**
 * 제품 정보 로드 및 페이지 업데이트
 */
function loadProductData() {
  const productId = getProductId();
  const product = productData[productId];

  if (!product) {
    console.error('제품 정보를 찾을 수 없습니다:', productId);
    return;
  }

  // 제품 이미지 갤러리 업데이트
  updateProductGallery(product.images);

  // 제품 정보 업데이트
  updateProductInfo(product);

  // 제품 스펙 업데이트
  updateProductSpecs(product.specs);
}

/**
 * 제품 갤러리 업데이트
 */
function updateProductGallery(images) {
  const mainImage = document.getElementById('mainImage');
  const thumbnailsContainer = document.querySelector('.product-gallery__thumbnails');

  if (!mainImage || !thumbnailsContainer || !images || images.length === 0) return;

  // 메인 이미지 업데이트
  mainImage.src = images[0];
  mainImage.alt = '제품 메인 이미지';

  // 썸네일 업데이트
  thumbnailsContainer.innerHTML = '';
  images.forEach((imageSrc, index) => {
    const button = document.createElement('button');
    button.className = `thumbnail${index === 0 ? ' thumbnail--active' : ''}`;
    button.dataset.image = imageSrc;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `제품 이미지 ${index + 1}`;

    button.appendChild(img);
    thumbnailsContainer.appendChild(button);
  });
}

/**
 * 제품 정보 업데이트
 */
function updateProductInfo(product) {
  const titleEl = document.querySelector('.product-details__title');
  const categoryEl = document.querySelector('.product-details__category');
  const priceCurrentEl = document.querySelector('.price-current');
  const priceOriginalEl = document.querySelector('.price-original');

  if (titleEl) titleEl.textContent = product.name;
  if (categoryEl) categoryEl.textContent = product.category;
  if (priceCurrentEl) priceCurrentEl.textContent = formatPrice(product.price);

  // 할인가가 있는 경우에만 표시
  if (priceOriginalEl) {
    if (product.originalPrice) {
      priceOriginalEl.textContent = formatPrice(product.originalPrice);
      priceOriginalEl.style.display = 'inline';
    } else {
      priceOriginalEl.style.display = 'none';
    }
  }

  // 컬러 옵션 업데이트
  updateColorOptions(product.colors);
}

/**
 * 컬러 옵션 업데이트
 */
function updateColorOptions(colors) {
  const colorSelector = document.querySelector('.color-selector');
  if (!colorSelector || !colors) return;

  colorSelector.innerHTML = '';
  colors.forEach((color, index) => {
    const button = document.createElement('button');
    button.className = `color-option${index === 0 ? ' color-option--active' : ''}`;
    button.dataset.color = color.name;
    button.setAttribute('aria-label', `${color.name} 선택`);

    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color.color;
    if (color.color === '#FFFFFF') {
      swatch.style.border = '1px solid #E5E2DC';
    }

    const name = document.createElement('span');
    name.className = 'color-name';
    name.textContent = color.name;

    button.appendChild(swatch);
    button.appendChild(name);
    colorSelector.appendChild(button);
  });
}

/**
 * 제품 스펙 업데이트
 */
function updateProductSpecs(specs) {
  const specsTable = document.querySelector('.specs-table tbody');
  if (!specsTable || !specs) return;

  specsTable.innerHTML = `
    <tr>
      <th scope="row">제품명</th>
      <td>${specs.name}</td>
    </tr>
    <tr>
      <th scope="row">카테고리</th>
      <td>${specs.category}</td>
    </tr>
    <tr>
      <th scope="row">크기 (W x D x H)</th>
      <td>${specs.size}</td>
    </tr>
    <tr>
      <th scope="row">좌판 높이</th>
      <td>${specs.seatHeight} (가스압 조절)</td>
    </tr>
    <tr>
      <th scope="row">등받이 높이</th>
      <td>${specs.backHeight}</td>
    </tr>
    <tr>
      <th scope="row">팔걸이</th>
      <td>${specs.armrest}</td>
    </tr>
    <tr>
      <th scope="row">소재</th>
      <td>${specs.material}</td>
    </tr>
    <tr>
      <th scope="row">컬러</th>
      <td>${specs.colors}</td>
    </tr>
    <tr>
      <th scope="row">최대 하중</th>
      <td>${specs.maxWeight}</td>
    </tr>
    <tr>
      <th scope="row">원산지</th>
      <td>${specs.origin}</td>
    </tr>
    <tr>
      <th scope="row">품질보증</th>
      <td>${specs.warranty}</td>
    </tr>
    <tr>
      <th scope="row">KC 인증</th>
      <td>${specs.kc}</td>
    </tr>
  `;
}

/**
 * 제품 갤러리 썸네일 클릭 기능
 * - 썸네일 클릭 시 메인 이미지 변경
 * - 활성화된 썸네일 표시
 */
function initProductGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainImage');

  if (!thumbnails.length || !mainImage) return;

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      // 모든 썸네일에서 active 클래스 제거
      thumbnails.forEach(t => t.classList.remove('thumbnail--active'));

      // 클릭한 썸네일에 active 클래스 추가
      thumbnail.classList.add('thumbnail--active');

      // 메인 이미지 변경
      const newImageSrc = thumbnail.dataset.image;
      if (newImageSrc) {
        mainImage.src = newImageSrc;
        mainImage.alt = thumbnail.querySelector('img')?.alt || '제품 이미지';
      }
    });
  });
}


/**
 * 탭 전환 기능
 * - 탭 버튼 클릭 시 해당 탭 패널 표시
 * - 활성화된 탭 버튼 및 패널 표시
 */
function initProductTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabButtons.length || !tabPanels.length) return;

  function setActiveTab(activeButton) {
    tabButtons.forEach(btn => {
      const isActive = btn === activeButton;
      btn.classList.toggle('tab-btn--active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    tabPanels.forEach(panel => {
      const isTarget = panel.id === activeButton.dataset.tab;
      panel.classList.toggle('tab-panel--active', isTarget);
      panel.setAttribute('aria-hidden', isTarget ? 'false' : 'true');
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      setActiveTab(button);
    });
  });

  // 초기 활성 탭 설정
  const defaultActive = document.querySelector('.tab-btn--active') || tabButtons[0];
  if (defaultActive) {
    setActiveTab(defaultActive);
  }
}


/**
 * 수량 조절 기능
 * - 증가/감소 버튼 클릭
 * - 직접 입력 시 유효성 검사
 */
function initQuantitySelector() {
  const quantityInput = document.querySelector('.quantity-input');
  const minusBtn = document.querySelector('.quantity-btn--minus');
  const plusBtn = document.querySelector('.quantity-btn--plus');

  if (!quantityInput || !minusBtn || !plusBtn) return;

  const min = parseInt(quantityInput.getAttribute('min')) || 1;
  const max = parseInt(quantityInput.getAttribute('max')) || 99;

  // 수량 업데이트 함수
  function updateQuantity(value) {
    let newValue = parseInt(value);

    // 유효성 검사
    if (isNaN(newValue) || newValue < min) {
      newValue = min;
    } else if (newValue > max) {
      newValue = max;
    }

    quantityInput.value = newValue;

    // 버튼 상태 업데이트
    minusBtn.disabled = newValue <= min;
    plusBtn.disabled = newValue >= max;
  }

  // 감소 버튼
  minusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    updateQuantity(currentValue - 1);
  });

  // 증가 버튼
  plusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    updateQuantity(currentValue + 1);
  });

  // 직접 입력
  quantityInput.addEventListener('input', (e) => {
    updateQuantity(e.target.value);
  });

  // 초기 상태 설정
  updateQuantity(quantityInput.value);
}


/**
 * 컬러 선택 기능
 * - 컬러 옵션 클릭 시 선택 상태 변경
 */
function initColorSelector() {
  const colorOptions = document.querySelectorAll('.color-option');

  if (!colorOptions.length) return;

  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // 모든 컬러 옵션에서 active 클래스 제거
      colorOptions.forEach(opt => opt.classList.remove('color-option--active'));

      // 클릭한 컬러 옵션에 active 클래스 추가
      option.classList.add('color-option--active');

      // 선택된 컬러 정보 (필요시 사용)
    });
  });
}


/**
 * 장바구니 담기 기능
 * - 장바구니 버튼 클릭 시 localStorage에 저장
 */
function initAddToCart() {
  const cartBtn = document.querySelector('.product-details__actions .btn--secondary');

  if (!cartBtn) return;

  cartBtn.addEventListener('click', () => {
    // 제품 정보 수집
    const productId = getProductId();
    const product = productData[productId];

    if (!product) {
      CartNotification.show('제품 정보를 찾을 수 없습니다.', 'error');
      return;
    }

    const productName = document.querySelector('.product-details__title')?.textContent || product.name;
    const quantity = parseInt(document.querySelector('.quantity-input')?.value) || 1;
    const selectedColorEl = document.querySelector('.color-option--active .color-name');
    const selectedColor = selectedColorEl?.textContent || product.colors[0].name;
    const price = document.querySelector('.price-current')?.textContent || formatPrice(product.price);
    const imageEl = document.getElementById('mainImage');
    const image = imageEl?.src || product.images[0];

    // 장바구니에 추가할 제품 데이터
    const cartItem = {
      id: productId,
      name: productName,
      category: product.category,
      price: price,
      selectedColor: selectedColor,
      quantity: quantity,
      image: image
    };

    // 장바구니에 추가
    const success = CartManager.addToCart(cartItem);

    if (success) {
      CartNotification.show(`${productName} (${selectedColor}) ${quantity}개를 장바구니에 담았습니다.`, 'success');
    } else {
      CartNotification.show('장바구니에 담기 실패했습니다.', 'error');
    }
  });
}


/**
 * 바로 구매하기 기능
 * - 구매 버튼 클릭 시 알림
 */
function initBuyNow() {
  const buyBtn = document.querySelector('.product-details__actions .btn--primary');

  if (!buyBtn) return;

  buyBtn.addEventListener('click', () => {
    const productName = document.querySelector('.product-details__title')?.textContent || '제품';
    const quantity = document.querySelector('.quantity-input')?.value || 1;
    const selectedColor = document.querySelector('.color-option--active .color-name')?.textContent || '';

    alert(`${productName} (${selectedColor}) ${quantity}개 구매 페이지로 이동합니다.`);
  });
}


/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 제품 데이터 로드 (가장 먼저 실행)
  loadProductData();

  // 기능 초기화
  initProductGallery();
  initProductTabs();
  initQuantitySelector();
  initColorSelector();
  initAddToCart();
  initBuyNow();
});
