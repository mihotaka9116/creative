document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. タイトルの1文字ずつアニメーション ---
  const splitText = document.querySelector('.js-split-text');
  if (splitText) {
    const text = splitText.textContent.trim();
    splitText.innerHTML = ''; 
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      // CSS側で .js-split-text span { display: inline-block; opacity: 0; ... } が必要
      span.style.transitionDelay = `${i * 0.05}s`;
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      splitText.appendChild(span);
    });
    
    // 描画タイミングを少しずらして発火
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

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 3. スクロール監視 (Intersection Observer) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度出たら監視を終了する場合
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.js-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. ハンバーガーメニュー (統合版) ---
  const hamburger = document.getElementById('js-hamburger');
  const nav = document.getElementById('js-nav');

  if (hamburger && nav) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // メニュー内のリンクをクリックしたら閉じる（スムーススクロール後に邪魔にならないため）
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }
});
