/**
 * The Coastal Tawa - Global Cart Controller & Drawer UI Injector
 * Features:
 * - Persistent cart state in localStorage
 * - Seamless synchronization of header badges across all pages
 * - Dynamic drawer injection with high-end glassmorphic styles
 * - Interactive promo code system (TAWA20, ROYAL15)
 * - Nested, smooth multi-step checkout form flow
 * - Interactive spark/shimmer particle feedback
 */

// Initialize Cart State
let tawaCart = JSON.parse(localStorage.getItem('tawaCart')) || [];
let activePromo = JSON.parse(localStorage.getItem('tawaPromo')) || null;

// CSS Styles Injection
const cartStyles = `
/* Cart Overlay and Drawer */
#tawa-cart-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background-color: rgba(31, 5, 7, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
#tawa-cart-overlay.open {
    opacity: 1;
    pointer-events: auto;
}
#tawa-cart-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 500px;
    z-index: 101;
    background: linear-gradient(135deg, rgba(43, 14, 17, 0.98) 0%, rgba(31, 5, 7, 0.99) 100%);
    border-left: 1px solid rgba(212, 175, 55, 0.25);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.8);
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
}
#tawa-cart-overlay.open #tawa-cart-drawer {
    transform: translateX(0);
}

/* Glass Card & Scrollbar */
.cart-glass-card {
    background: rgba(43, 14, 17, 0.45);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(212, 175, 55, 0.15);
    border-radius: 16px;
    transition: all 0.3s ease;
}
.cart-glass-card:hover {
    border-color: rgba(212, 175, 55, 0.35);
    background: rgba(43, 14, 17, 0.6);
}
.cart-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.cart-scrollbar::-webkit-scrollbar-track {
    background: rgba(31, 5, 7, 0.3);
}
.cart-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(212, 175, 55, 0.3);
    border-radius: 9999px;
}
.cart-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(212, 175, 55, 0.6);
}

/* Micro-Animations & Buttons */
.gold-glow-hover:hover {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
    transform: scale(1.02);
}
.btn-shimmer-gold {
    position: relative;
    overflow: hidden;
}
.btn-shimmer-gold::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 25%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.25),
        transparent
    );
    transform: rotate(30deg);
    transition: all 0.6s ease;
}
.btn-shimmer-gold:hover::after {
    left: 140%;
    transition: left 0.8s ease-in-out;
}
@keyframes successScale {
    0% { transform: scale(0.6); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
}
.animate-success {
    animation: successScale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* Toast Message */
#tawa-toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translate(-50%, 40px);
    z-index: 102;
    background: #D4AF37;
    color: #1F0507;
    border-radius: 9999px;
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
#tawa-toast.visible {
    transform: translate(-50%, 0);
    opacity: 1;
}

/* Particle Spark Effect */
.sparkle-particle {
    position: fixed;
    width: 6px;
    height: 6px;
    background: #D4AF37;
    border-radius: 50%;
    pointer-events: none;
    z-index: 105;
    animation: sparkleFade 0.8s ease-out forwards;
}
@keyframes sparkleFade {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
}

/* --- PRESERVE BRANDING & OVERRIDE TYPOGRAPHY GOLD TO ROYAL WHITE --- */
*:not(.material-symbols-outlined):not(a):not(button).text-primary,
*:not(.material-symbols-outlined):not(a):not(button).text-royal-gold,
*:not(.material-symbols-outlined):not(a):not(button).text-text-gold-subtle {
    color: #F8F8F8 !important;
}

/* --- INTERACTIVE TEXT COLOR STATES --- */
.interactive-text {
    color: #F8F8F8 !important;
    transition: color 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.interactive-text:hover {
    color: #D4AF37 !important;
}
.interactive-text:active {
    color: #C9A227 !important;
}
.interactive-text.selected {
    color: #D4AF37 !important;
}

/* Intro Video Overlay Styles */
#tawa-video-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background-color: #1F0507; /* Matches deep maroon background */
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
}
#tawa-video-overlay.active {
    opacity: 1;
    pointer-events: auto;
}
#tawa-video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    user-select: none;
    pointer-events: none;
}
.tawa-video-ctrl {
    position: absolute;
    z-index: 100000;
    background: rgba(43, 14, 17, 0.65);
    border: 1px solid rgba(212, 175, 55, 0.25);
    color: #F2E8DF;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    cursor: pointer;
}
.tawa-video-ctrl:hover {
    border-color: #D4AF37;
    background: #D4AF37;
    color: #1F0507;
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(212, 175, 55, 0.3);
}
.tawa-video-ctrl:active {
    transform: translateY(0);
}
#tawa-video-skip {
    top: 32px;
    right: 32px;
    padding: 12px 24px;
    border-radius: 9999px;
    font-family: 'Manrope', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
}
#tawa-video-volume {
    top: 32px;
    right: 170px; /* Positioned next to Skip button */
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    #tawa-video-skip {
        top: 20px;
        right: 20px;
        padding: 10px 18px;
    }
    #tawa-video-volume {
        top: 20px;
        right: 130px;
        width: 40px;
        height: 40px;
    }
}

/* Custom Cursor styles */
@media (min-width: 1024px) and (pointer: fine) {
    html, body, a, button, [role="button"], select, input, textarea, label {
        cursor: none !important;
    }
    
    #custom-cursor-fork, #custom-cursor-plate {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 999999;
        will-change: transform;
        display: block;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    #custom-cursor-fork {
        width: 24px;
        height: 48px;
        transform-origin: 50% 0%; /* Scale relative to tip of the fork */
    }
    
    #custom-cursor-plate {
        width: 32px;
        height: 32px;
        transform-origin: center;
    }
    
    #custom-cursor-fork img, #custom-cursor-plate img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

@media (max-width: 1023px), (pointer: coarse) {
    #custom-cursor-fork, #custom-cursor-plate {
        display: none !important;
    }
}
`;

// Inject Markup and Styles once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Inject Custom Styles
    const styleEl = document.createElement('style');
    styleEl.textContent = cartStyles;
    document.head.appendChild(styleEl);

    // Inject Drawer Markup
    const drawerHTML = `
    <div id="tawa-cart-overlay" onclick="closeCart(event)">
        <div id="tawa-cart-drawer" onclick="event.stopPropagation()">
            <!-- Drawer Header -->
            <div class="px-6 py-6 border-b border-primary/20 flex justify-between items-center bg-surface-container-lowest">
                <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-primary text-[28px]">shopping_bag</span>
                    <div>
                        <h2 class="font-headline-sm text-[20px] text-white-pure uppercase tracking-widest leading-none">Dining Tray</h2>
                        <span class="text-[10px] text-primary uppercase tracking-widest font-bold">Cuisine Selection</span>
                    </div>
                </div>
                <button class="material-symbols-outlined text-primary hover:text-white-pure hover:rotate-90 transition-all p-2 rounded-full" onclick="toggleCart()">close</button>
            </div>

            <!-- Drawer Container (Scrollable) -->
            <div id="cart-content-wrapper" class="flex-1 overflow-y-auto cart-scrollbar px-6 py-6 flex flex-col gap-6">
                <!-- Cart Items List (Injected Dynamically) -->
                <div id="cart-items-container" class="flex flex-col gap-4"></div>

                <!-- Empty State -->
                <div id="cart-empty-state" class="hidden flex-col items-center justify-center text-center py-20" style="gap: 20px;">
                    <span class="material-symbols-outlined text-primary/30 text-[72px]" style="margin-bottom: 8px; display: block;">restaurant</span>
                    <div style="padding: 0 16px;">
                        <h4 class="font-headline-sm text-white-pure" style="line-height: 1.4; display: block; font-size: 20px; letter-spacing: 0.05em;">Your Dining Tray is Empty</h4>
                        <p class="text-[13px] text-on-surface-variant max-w-[320px] mx-auto" style="line-height: 1.8; display: block; margin-top: 12px; opacity: 0.85;">Indulge in our exquisite selection of coastal Malvani curries and Awadhi specialty delights.</p>
                    </div>
                    <a href="menu.html" class="px-8 py-3.5 bg-primary text-on-primary font-label-caps text-[10px] tracking-widest uppercase rounded-full gold-glow-hover transition-all font-bold" style="display: inline-block; margin-top: 16px;" onclick="toggleCart()">Explore Menu</a>
                </div>
            </div>

            <!-- Drawer Footer (Sticky Summary & Actions) -->
            <div id="cart-summary-section" class="border-t border-primary/20 p-6 bg-surface-container-lowest flex flex-col gap-4">
                <!-- Promo Code -->
                <div class="flex gap-2">
                    <input type="text" id="promo-input" placeholder="Promo Code" class="flex-1 bg-background/50 border border-primary/20 focus:border-primary rounded-full px-5 py-3 text-sm text-white-pure placeholder:text-on-surface/30">
                    <button onclick="applyPromoCode()" class="px-6 py-3 bg-surface border border-primary/30 interactive-text hover:bg-primary hover:text-on-primary rounded-full font-label-caps text-[9px] tracking-widest uppercase transition-all font-bold">Apply</button>
                </div>
                <div id="promo-status-msg" class="text-[11px] font-bold px-2 hidden"></div>

                <!-- Order Calculations -->
                <div class="flex flex-col gap-2 border-b border-primary/10 pb-4">
                    <div class="flex justify-between text-sm text-on-surface-variant">
                        <span>Subtotal</span>
                        <span id="cart-subtotal">₹0</span>
                    </div>
                    <div id="promo-row" class="hidden justify-between text-sm text-secondary">
                        <span id="promo-label">Promo Discount (15%)</span>
                        <span id="promo-discount">-₹0</span>
                    </div>
                    <div class="flex justify-between text-sm text-on-surface-variant">
                        <span>Service Charge (5%)</span>
                        <span id="cart-service-charge">₹0</span>
                    </div>
                    <div class="flex justify-between text-sm text-on-surface-variant">
                        <span>GST (18%)</span>
                        <span id="cart-gst">₹0</span>
                    </div>
                </div>

                <!-- Grand Total -->
                <div class="flex justify-between items-baseline mb-2">
                    <span class="font-label-caps text-[12px] tracking-widest uppercase text-white-pure">Grand Sum</span>
                    <span id="cart-grand-total" class="font-headline-sm text-[26px] text-primary">₹0</span>
                </div>

                <!-- Primary Action Buttons -->
                <div class="grid grid-cols-2 gap-3 mt-1">
                    <button onclick="clearCart()" class="w-full py-4 border border-primary/20 text-on-surface hover:border-red-400 hover:text-red-400 rounded-full font-label-caps text-[9px] tracking-widest uppercase transition-all">Clear Tray</button>
                    <button onclick="showCheckoutForm()" class="w-full py-4 bg-primary text-on-primary rounded-full font-label-caps text-[9px] tracking-widest uppercase transition-all font-bold gold-glow-hover btn-shimmer-gold">Checkout</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Persistent Global Toast Container -->
    <div id="tawa-toast" class="px-8 py-4 flex items-center gap-3">
        <span class="material-symbols-outlined text-[20px]">check_circle</span>
        <span class="font-label-caps text-[11px] tracking-[0.2em] font-bold" id="tawa-toast-text">ITEM ADDED TO CART</span>
    </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(drawerHTML);
    document.body.appendChild(fragment);

    // Initial Badge Render and Sync
    updateBadges();

    // Hook Close Event when pressing Escape key
    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            const overlay = document.getElementById('tawa-cart-overlay');
            if(overlay.classList.contains('open')) {
                toggleCart();
            }
        }
    });

    // Initialize Intro Video Overlay after cart elements are active
    initTawaVideoOverlay();

    // Initialize custom mouse cursor experience (Fork & Plate follower)
    initCustomCursor();
});

// Update Header Cart Badges & Persistent Totals
function updateBadges() {
    const totalCount = tawaCart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Select all potential cart badge counts in headers or floating widgets
    const badges = document.querySelectorAll('#cart-count, #floating-cart-count, [id*="cart-badge"], .cart-count');
    badges.forEach(badge => {
        badge.innerText = totalCount;
        
        // Bounce animation
        badge.classList.remove('scale-125');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 300);
    });

    // Update Floating widget totals if on page (e.g. Menu Page)
    const floatTotal = document.getElementById('floating-cart-total');
    if (floatTotal) {
        const subtotal = tawaCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        floatTotal.innerText = `₹${subtotal}`;
    }

    const floatingWidget = document.getElementById('floating-cart');
    if (floatingWidget) {
        if (totalCount > 0) {
            floatingWidget.classList.remove('scale-0');
            floatingWidget.classList.add('scale-100');
        } else {
            floatingWidget.classList.add('scale-0');
            floatingWidget.classList.remove('scale-100');
        }
    }
}

// Toggle drawer visible state
function toggleCart() {
    const overlay = document.getElementById('tawa-cart-overlay');
    overlay.classList.toggle('open');
    if(overlay.classList.contains('open')) {
        renderCartItems();
    }
}

// Explicit close click on backdrop
function closeCart(e) {
    if(e.target.id === 'tawa-cart-overlay') {
        toggleCart();
    }
}

// Render dynamic cart item markup
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const summarySection = document.getElementById('cart-summary-section');
    
    if (tawaCart.length === 0) {
        container.innerHTML = "";
        emptyState.classList.remove('hidden');
        summarySection.style.display = 'none';
        return;
    }

    emptyState.classList.add('hidden');
    summarySection.style.display = 'flex';
    
    container.innerHTML = tawaCart.map(item => {
        // Generate placeholder or default fallback image
        const imgUrl = item.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCYojtpFw4PrvRrsNXvUR74ARJreKVzZx8C4URC3V7jOj_FvEk0K_QThmX516TOabq1No0f3McmR3Ax37zYvz0o5t8kKfcDzwIfsic8XOc9om3Kgs9DkMxd1HR_tU5RqYxTM15r7ROmaFZ_qYaMjZh_kwJHYfWF3K3NGLVXaYMcF0gaR51B3po7GZSlW0tFYLbPV4FEMhnEVr2TOf_QbPKA6KrPrICX6o2Q6Us8o_84cLxx5yr0QubtBoPcFXN_9ZfAvjikBO1ecrxI";
        return `
        <div class="cart-glass-card p-4 flex gap-4 items-center relative overflow-hidden animate-[pageFadeIn_0.3s_ease-out_forwards]">
            <img src="${imgUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-primary/20">
            <div class="flex-1 min-w-0">
                <h4 class="font-headline-sm text-[16px] text-white-pure italic truncate pr-4">${item.name}</h4>
                <div class="flex justify-between items-baseline mt-1">
                    <span class="text-primary font-bold text-sm">₹${item.price}</span>
                    <span class="text-[11px] text-on-surface-variant font-bold">Sum: ₹${item.price * item.quantity}</span>
                </div>
                <!-- Quantity & Actions Control -->
                <div class="flex justify-between items-center mt-3">
                    <div class="flex items-center bg-background/80 rounded-full p-0.5 border border-primary/10">
                        <button class="w-6 h-6 rounded-full flex items-center justify-center interactive-text hover:bg-primary/10 active:scale-90 transition-all font-bold text-xs" onclick="adjustItemQty('${item.name}', -1)">-</button>
                        <span class="font-bold text-xs min-w-[1.25rem] text-center text-white-pure">${item.quantity}</span>
                        <button class="w-6 h-6 rounded-full flex items-center justify-center interactive-text hover:bg-primary/10 active:scale-90 transition-all font-bold text-xs" onclick="adjustItemQty('${item.name}', 1)">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.name}')" class="text-on-surface-variant hover:text-red-400 transition-colors p-1 flex items-center justify-center rounded-full">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join("");

    calculateTotals();
}

// Add Item from external triggers (e.g. Menu Page)
function addToTawaCart(name, price, img = null, quantity = null) {
    // Find quantity from context if it exists (for menu items that have quantity selector counters)
    // Find closest menu item quantity selector
    let finalQuantity = 1;
    if (quantity !== null) {
        finalQuantity = quantity;
    } else {
        const itemsOnPage = Array.from(document.querySelectorAll('.menu-item, .glass-card'));
        const itemContext = itemsOnPage.find(el => {
            const nameAttr = el.getAttribute('data-name');
            const hasQty = el.querySelector('.qty');
            return nameAttr && nameAttr.toLowerCase() === name.toLowerCase() && hasQty;
        }) || itemsOnPage.find(el => {
            const nameAttr = el.getAttribute('data-name');
            return nameAttr && nameAttr.toLowerCase() === name.toLowerCase();
        });
        
        if (itemContext) {
            const qtyEl = itemContext.querySelector('.qty');
            if (qtyEl) {
                finalQuantity = parseInt(qtyEl.innerText) || 1;
                qtyEl.innerText = "1"; // Reset local page selector back to 1
            }
        }
    }

    const existingIndex = tawaCart.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    
    if(existingIndex > -1) {
        tawaCart[existingIndex].quantity += finalQuantity;
    } else {
        tawaCart.push({
            name: name,
            price: price,
            image: img,
            quantity: finalQuantity
        });
    }

    // Save and Sync
    localStorage.setItem('tawaCart', JSON.stringify(tawaCart));
    updateBadges();
    showTawaToast(`${finalQuantity}x ${name.toUpperCase()} ADDED`);
    
    // Particle/Spark feedback effect on target button
    triggerButtonSparks();
}

// Quantity Adjustments from Cart Drawer
function adjustItemQty(name, delta) {
    const itemIndex = tawaCart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
        tawaCart[itemIndex].quantity += delta;
        if(tawaCart[itemIndex].quantity <= 0) {
            tawaCart.splice(itemIndex, 1);
        }
        localStorage.setItem('tawaCart', JSON.stringify(tawaCart));
        updateBadges();
        renderCartItems();
    }
}

// Remove completely from Cart Drawer
function removeFromCart(name) {
    tawaCart = tawaCart.filter(item => item.name !== name);
    localStorage.setItem('tawaCart', JSON.stringify(tawaCart));
    updateBadges();
    renderCartItems();
    showTawaToast("ITEM REMOVED");
}

// Clear Entire Cart
function clearCart() {
    tawaCart = [];
    activePromo = null;
    localStorage.removeItem('tawaCart');
    localStorage.removeItem('tawaPromo');
    updateBadges();
    renderCartItems();
    showTawaToast("CART CLEARED");
}

// Calculations and Promo Codes
function calculateTotals() {
    const subtotal = tawaCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    const promoRow = document.getElementById('promo-row');
    const promoDiscountEl = document.getElementById('promo-discount');
    const promoLabelEl = document.getElementById('promo-label');

    if (activePromo) {
        discount = Math.round(subtotal * activePromo.value);
        promoLabelEl.innerText = `Promo Discount (${activePromo.code} - ${activePromo.value * 100}%)`;
        promoDiscountEl.innerText = `-₹${discount}`;
        promoRow.classList.remove('hidden');
        promoRow.classList.add('flex');
    } else {
        promoRow.style.display = 'none';
        promoRow.classList.remove('flex');
    }

    const serviceCharge = Math.round((subtotal - discount) * 0.05);
    const gst = Math.round((subtotal - discount) * 0.18);
    const grandTotal = Math.max(0, subtotal - discount + serviceCharge + gst);

    document.getElementById('cart-subtotal').innerText = `₹${subtotal}`;
    document.getElementById('cart-service-charge').innerText = `₹${serviceCharge}`;
    document.getElementById('cart-gst').innerText = `₹${gst}`;
    document.getElementById('cart-grand-total').innerText = `₹${grandTotal}`;
}

// Promo Code Validations
function applyPromoCode() {
    const input = document.getElementById('promo-input');
    const code = input.value.trim().toUpperCase();
    const statusMsg = document.getElementById('promo-status-msg');

    statusMsg.classList.remove('hidden', 'text-secondary', 'text-red-400');

    if (!code) {
        statusMsg.innerText = "Please input a coupon code.";
        statusMsg.classList.add('text-red-400');
        statusMsg.classList.remove('hidden');
        return;
    }

    if(code === 'TAWA20') {
        activePromo = { code: 'TAWA20', value: 0.20 };
        statusMsg.innerText = "Special 20% discount coupon applied successfully!";
        statusMsg.classList.add('text-secondary');
        statusMsg.classList.remove('hidden');
    } else if(code === 'ROYAL15') {
        activePromo = { code: 'ROYAL15', value: 0.15 };
        statusMsg.innerText = "Special 15% discount coupon applied successfully!";
        statusMsg.classList.add('text-secondary');
        statusMsg.classList.remove('hidden');
    } else {
        statusMsg.innerText = "Invalid coupon code.";
        statusMsg.classList.add('text-red-400');
        statusMsg.classList.remove('hidden');
        activePromo = null;
    }

    localStorage.setItem('tawaPromo', JSON.stringify(activePromo));
    input.value = "";
    calculateTotals();
}

// Success Toast trigger helper
function showTawaToast(text) {
    const toast = document.getElementById('tawa-toast');
    const toastText = document.getElementById('tawa-toast-text');
    
    toastText.innerText = text;
    toast.classList.remove('visible');
    void toast.offsetWidth; // trigger reflow
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// Particle/Spark generator for checkout/add-to-cart clicks
function triggerButtonSparks() {
    const activeEl = document.activeElement;
    if (!activeEl) return;

    const rect = activeEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        
        // Random trajectory values
        const angle = Math.random() * Math.PI * 2;
        const speed = 30 + Math.random() * 50;
        const xDist = Math.cos(angle) * speed;
        const yDist = Math.sin(angle) * speed;

        particle.style.setProperty('--x', `${xDist}px`);
        particle.style.setProperty('--y', `${yDist}px`);
        particle.style.background = Math.random() > 0.5 ? '#D4AF37' : '#F07178';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
}

// Transition to nested Checkout Form inside drawer
function showCheckoutForm() {
    const contentWrapper = document.getElementById('cart-content-wrapper');
    const summarySection = document.getElementById('cart-summary-section');
    
    // Save previous HTML for Back navigation
    const originalItemsHTML = contentWrapper.innerHTML;
    const grandSum = document.getElementById('cart-grand-total').innerText;

    // Slide-out animations
    contentWrapper.style.opacity = '0';
    summarySection.style.display = 'none';

    setTimeout(() => {
        contentWrapper.innerHTML = `
        <div class="flex flex-col gap-6 animate-[pageFadeIn_0.4s_ease-out_forwards]">
            <!-- Back navigation link -->
            <button onclick="restoreCartView()" class="self-start flex items-center gap-2 interactive-text font-label-caps text-[10px] tracking-widest uppercase">
                <span class="material-symbols-outlined text-[16px]">arrow_back</span> Back to Tray
            </button>

            <div>
                <h3 class="font-headline-sm text-[22px] text-white-pure uppercase tracking-widest">Checkout</h3>
                <p class="text-[11px] text-primary uppercase tracking-widest font-bold mt-1">Sum: ${grandSum}</p>
            </div>

            <!-- Checkout Form -->
            <form id="royal-checkout-form" class="flex flex-col gap-4" onsubmit="handleCheckoutSubmit(event)">
                <!-- Dine-In setting selector -->
                <div class="flex flex-col gap-1.5">
                    <label class="font-label-caps text-[9px] text-primary tracking-widest uppercase font-bold px-1">Serving Protocol</label>
                    <select id="checkout-protocol" class="bg-background/60 border border-primary/20 focus:border-primary rounded-full px-5 py-3.5 text-xs text-white-pure appearance-none cursor-pointer" onchange="toggleCheckoutFields()">
                        <option value="dinein">Dine-In (Table Service)</option>
                        <option value="pickup">Self Pickup (Self Service)</option>
                        <option value="delivery">Home Delivery (Standard)</option>
                    </select>
                </div>

                <!-- Full Name -->
                <div class="flex flex-col gap-1.5">
                    <label class="font-label-caps text-[9px] text-primary tracking-widest uppercase font-bold px-1">Your Full Name</label>
                    <input type="text" required id="checkout-name" placeholder="e.g. Aarav Sharma" class="bg-background/60 border border-primary/20 focus:border-primary rounded-full px-5 py-3.5 text-xs text-white-pure">
                </div>

                <!-- Contact Phone -->
                <div class="flex flex-col gap-1.5">
                    <label class="font-label-caps text-[9px] text-primary tracking-widest uppercase font-bold px-1">Contact Number</label>
                    <input type="tel" required id="checkout-phone" placeholder="e.g. +91 99999 88888" class="bg-background/60 border border-primary/20 focus:border-primary rounded-full px-5 py-3.5 text-xs text-white-pure">
                </div>

                <!-- Table Number / Address Input -->
                <div class="flex flex-col gap-1.5" id="checkout-location-group">
                    <label id="checkout-location-label" class="font-label-caps text-[9px] text-primary tracking-widest uppercase font-bold px-1">Dining Suite / Table Number</label>
                    <input type="text" required id="checkout-location" placeholder="e.g. Chamber Suite 4 / Table 12" class="bg-background/60 border border-primary/20 focus:border-primary rounded-full px-5 py-3.5 text-xs text-white-pure">
                </div>

                <!-- Occasion / Special notes -->
                <div class="flex flex-col gap-1.5">
                    <label class="font-label-caps text-[9px] text-primary tracking-widest uppercase font-bold px-1">Chef Instructions</label>
                    <textarea id="checkout-notes" rows="3" placeholder="Occasion details, spice level requirements, or allergy remarks..." class="bg-background/60 border border-primary/20 focus:border-primary rounded-2xl px-5 py-4 text-xs text-white-pure resize-none"></textarea>
                </div>

                <button type="submit" class="mt-4 w-full py-5 bg-primary text-on-primary rounded-full font-label-caps text-[11px] tracking-[0.2em] uppercase font-bold gold-glow-hover btn-shimmer-gold">Transmit Order</button>
            </form>
        </div>
        `;
        contentWrapper.style.opacity = '1';
    }, 400);

    // Bind original HTML as variable on element to enable restoring back
    contentWrapper.setAttribute('data-original-html', originalItemsHTML);
}

// Restore primary cart items list view
function restoreCartView() {
    const contentWrapper = document.getElementById('cart-content-wrapper');
    const summarySection = document.getElementById('cart-summary-section');
    const originalHTML = contentWrapper.getAttribute('data-original-html');

    contentWrapper.style.opacity = '0';
    
    setTimeout(() => {
        contentWrapper.innerHTML = originalHTML;
        summarySection.style.display = 'flex';
        contentWrapper.style.opacity = '1';
        renderCartItems(); // refresh state bindings
    }, 400);
}

// Adjust labels and inputs dynamically inside Checkout Form
function toggleCheckoutFields() {
    const protocol = document.getElementById('checkout-protocol').value;
    const label = document.getElementById('checkout-location-label');
    const input = document.getElementById('checkout-location');
    const group = document.getElementById('checkout-location-group');

    if(protocol === 'dinein') {
        group.style.display = 'flex';
        label.innerText = "Dining Suite / Table Number";
        input.placeholder = "e.g. Chamber Suite 4 / Table 12";
        input.required = true;
    } else if(protocol === 'delivery') {
        group.style.display = 'flex';
        label.innerText = "Delivery Address";
        input.placeholder = "Full address with landmark details...";
        input.required = true;
    } else {
        // Pickup doesn't need address/table
        group.style.display = 'none';
        input.required = false;
        input.value = "";
    }
}

// Form Checkout Submission and Receipt details
function handleCheckoutSubmit(e) {
    e.preventDefault();
    triggerButtonSparks();

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const protocol = document.getElementById('checkout-protocol').value;
    const location = document.getElementById('checkout-location')?.value || "";
    
    const contentWrapper = document.getElementById('cart-content-wrapper');
    const grandSum = document.getElementById('cart-grand-total').innerText;
    const orderId = `TCT-${Math.floor(100000 + Math.random() * 900000)}`;

    let deliveryProtocolMsg = "Your table is being prepared.";
    if (protocol === 'delivery') {
        deliveryProtocolMsg = "Our delivery team is being prepared to ride to your address.";
    } else if (protocol === 'pickup') {
        deliveryProtocolMsg = "Your package will be ready for pickup at our restaurant in 20 minutes.";
    }

    // Slide-out and display grand loading animation
    contentWrapper.style.opacity = '0';

    setTimeout(() => {
        contentWrapper.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center py-20 gap-6 animate-pulse">
            <span class="material-symbols-outlined text-primary text-[64px] animate-spin">refresh</span>
            <div>
                <h3 class="font-headline-sm text-[20px] text-white-pure uppercase tracking-widest leading-none">Transmitting Order</h3>
                <p class="text-[10px] text-primary uppercase tracking-widest font-bold mt-2">Communicating with Kitchen Chefs...</p>
            </div>
        </div>
        `;
        contentWrapper.style.opacity = '1';
    }, 400);

    // 2.5 second simulated latency
    setTimeout(() => {
        contentWrapper.style.opacity = '0';
        
        setTimeout(() => {
            contentWrapper.innerHTML = `
            <div class="flex flex-col gap-6 text-center py-6 animate-success px-4">
                <div class="w-20 h-20 rounded-full border border-primary flex items-center justify-center mx-auto bg-primary/10">
                    <span class="material-symbols-outlined text-primary text-[42px]">verified</span>
                </div>

                <div>
                    <h3 class="font-headline-sm text-[24px] text-white-pure uppercase tracking-widest leading-none">Order Secured</h3>
                    <span class="text-[10px] text-primary uppercase tracking-widest font-bold mt-2 block">TRANSMITTED SUCCESSFULLY</span>
                </div>

                <div class="cart-glass-card p-6 text-left space-y-4">
                    <div class="flex justify-between border-b border-primary/10 pb-2">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Order ID</span>
                        <span class="text-xs text-primary font-bold">${orderId}</span>
                    </div>
                    <div class="flex justify-between border-b border-primary/10 pb-2">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Patron Name</span>
                        <span class="text-xs text-white-pure">${name}</span>
                    </div>
                    <div class="flex justify-between border-b border-primary/10 pb-2">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Protocol</span>
                        <span class="text-xs text-white-pure capitalize">${protocol.replace('dinein', 'Dine-In Table').replace('pickup', 'Self Pickup').replace('delivery', 'Chariot Delivery')}</span>
                    </div>
                    ${location ? `
                    <div class="flex flex-col border-b border-primary/10 pb-2">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Serving Location</span>
                        <span class="text-xs text-white-pure leading-relaxed">${location}</span>
                    </div>
                    ` : ''}
                    <div class="flex justify-between pt-2">
                        <span class="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Grand Sum Paid</span>
                        <span class="text-sm text-primary font-bold">${grandSum}</span>
                    </div>
                </div>

                <p class="text-[13px] text-on-surface-variant leading-relaxed max-w-sm mx-auto mt-2">
                    ${deliveryProtocolMsg} A digital copy of your banquet invoice has been dispatched to your contact.
                </p>

                <button onclick="completeTawaOrder()" class="mt-6 w-full py-4.5 bg-primary text-on-primary rounded-full font-label-caps text-[11px] tracking-widest uppercase font-bold gold-glow-hover">Conclude Feast</button>
            </div>
            `;
            contentWrapper.style.opacity = '1';
            triggerButtonSparks(); // celebrate
        }, 400);

    }, 2500);
}

// Conclude booking and reset cart
function completeTawaOrder() {
    tawaCart = [];
    activePromo = null;
    localStorage.removeItem('tawaCart');
    localStorage.removeItem('tawaPromo');
    updateBadges();
    
    // Close Drawer
    const overlay = document.getElementById('tawa-cart-overlay');
    overlay.classList.remove('open');

    // Reload or redirect to clear drawer HTML state
    setTimeout(() => {
        window.location.reload();
    }, 400);
}

/**
 * ==========================================
 * The Coastal Tawa - Intro Video Overlay & Replay Manager
 * ==========================================
 */

// Initialize Intro Video Overlay Structure and Events
function initTawaVideoOverlay() {
    const overlayHTML = `
    <div id="tawa-video-overlay" style="display: none;">
        <video id="tawa-video-player" playsinline preload="auto">
            <source src="coastaltawavideo1.mp4" type="video/mp4">
        </video>
        <button id="tawa-video-volume" class="tawa-video-ctrl" onclick="toggleTawaVideoVolume(event)" aria-label="Toggle Sound">
            <span class="material-symbols-outlined text-[18px]">volume_off</span>
        </button>
        <button id="tawa-video-skip" class="tawa-video-ctrl" onclick="hideTawaVideo()">Skip Intro</button>
    </div>
    `;

    const range = document.createRange();
    const fragment = range.createContextualFragment(overlayHTML);
    document.body.appendChild(fragment);

    const overlay = document.getElementById('tawa-video-overlay');
    const video = document.getElementById('tawa-video-player');

    if (overlay && video) {
        overlay.style.display = 'flex';

        // Fade in video player only once it starts playing to prevent flash/flicker
        video.addEventListener('playing', () => {
            video.style.opacity = '1';
        });

        // Autoclose/fadeout when video ends
        video.addEventListener('ended', () => {
            hideTawaVideo();
        });
    }

    // Autoplay check: play once per session
    if (!sessionStorage.getItem('tawaIntroPlayed')) {
        sessionStorage.setItem('tawaIntroPlayed', 'true');
        setTimeout(() => {
            playTawaVideo(true); // true means autoplay (muted)
        }, 100);
    }
    
    // Set up logo links to intercept click and replay
    setupLogoReplay();
}

// Play Intro Video Overlay
function playTawaVideo(isAutoplay) {
    const overlay = document.getElementById('tawa-video-overlay');
    const video = document.getElementById('tawa-video-player');
    const volumeBtn = document.getElementById('tawa-video-volume');
    if (!overlay || !video) return;

    video.currentTime = 0;
    video.style.opacity = '0';

    if (isAutoplay) {
        video.muted = true;
        if (volumeBtn) {
            volumeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">volume_off</span>';
        }
    } else {
        video.muted = false;
        if (volumeBtn) {
            volumeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">volume_up</span>';
        }
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent page scroll

    const playPromise = video.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay check:", error);
            // Fallback to muted playing
            video.muted = true;
            if (volumeBtn) {
                volumeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">volume_off</span>';
            }
            video.play().catch(err => {
                console.error("Playback failed completely:", err);
                hideTawaVideo();
            });
        });
    }
}

// Fade Out and Hide Video Overlay
function hideTawaVideo() {
    const overlay = document.getElementById('tawa-video-overlay');
    const video = document.getElementById('tawa-video-player');
    if (!overlay) return;

    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    if (video) {
        video.style.opacity = '0';
    }

    setTimeout(() => {
        if (video) {
            video.pause();
        }
    }, 800); // Sync with overlay fade transition (800ms)
}

// Toggle Mute State and Volume Icon
function toggleTawaVideoVolume(e) {
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    const video = document.getElementById('tawa-video-player');
    const volumeBtn = document.getElementById('tawa-video-volume');
    if (!video || !volumeBtn) return;

    if (video.muted) {
        video.muted = false;
        volumeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">volume_up</span>';
    } else {
        video.muted = true;
        volumeBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">volume_off</span>';
    }
}

// Intercept clicks on title/logo text link
function setupLogoReplay() {
    const logoLinks = document.querySelectorAll('a');
    logoLinks.forEach(link => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href');
        if ((href === 'index.html' || href === '/') && text.toLowerCase().includes('the coastal tawa')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                playTawaVideo(false); // Play unmuted on user action
            });
        }
    });
}

// Expose public functions to global window scope to allow inline HTML handlers to invoke them
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.addToTawaCart = addToTawaCart;
window.adjustItemQty = adjustItemQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.applyPromoCode = applyPromoCode;
window.showCheckoutForm = showCheckoutForm;
window.restoreCartView = restoreCartView;
window.toggleCheckoutFields = toggleCheckoutFields;
window.handleCheckoutSubmit = handleCheckoutSubmit;
window.completeTawaOrder = completeTawaOrder;
window.hideTawaVideo = hideTawaVideo;
window.toggleTawaVideoVolume = toggleTawaVideoVolume;
window.playTawaVideo = playTawaVideo;

// Custom Mouse Cursor (Fork & Plate follower)
function initCustomCursor() {
    // Only run on desktop screens (>= 1024px) and fine pointer
    if (window.innerWidth < 1024 || !window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    const fork = document.createElement('div');
    fork.id = 'custom-cursor-fork';
    fork.innerHTML = `<img src="fork.png" alt="Fork Cursor">`;

    const plate = document.createElement('div');
    plate.id = 'custom-cursor-plate';
    plate.innerHTML = `<img src="plate.png" alt="Plate Follower">`;

    document.body.appendChild(fork);
    document.body.appendChild(plate);

    let mouseX = -100;
    let mouseY = -100;
    let forkX = -100;
    let forkY = -100;
    let plateX = -100;
    let plateY = -100;
    
    let forkScale = 1;
    let plateScale = 1;
    let plateAngle = 0;
    
    let isHovering = false;
    let cursorInitialized = false;
    let floatTimer = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!cursorInitialized) {
            cursorInitialized = true;
            fork.style.opacity = '1';
            plate.style.opacity = '1';
            forkX = mouseX;
            forkY = mouseY;
            plateX = mouseX - 40;
            plateY = mouseY + 40;
        }
    });

    // Detect hovers on interactive elements using event delegation
    document.addEventListener('mouseover', (e) => {
        const interactive = e.target.closest('a, button, [role="button"], input, select, textarea, .shimmer-btn, .glass-card, .dish-node-card');
        isHovering = !!interactive;
    });

    document.addEventListener('mouseout', () => {
        isHovering = false;
    });

    // Hide custom cursor when mouse leaves the viewport
    document.addEventListener('mouseleave', () => {
        fork.style.opacity = '0';
        plate.style.opacity = '0';
        cursorInitialized = false;
    });

    function updateCursor() {
        if (cursorInitialized) {
            // Fork follows instantly
            forkX = mouseX;
            forkY = mouseY;

            // Plate follower follows with delay, a fixed offset, and float animation
            const targetPlateX = mouseX - 40;
            floatTimer += 0.04;
            const floatOffset = Math.sin(floatTimer) * 2.5;
            const targetPlateY = mouseY + 40 + floatOffset;

            const dx = targetPlateX - plateX;
            const dy = targetPlateY - plateY;

            plateX += dx * 0.08;
            plateY += dy * 0.08;

            // Enforce constraints:
            // Horizontal offset: 30px to 45px LEFT of the fork
            plateX = Math.max(forkX - 45, Math.min(plateX, forkX - 30));
            
            // Vertical offset: 35px to 50px BELOW the fork
            plateY = Math.min(forkY + 50, Math.max(plateY, forkY + 35));

            // Subtle rotation leaning into direction of movement
            const targetAngle = Math.max(-12, Math.min(12, dx * 0.25));
            plateAngle += (targetAngle - plateAngle) * 0.08;

            // Scale factor for hovers
            const targetScale = isHovering ? 1.08 : 1.0;
            forkScale += (targetScale - forkScale) * 0.15;
            plateScale += (targetScale - plateScale) * 0.15;

            // GPU Accelerated transforms
            // Fork hotspot is at the tip: top-center (width is 24px)
            fork.style.transform = `translate3d(${forkX - 12}px, ${forkY}px, 0) scale(${forkScale})`;
            
            // Plate hotspot is at the center (width/height is 32px)
            plate.style.transform = `translate3d(${plateX - 16}px, ${plateY - 16}px, 0) scale(${plateScale}) rotate(${plateAngle}deg)`;
        }

        requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor);
}


