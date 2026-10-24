/**
 * Nar Café - Interactive Logic Script
 * Project: Nar Café Portfolio Demo
 * Features: Mobile Nav, Category Filter, Search, WhatsApp Order Builder, Lightbox, Multilingual
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Translation Dictionary (AZ / EN)
    // --------------------------------------------------------------------------
    const translations = {
        az: {
            heroTitle: "Hər fincanda bir az rahatlıq.",
            heroDesc: "Bakının mərkəzində təzə qovrulmuş qəhvə dənlərinin ətri, ev sayağı səhər yeməkləri və səmimi atmosfer. Gününüzə şirin və enerjili bir fasilə verin.",
            menuBtn: "Menyuya bax",
            findUsBtn: "Bizi tapın",
            featuredTitle: "Önə Çıxan Ləzzətlər",
            menuTitle: "Bizim Menyu",
            searchPlaceholder: "Menyuda yemek va ya içki axtarın...",
            cartEmpty: "Səbətiniz hal-hazırda boşdur. Menyudan istədiyiniz təamı əlavə edin.",
            sendOrder: "WhatsApp ilə Sifarişi Göndər",
            totalLabel: "Cəmi məbləğ:"
        },
        en: {
            heroTitle: "A touch of comfort in every cup.",
            heroDesc: "The aroma of freshly roasted coffee beans, homemade breakfasts, and a warm atmosphere in the heart of Baku. Give your day a sweet break.",
            menuBtn: "View Menu",
            findUsBtn: "Find Us",
            featuredTitle: "Featured Flavors",
            menuTitle: "Our Menu",
            searchPlaceholder: "Search food or drink in menu...",
            cartEmpty: "Your cart is currently empty. Add your favorite dish from the menu.",
            sendOrder: "Send Order via WhatsApp",
            totalLabel: "Total Price:"
        }
    };

    // --------------------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const primaryNav = document.getElementById('primaryNav');

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('is-open');
        });

        // Close nav when clicking a link
        primaryNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('is-open');
            });
        });
    }

    // --------------------------------------------------------------------------
    // 3. Menu Filtering & Search Logic
    // --------------------------------------------------------------------------
    const categoryFilters = document.getElementById('categoryFilters');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const menuCards = document.querySelectorAll('.menu-card');
    const searchEmptyState = document.getElementById('searchEmptyState');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    function filterMenu() {
        let visibleCount = 0;

        menuCards.forEach(card => {
            const category = card.dataset.category;
            const name = (card.dataset.name || '').toLowerCase();
            const description = card.querySelector('.dish-description')?.textContent.toLowerCase() || '';

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = name.includes(currentSearchTerm) || description.includes(currentSearchTerm);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (searchEmptyState) {
            if (visibleCount === 0) {
                searchEmptyState.classList.remove('hidden');
            } else {
                searchEmptyState.classList.add('hidden');
            }
        }
    }

    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            categoryFilters.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            currentCategory = btn.dataset.category;
            filterMenu();
        });
    }

    if (menuSearchInput) {
        menuSearchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            filterMenu();
        });
    }

    // --------------------------------------------------------------------------
    // 4. Cart & WhatsApp Order Builder
    // --------------------------------------------------------------------------
    const cart = {};
    const orderItemsList = document.getElementById('orderItemsList');
    const orderEmptyState = document.getElementById('orderEmptyState');
    const orderTotalPrice = document.getElementById('orderTotalPrice');
    const sendWhatsappOrderBtn = document.getElementById('sendWhatsappOrderBtn');

    function updateCartUI() {
        const itemIds = Object.keys(cart);

        if (itemIds.length === 0) {
            orderEmptyState.classList.remove('hidden');
            orderItemsList.classList.add('hidden');
            sendWhatsappOrderBtn.disabled = true;
            orderTotalPrice.textContent = '0.00 AZN';
            return;
        }

        orderEmptyState.classList.add('hidden');
        orderItemsList.classList.remove('hidden');
        sendWhatsappOrderBtn.disabled = false;

        orderItemsList.innerHTML = '';
        let total = 0;

        itemIds.forEach(id => {
            const item = cart[id];
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const li = document.createElement('li');
            li.className = 'order-item-row';
            li.innerHTML = `
                <div>
                    <div class="order-item-title">${item.name}</div>
                    <div class="order-item-price">${item.price.toFixed(2)} AZN × ${item.qty} = ${itemTotal.toFixed(2)} AZN</div>
                </div>
                <div class="order-qty-controls">
                    <button type="button" class="qty-btn dec-btn" data-id="${id}">-</button>
                    <span>${item.qty}</span>
                    <button type="button" class="qty-btn inc-btn" data-id="${id}">+</button>
                </div>
            `;
            orderItemsList.appendChild(li);
        });

        orderTotalPrice.textContent = `${total.toFixed(2)} AZN`;
    }

    document.addEventListener('click', (e) => {
        // Add to Cart
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
            const id = addBtn.dataset.id;
            const name = addBtn.dataset.name;
            const price = parseFloat(addBtn.dataset.price);

            if (cart[id]) {
                cart[id].qty++;
            } else {
                cart[id] = { name, price, qty: 1 };
            }

            updateCartUI();
        }

        // Increase Qty
        const incBtn = e.target.closest('.inc-btn');
        if (incBtn) {
            const id = incBtn.dataset.id;
            if (cart[id]) {
                cart[id].qty++;
                updateCartUI();
            }
        }

        // Decrease Qty
        const decBtn = e.target.closest('.dec-btn');
        if (decBtn) {
            const id = decBtn.dataset.id;
            if (cart[id]) {
                cart[id].qty--;
                if (cart[id].qty <= 0) {
                    delete cart[id];
                }
                updateCartUI();
            }
        }
    });

    // Send Order via WhatsApp
    if (sendWhatsappOrderBtn) {
        sendWhatsappOrderBtn.addEventListener('click', () => {
            const itemIds = Object.keys(cart);
            if (itemIds.length === 0) return;

            let message = "Salam, Nar Café! Yeni sifarişim var:\n\n";
            let grandTotal = 0;

            itemIds.forEach((id, index) => {
                const item = cart[id];
                const sum = item.price * item.qty;
                grandTotal += sum;
                message += `${index + 1}. ${item.name} - ${item.qty} ədəd (${sum.toFixed(2)} AZN)\n`;
            });

            message += `\nCəmi məbləğ: ${grandTotal.toFixed(2)} AZN\nÜnvanı və çatdırılma vaxtını təsdiqləmək üçün zəhmət olmasa yazın.`;

            const encodedMsg = encodeURIComponent(message);
            const phoneNumber = "994500000000"; // Placeholder demo number
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, '_blank');
        });
    }

    // --------------------------------------------------------------------------
    // 5. Gallery Lightbox Modal
    // --------------------------------------------------------------------------
    const galleryGrid = document.getElementById('galleryGrid');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (galleryGrid && lightboxModal) {
        galleryGrid.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            e.preventDefault();
            const imgSrc = item.getAttribute('href');
            const title = item.dataset.title || '';

            lightboxImage.setAttribute('src', imgSrc);
            lightboxCaption.textContent = title;
            lightboxModal.classList.remove('hidden');
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightboxModal.classList.add('hidden');
            });
        }

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.add('hidden');
            }
        });
    }

    // --------------------------------------------------------------------------
    // 6. Language Switcher (AZ / EN)
    // --------------------------------------------------------------------------
    const langSwitcher = document.getElementById('langSwitcher');

    if (langSwitcher) {
        langSwitcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (!btn) return;

            langSwitcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const lang = btn.dataset.lang;
            if (translations[lang]) {
                const dict = translations[lang];

                const heroTitle = document.getElementById('hero-title');
                if (heroTitle) heroTitle.textContent = dict.heroTitle;

                const heroDesc = document.querySelector('.hero-description');
                if (heroDesc) heroDesc.textContent = dict.heroDesc;

                const featuredTitle = document.getElementById('featured-title');
                if (featuredTitle) featuredTitle.textContent = dict.featuredTitle;

                const menuTitle = document.getElementById('menu-title');
                if (menuTitle) menuTitle.textContent = dict.menuTitle;

                if (menuSearchInput) menuSearchInput.placeholder = dict.searchPlaceholder;
                if (orderEmptyState) orderEmptyState.querySelector('p').textContent = dict.cartEmpty;
            }
        });
    }
});