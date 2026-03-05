document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. タイトルの1文字ずつアニメーション ---
  const splitText = document.querySelector('.js-split-text');
  if (splitText) {
    const text = splitText.textContent.trim();
    splitText.innerHTML = ''; 
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.style.transitionDelay = `${i * 0.05}s`;
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      splitText.appendChild(span);
    });
    requestAnimationFrame(() => {
      setTimeout(() => {
        splitText.classList.add('is-visible');
      }, 500);
    });
  }

  // --- 2. スムーススクロール ---
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  scrollLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- 3. スクロール監視 (Intersection Observer) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.js-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. ハンバーガーメニュー ---
  const hamburger = document.getElementById('js-hamburger');
  const nav = document.getElementById('js-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // --- 5. カート機能 (名前を "miho_cart_data" に完全統一) ---
  const cartButtons = document.querySelectorAll('.add-to-cart-btn');
  const cartCountElement = document.getElementById('cart-count');

  function updateCartBadge() {
    if (!cartCountElement) return;
    const cart = JSON.parse(localStorage.getItem('miho_cart_data')) || [];
    cartCountElement.textContent = cart.length;
    cartCountElement.style.display = cart.length > 0 ? 'flex' : 'none';
  }

  updateCartBadge();

  cartButtons.forEach(button => {
    button.addEventListener('click', () => {
      let cart = JSON.parse(localStorage.getItem('miho_cart_data')) || [];
      
      const product = {
        name: button.getAttribute('data-name'),
        price: parseInt(button.getAttribute('data-price')),
        image: button.getAttribute('data-image'), // ★ここを追加しました！
        id: Date.now()
      };

      cart.push(product);
      localStorage.setItem('miho_cart_data', JSON.stringify(cart));
      updateCartBadge();

      const originalText = button.innerText;
      button.innerText = "追加しました！";
      button.style.backgroundColor = "#28a745"; 
      
      setTimeout(() => {
        button.innerText = originalText;
        button.style.backgroundColor = ""; 
      }, 1000);
    });
  });
});
