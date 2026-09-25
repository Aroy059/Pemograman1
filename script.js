document.addEventListener('DOMContentLoaded', () => {

    /* ============ MOBILE NAV TOGGLE ============ */
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navLinksEl.classList.toggle('open');
    });

    navLinksEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navLinksEl.classList.remove('open');
        });
    });

    /* ============ SCROLL SPY (highlight nav aktif) ============ */
    const sections = document.querySelectorAll('main section, footer#contact');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(sec => spyObserver.observe(sec));

    /* ============ REVEAL ON SCROLL ============ */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ============ FILTER MENU ============ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            menuCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    });

    /* ============ CART ============ */
    let cart = [];

    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItemsEl = document.getElementById('cartItems');
    const cartEmptyEl = document.getElementById('cartEmpty');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');
    const cartOrderBtn = document.getElementById('cartOrderBtn');

    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    }
    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    function renderCart() {
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartItemsEl.appendChild(cartEmptyEl);
            cartEmptyEl.style.display = 'block';
        } else {
            cartEmptyEl.style.display = 'none';

            cart.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${item.name} x${item.qty}</span>
                    <span>$${item.price * item.qty}
                        <button class="cart-item-remove" data-index="${index}">✕</button>
                    </span>
                `;
                cartItemsEl.appendChild(li);
            });
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const count = cart.reduce((sum, item) => sum + item.qty, 0);

        cartTotalEl.textContent = `$${total}`;
        cartCountEl.textContent = count;
    }

    cartItemsEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove')) {
            const idx = Number(e.target.dataset.index);
            cart.splice(idx, 1);
            renderCart();
        }
    });

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price);

            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({ name, price, qty: 1 });
            }

            renderCart();

            btn.textContent = '✓ Ditambahkan';
            btn.classList.add('added');
            setTimeout(() => {
                btn.textContent = '+ Tambah';
                btn.classList.remove('added');
            }, 900);
        });
    });

    cartOrderBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong. Silakan pilih menu terlebih dahulu.');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        alert(`Terima kasih! Pesanan Anda (total $${total}) telah dicatat. Tim kami akan segera menghubungi Anda.`);
        cart = [];
        renderCart();
        closeCart();
    });

    renderCart();

    /* ============ ANIMATED COUNTER (About) ============ */
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = Number(el.dataset.count);
                let current = 0;
                const step = Math.max(1, Math.ceil(target / 40));

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current;
                }, 30);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    /* ============ BACK TO TOP ============ */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 400);

        const navbar = document.getElementById('navbar');
        navbar.style.boxShadow = window.scrollY > 10
            ? '0 4px 15px rgba(0,0,0,0.12)'
            : '0 2px 10px rgba(0,0,0,0.08)';
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============ CONTACT FORM ============ */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
    });

});
