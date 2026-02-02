/**
 * ========================================
 * Cart Page Functions
 * ========================================
 */

/**
 * 장바구니 페이지 렌더링
 */
function renderCartPage() {
  const cart = CartManager.getCart();
  const cartEmpty = document.getElementById('cartEmpty');
  const cartContent = document.getElementById('cartContent');
  const cartItems = document.getElementById('cartItems');

  if (cart.length === 0) {
    // 장바구니가 비어있을 때
    cartEmpty.classList.add('is-visible');
    cartContent.classList.remove('is-visible');
  } else {
    // 장바구니에 제품이 있을 때
    cartEmpty.classList.remove('is-visible');
    cartContent.classList.add('is-visible');

    // 장바구니 아이템 렌더링
    cartItems.innerHTML = cart.map(item => createCartItemHTML(item)).join('');

    // 총 금액 업데이트
    updateCartSummary();

    // 이벤트 리스너 추가
    attachCartItemEvents();
  }
}

/**
 * 장바구니 아이템 HTML 생성
 */
function createCartItemHTML(item) {
  const unitPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
  const totalPrice = unitPrice * item.quantity;

  // 컬러 값 추출 (컬러 이름에서 실제 색상 코드로 변환)
  const colorMap = {
    '블랙': '#000000',
    '그레이': '#9E9E9E',
    '화이트': '#FFFFFF',
    '블루': '#2196F3',
    '네이비': '#1565C0'
  };
  const colorCode = colorMap[item.selectedColor] || '#000000';

  return `
    <div class="cart-item" data-id="${item.id}" data-color="${item.selectedColor}">
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.name}">
      </div>

      <div class="cart-item__info">
        <div class="cart-item__header">
          <h3 class="cart-item__name">${item.name}</h3>
          <p class="cart-item__category">${item.category}</p>
          <div class="cart-item__color">
            <span class="cart-item__color-dot" style="background-color: ${colorCode};${colorCode === '#FFFFFF' ? ' border-color: #E5E2DC;' : ''}"></span>
            <span>${item.selectedColor}</span>
          </div>
        </div>

        <div class="cart-item__controls">
          <div class="cart-item__quantity">
            <button class="cart-item__quantity-btn cart-item__quantity-minus" aria-label="수량 감소">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <span class="cart-item__quantity-value">${item.quantity}</span>
            <button class="cart-item__quantity-btn cart-item__quantity-plus" aria-label="수량 증가">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <button class="cart-item__remove" aria-label="제품 삭제">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            삭제
          </button>
        </div>
      </div>

      <div class="cart-item__price-section">
        <div>
          <div class="cart-item__price">${formatPrice(totalPrice)}</div>
          <div class="cart-item__unit-price">개당 ${item.price}</div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 장바구니 요약 업데이트
 */
function updateCartSummary() {
  const subtotal = CartManager.getCartTotal();
  const shipping = 0; // 무료 배송
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? '무료' : formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

/**
 * 가격 포맷팅
 */
function formatPrice(price) {
  return '₩' + price.toLocaleString('ko-KR');
}

/**
 * 장바구니 아이템 이벤트 리스너 추가
 */
function attachCartItemEvents() {
  // 수량 증가 버튼
  document.querySelectorAll('.cart-item__quantity-plus').forEach(btn => {
    btn.addEventListener('click', handleQuantityIncrease);
  });

  // 수량 감소 버튼
  document.querySelectorAll('.cart-item__quantity-minus').forEach(btn => {
    btn.addEventListener('click', handleQuantityDecrease);
  });

  // 삭제 버튼
  document.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', handleRemoveItem);
  });
}

/**
 * 수량 증가 처리
 */
function handleQuantityIncrease(e) {
  const cartItem = e.target.closest('.cart-item');
  const productId = cartItem.dataset.id;
  const selectedColor = cartItem.dataset.color;
  const currentQuantity = parseInt(cartItem.querySelector('.cart-item__quantity-value').textContent);

  if (currentQuantity >= 99) {
    CartNotification.show('최대 수량은 99개입니다.', 'error');
    return;
  }

  CartManager.updateQuantity(productId, selectedColor, currentQuantity + 1);
  renderCartPage();
}

/**
 * 수량 감소 처리
 */
function handleQuantityDecrease(e) {
  const cartItem = e.target.closest('.cart-item');
  const productId = cartItem.dataset.id;
  const selectedColor = cartItem.dataset.color;
  const currentQuantity = parseInt(cartItem.querySelector('.cart-item__quantity-value').textContent);

  if (currentQuantity <= 1) {
    // 수량이 1일 때는 삭제 확인
    if (confirm('제품을 장바구니에서 삭제하시겠습니까?')) {
      CartManager.removeFromCart(productId, selectedColor);
      renderCartPage();
    }
  } else {
    CartManager.updateQuantity(productId, selectedColor, currentQuantity - 1);
    renderCartPage();
  }
}

/**
 * 제품 삭제 처리
 */
function handleRemoveItem(e) {
  const cartItem = e.target.closest('.cart-item');
  const productId = cartItem.dataset.id;
  const selectedColor = cartItem.dataset.color;
  const productName = cartItem.querySelector('.cart-item__name').textContent;

  if (confirm(`${productName}을(를) 장바구니에서 삭제하시겠습니까?`)) {
    CartManager.removeFromCart(productId, selectedColor);
    CartNotification.show('제품이 삭제되었습니다.', 'success');
    renderCartPage();
  }
}

/**
 * 결제 버튼 처리
 */
function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = CartManager.getCart();
      if (cart.length === 0) {
        CartNotification.show('장바구니가 비어있습니다.', 'error');
        return;
      }

      const total = CartManager.getCartTotal();
      alert(`총 ${formatPrice(total)}의 주문이 접수되었습니다.\n\n실제 결제 기능은 구현되지 않았습니다.\n(포트폴리오 데모)`);

      // 주문 완료 후 장바구니 비우기 (선택적)
      // CartManager.clearCart();
      // renderCartPage();
    });
  }
}

/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
  initCheckout();
});
