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

document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');

    // ブラウザの保存領域からカートの中身を読み込む
    let cart = JSON.parse(localStorage.getItem('myCart')) || [];

    // ページを開いた瞬間に数字を更新
    const updateBadge = () => {
        const totalItems = cart.length;
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    };

    updateBadge();

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                name: button.dataset.name,
                price: button.dataset.price,
                id: Date.now() // 簡易的な個別ID
            };

            // 配列に追加
            cart.push(product);
            // 保存
            localStorage.setItem('myCart', JSON.stringify(cart));
            // 数字を更新
            updateBadge();

            // 小さな通知（お好みで）
            button.innerText = "追加しました！";
            button.style.backgroundColor = "#28a745"; // 一時的に緑色に
            
            setTimeout(() => {
                button.innerText = "カートに入れる";
                button.style.backgroundColor = ""; // 元の色に戻す
            }, 2000);
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // 1. カートへの追加処理
    // -----------------------------------------
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountElement = document.getElementById('cart-count');

    // ページ読み込み時にバッジの数字を更新
    updateCartCount();

    cartButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ローカルストレージから既存のカートを取得（名前を "miho_cart_data" で統一）
            let cart = JSON.parse(localStorage.getItem('miho_cart_data')) || [];

            // ボタンのdata属性から商品情報を取得
            const product = {
                name: button.getAttribute('data-name'),
                price: parseInt(button.getAttribute('data-price')),
                id: Date.now() // 削除時に識別するためのID
            };

            // 配列に追加して保存
            cart.push(product);
            localStorage.setItem('miho_cart_data', JSON.stringify(cart));

            // バッジの数字を更新
            updateCartCount();

            // ボタンのアニメーション演出
            const originalText = button.innerText;
            button.innerText = "追加しました！";
            button.classList.add('added'); // 必要ならCSSで色を変える用
            
            setTimeout(() => {
                button.innerText = originalText;
                button.classList.remove('added');
            }, 1000);
        });
    });

    // カートの個数をバッジに反映させる関数
    function updateCartCount() {
        if (!cartCountElement) return;
        const cart = JSON.parse(localStorage.getItem('miho_cart_data')) || [];
        cartCountElement.textContent = cart.length
