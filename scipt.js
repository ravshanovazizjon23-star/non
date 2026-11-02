
const products = [
  {
    id: 1,
    name: "Oddiy tandir non",
    category: "Tandir non",
    price: 5000,
    description: "An'anaviy usulda pishirilgan mazali non.",
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Katta obi non",
    category: "Tandir non",
    price: 7000,
    description: "Oilaviy dasturxon uchun katta non.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Sariyog‘li patir",
    category: "Patir",
    price: 12000,
    description: "Yumshoq, xushbo‘y va to‘yimli patir.",
    image: "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Qatlama patir",
    category: "Patir",
    price: 15000,
    description: "Qat-qat tuzilishga ega mazali patir.",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Kichik kulcha",
    category: "Kulcha",
    price: 3000,
    description: "Nonushta va yengil tamaddi uchun.",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484df?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Sedanali non",
    category: "Tandir non",
    price: 8000,
    description: "Ustiga sedana sepilgan xushbo‘y non.",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Sutli kulcha",
    category: "Kulcha",
    price: 6000,
    description: "Mayin va mazali kulcha.",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Bayramona patir",
    category: "Patir",
    price: 20000,
    description: "Bayram va mehmonlar dasturxoni uchun.",
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80"
  }
];

const cart = {};

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartModal = document.getElementById("cartModal");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");

let activeCategory = "Barchasi";
let toastTimer;

function formatPrice(price) {
  return price.toLocaleString("uz-UZ") + " so‘m";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("uz");

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      activeCategory === "Barchasi" ||
      product.category === activeCategory;

    const matchesSearch =
      product.name.toLocaleLowerCase("uz").includes(searchTerm) ||
      product.description.toLocaleLowerCase("uz").includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="empty-state">😕 Bu nomdagi non topilmadi.</p>';
    return;
  }

  productGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      >
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            type="button"
          >+ Savatga</button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (cart[id]) {
    cart[id].quantity += 1;
  } else {
    cart[id] = { ...product, quantity: 1 };
  }

  updateCart();
  showToast(product.name + " savatga qo‘shildi!");
}

function changeQuantity(id, change) {
  if (!cart[id]) return;

  cart[id].quantity += change;

  if (cart[id].quantity <= 0) {
    delete cart[id];
  }

  updateCart();
}

function getCartCount() {
  return Object.values(cart).reduce(
    (sum, item) => sum + item.quantity, 0
  );
}

function getCartTotal() {
  return Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
}

function updateCart() {
  document.getElementById("cartCount").textContent = getCartCount();

  const cartItems = document.getElementById("cartItems");
  const items = Object.values(cart);

  if (items.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-state">Savatingiz hozircha bo‘sh. 🛒</p>';
  } else {
    cartItems.innerHTML = items.map(item => `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">
            ${formatPrice(item.price)} / dona
          </div>
        </div>

        <div class="quantity-controls">
          <button type="button" data-minus="${item.id}"
            aria-label="Kamaytirish">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-plus="${item.id}"
            aria-label="Ko‘paytirish">+</button>
        </div>
      </div>
    `).join("");
  }

  document.getElementById("cartTotal").textContent =
    formatPrice(getCartTotal());

  document.getElementById("checkoutTotal").textContent =
    formatPrice(getCartTotal());

  document.getElementById("checkoutButton").disabled =
    items.length === 0;
}

// Mahsulotlarni savatga qo‘shish
productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

// Savatdagi sonlarni boshqarish
document.getElementById("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");

  if (plus) changeQuantity(Number(plus.dataset.plus), 1);
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);
});

// Kategoriyalar
document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts();
});

// Qidiruv
searchInput.addEventListener("input", renderProducts);

// Oynalarni ochish va yopish
function openModal(modal) {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("openCart").addEventListener("click", () => {
  openModal(cartModal);
});

document.getElementById("closeCart").addEventListener("click", () => {
  closeModal(cartModal);
});

document.getElementById("closeCheckout").addEventListener("click", () => {
  closeModal(checkoutModal);
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (getCartCount() === 0) {
    showToast("Avval savatga non qo‘shing.");
    return;
  }

  closeModal(cartModal);
  openModal(checkoutModal);
});

[cartModal, checkoutModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal(cartModal);
    closeModal(checkoutModal);
  }
});

// Buyurtma formasini tekshirish
document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (getCartCount() === 0) {
    closeModal(checkoutModal);
    showToast("Savat bo‘sh. Avval mahsulot tanlang.");
    return;
  }

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);

  const order = {
    customer: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    note: formData.get("note"),
    items: Object.values(cart).map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: getCartTotal()
  };

  // Hozircha buyurtma demo rejimida ko‘rsatiladi.
  // Haqiqiy yuborish uchun server yoki Telegram API kerak.
  console.log("Demo buyurtma:", order);

  closeModal(checkoutModal);

  alert(
    "Demo buyurtma tayyorlandi!\n\n" +
    "Mijoz: " + order.customer + "\n" +
    "Telefon: " + order.phone + "\n" +
    "Manzil: " + order.address + "\n" +
    "Jami: " + formatPrice(order.total) +
    "\n\nBu buyurtma hali nonvoyxonaga yuborilmadi."
  );

  form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
