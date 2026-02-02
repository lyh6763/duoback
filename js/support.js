/**
 * ========================================
 * Support Page Functions
 * ========================================
 */

/**
 * FAQ 아코디언 기능
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    question.addEventListener('click', () => {
      // 현재 아이템이 열려있는지 확인
      const isOpen = item.classList.contains('is-open');

      // 다른 모든 FAQ 아이템 닫기
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          const otherQuestion = otherItem.querySelector('.faq-item__question');
          const otherAnswer = otherItem.querySelector('.faq-item__answer');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
        }
      });

      // 현재 아이템 토글
      if (isOpen) {
        item.classList.remove('is-open');
        question.setAttribute('aria-expanded', 'false');
        if (answer) answer.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
        if (answer) answer.setAttribute('aria-hidden', 'false');
      }
    });
  });
}


/**
 * FAQ 카테고리 필터링
 */
function initFAQFilter() {
  const categoryButtons = document.querySelectorAll('.faq-category-btn');
  const faqItems = document.querySelectorAll('.faq-item');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      // 활성 버튼 업데이트
      categoryButtons.forEach(btn => btn.classList.remove('faq-category-btn--active'));
      button.classList.add('faq-category-btn--active');

      // FAQ 아이템 필터링
      faqItems.forEach(item => {
        const itemCategory = item.dataset.category;

        if (category === 'all' || itemCategory === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
          item.classList.remove('is-open'); // 닫힌 상태로 만들기
        }
      });
    });
  });
}


/**
 * A/S 신청 폼 유효성 검사
 */
function initASForm() {
  const form = document.getElementById('asForm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 폼 데이터 수집
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // 전화번호 유효성 검사
    const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phonePattern.test(data.phone)) {
      alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
      document.getElementById('asPhone').focus();
      return;
    }

    // 이메일 유효성 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      alert('올바른 이메일 주소를 입력해주세요.');
      document.getElementById('asEmail').focus();
      return;
    }

    // 구매일 검사 (미래 날짜 불가)
    const purchaseDate = new Date(data.purchaseDate);
    const today = new Date();
    if (purchaseDate > today) {
      alert('구매일은 오늘 이전이어야 합니다.');
      document.getElementById('asPurchaseDate').focus();
      return;
    }

    // 성공 메시지
    alert(`A/S 신청이 접수되었습니다.\n\n접수 내용:\n- 제품: ${data.product}\n- 연락처: ${data.phone}\n\n빠른 시일 내에 연락드리겠습니다.\n\n(실제 A/S 접수 기능은 구현되지 않았습니다 - 포트폴리오 데모)`);

    // 폼 초기화
    form.reset();
  });
}


/**
 * 1:1 문의 폼 유효성 검사
 */
function initContactForm() {
  const form = document.getElementById('contactForm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 폼 데이터 수집
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // 개인정보 동의 확인
    const privacyAgree = document.getElementById('privacyAgree').checked;
    if (!privacyAgree) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }

    // 전화번호 유효성 검사
    const phonePattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!phonePattern.test(data.phone)) {
      alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
      document.getElementById('contactPhone').focus();
      return;
    }

    // 이메일 유효성 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      alert('올바른 이메일 주소를 입력해주세요.');
      document.getElementById('contactEmail').focus();
      return;
    }

    // 문의 내용 최소 길이 검사
    if (data.message.length < 10) {
      alert('문의 내용을 10자 이상 입력해주세요.');
      document.getElementById('contactMessage').focus();
      return;
    }

    // 성공 메시지
    alert(`문의가 접수되었습니다.\n\n접수 내용:\n- 문의 유형: ${getSubjectLabel(data.subject)}\n- 이메일: ${data.email}\n\n영업일 기준 1-2일 내에 답변드리겠습니다.\n\n(실제 문의 접수 기능은 구현되지 않았습니다 - 포트폴리오 데모)`);

    // 폼 초기화
    form.reset();
  });
}


/**
 * 문의 유형 레이블 가져오기
 */
function getSubjectLabel(value) {
  const labels = {
    'product': '제품 문의',
    'delivery': '배송 문의',
    'as': 'A/S 문의',
    'payment': '결제/환불 문의',
    'etc': '기타'
  };
  return labels[value] || value;
}


/**
 * ========================================
 * Initialize
 * ========================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  initFAQFilter();
  initASForm();
  initContactForm();
});
