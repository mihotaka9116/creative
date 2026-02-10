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
    
    setTimeout(() => {
      splitText.classList.add('is-visible');
    }, 500);
  }

  // --- 2. スムーススクロール ---
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = href === "#" ? document.documentElement : document.querySelector(href);
      
      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 3. スクロール監視 (ふわっと出す) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.js-reveal').forEach(el => {
    revealObserver.observe(el);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('js-hamburger');
  const nav = document.getElementById('js-nav');

  // ハンバーガーをクリックした時の処理
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active'); // 三本線を×にする
    nav.classList.toggle('active');       // メニューを出す
  });

  // メニュー内のリンクをクリックしたらメニューを閉じる処理
  const navLinks = document.querySelectorAll('#js-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });
});
