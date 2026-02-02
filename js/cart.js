/**
 * ========================================
 * Cart Management System
 * ========================================
 * localStorage를 사용한 장바구니 데이터 관리
 */

const CART_STORAGE_KEY = 'duoback_cart';

/**
 * 장바구니 매니저
 */
const CartManager = {
  /**
   * 장바구니 데이터 가져오기
   */
  getCart() {
    try {
      const cart = localStorage.getItem(CART_STORAGE_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('장바구니 데이터 로드 실패:', error);
      return [];
    }
  },

  /**
   * 장바구니 데이터 저장
   */
  saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateCartCount();
      return true;
    } catch (error) {
      console.error('장바구니 데이터 저장 실패:', error);
      return false;
    }
  },

  /**
   * 제품을 장바구니에 추가
   */
  addToCart(product) {
    const cart = this.getCart();

    // 동일한 제품이 있는지 확인 (id와 color가 모두 같은 경우)
    const existingItemIndex = cart.findIndex(
      item => item.id === product.id && item.selectedColor === product.selectedColor
    );

    if (existingItemIndex > -1) {
      // 이미 있는 제품이면 수량만 증가
      cart[existingItemIndex].quantity += product.quantity;
    } else {
      // 새로운 제품이면 추가
      cart.push({
        ...product,
        addedAt: new Date().toISOString()
      });
    }

    return this.saveCart(cart);
  },

  /**
   * 장바구니에서 제품 삭제
   */
  removeFromCart(productId, selectedColor) {
    const cart = this.getCart();
    const filteredCart = cart.filter(
      item => !(item.id === productId && item.selectedColor === selectedColor)
    );
    return this.saveCart(filteredCart);
  },

  /**
   * 장바구니 제품 수량 업데이트
   */
  updateQuantity(productId, selectedColor, quantity) {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(
      item => item.id === productId && item.selectedColor === selectedColor
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // 수량이 0 이하면 제품 삭제
        return this.removeFromCart(productId, selectedColor);
      } else {
        cart[itemIndex].quantity = quantity;
        return this.saveCart(cart);
      }
    }

    return false;
  },

  /**
   * 장바구니 비우기
   */
  clearCart() {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      this.updateCartCount();
      return true;
    } catch (error) {
      console.error('장바구니 초기화 실패:', error);
      return false;
    }
  },

  /**
   * 장바구니 총 개수 가져오기
   */
  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * 장바구니 총 금액 계산
   */
  getCartTotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  },

  /**
   * 헤더의 장바구니 아이콘 카운트 업데이트
   */
  updateCartCount() {
    const cartBadge = document.querySelector('.cart-badge');
    const count = this.getCartCount();

    if (cartBadge) {
      if (count > 0) {
        cartBadge.textContent = count > 99 ? '99+' : count;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }
  }
};

/**
 * 장바구니 알림 UI
 */
const CartNotification = {
  /**
   * 알림 표시
   */
  show(message, type = 'success') {
    // 기존 알림 제거
    const existing = document.querySelector('.cart-notification');
    if (existing) {
      existing.remove();
    }

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification--${type}`;
    notification.innerHTML = `
      <div class="cart-notification__content">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${type === 'success' ?
            '<polyline points="20 6 9 17 4 12"></polyline>' :
            '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
          }
        </svg>
        <span>${message}</span>
      </div>
      <button class="cart-notification__close" onclick="this.parentElement.remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    document.body.appendChild(notification);

    // 애니메이션
    setTimeout(() => notification.classList.add('cart-notification--show'), 10);

    // 3초 후 자동 제거
    setTimeout(() => {
      notification.classList.remove('cart-notification--show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

/**
 * 페이지 로드 시 장바구니 카운트 업데이트
 */
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateCartCount();
});
