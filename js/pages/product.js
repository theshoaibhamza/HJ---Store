// product.js - Dynamically loads product details based on query parameter

// Example product data (expand as needed)
const PRODUCTS = {
  "zeeba-tikka-set-with-sahara": {
    title: "Zeeba Tikka Set with Sahara",
    price: "Rs. 8,300.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/ZeebaMehndi.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/ZeebaPink.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/ZeebaWhite.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/ZeebaDetail.jpg?width=800"
    ],
    colors: [
      { name: "Mehndi Green", color: "#4A7C59" },
      { name: "Pink", color: "#FFC0CB" },
      { name: "White", color: "#FFFFFF", border: true }
    ],
    description: `The Zeeba Tikka Set with Sahara is an exquisite piece of jewelry that brings together traditional craftsmanship with modern elegance. This stunning set includes a beautifully designed tikka and matching sahara (earring supports), perfect for weddings, engagements, and special celebrations.`,
    features: [
      "High-quality gold-plated finish",
      "Premium kundan stones",
      "Adjustable tikka chain",
      "Matching sahara included",
      "Comes in a beautiful gift box"
    ]
  },
  "parmi-tikka-set-with-sahara": {
    title: "Parmi Tikka Set with Sahara",
    price: "Rs. 7,400.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/Parmi_Blue.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/Parmi_Gold.jpg?width=800"
    ],
    colors: [
      { name: "Blue", color: "#3B5998" },
      { name: "Gold", color: "#FFD700" }
    ],
    description: `The Parmi Tikka Set with Sahara is a beautiful blend of tradition and style. Perfect for festive occasions and weddings.`,
    features: [
      "Gold-plated finish",
      "Handcrafted details",
      "Includes sahara",
      "Gift-ready packaging"
    ]
  },
  "pooja-earring-and-tikka-set": {
    title: "Pooja Earring and Tikka Set",
    price: "Rs. 14,400.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/Pooja-HotPink.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/Pooja-multi.jpg?width=800"
    ],
    colors: [
      { name: "Hot Pink", color: "#FF69B4" },
      { name: "Multi", color: "#A3D2CA" }
    ],
    description: `A vibrant earring and tikka set for special occasions. Handcrafted and unique.`,
    features: [
      "Vibrant color options",
      "Handcrafted",
      "Premium finish"
    ]
  },
  "andal-earring-and-tikka-sets": {
    title: "Andal Earring and Tikka Sets",
    price: "Rs. 9,800.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/AndalBabyPink.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/AndalBlue.jpg?width=800"
    ],
    colors: [
      { name: "Baby Pink", color: "#FFC1CC" },
      { name: "Blue", color: "#0000FF" }
    ],
    description: `Elegant and timeless, the Andal Earring and Tikka Sets are perfect for any celebration.`,
    features: [
      "Elegant design",
      "Multiple color options",
      "Gift box included"
    ]
  },
  "maira-necklace-set": {
    title: "Maira Necklace Set",
    price: "Rs. 18,500.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/MairaNecklaceSet1.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/MairaNecklaceSet2.jpg?width=800"
    ],
    colors: [
      { name: "Ruby", color: "#9B111E" },
      { name: "Emerald", color: "#50C878" }
    ],
    description: `A luxurious necklace set with ruby and emerald color options. Perfect for weddings and parties.`,
    features: [
      "Luxurious finish",
      "Ruby and emerald options",
      "Handcrafted"
    ]
  },
  "ayesha-necklace-set": {
    title: "Ayesha Necklace Set",
    price: "Rs. 15,200.00 PKR",
    images: [
      "https://chandnijewellery.com.au/cdn/shop/files/AyeshaNecklaceSet1.jpg?width=800",
      "https://chandnijewellery.com.au/cdn/shop/files/AyeshaNecklaceSet2.jpg?width=800"
    ],
    colors: [
      { name: "Mint", color: "#AAF0D1" },
      { name: "Gold", color: "#FFD700" }
    ],
    description: `The Ayesha Necklace Set features a fresh mint and gold palette, perfect for modern brides.`,
    features: [
      "Fresh color palette",
      "Modern design",
      "Perfect for brides"
    ]
  }
};

function getProductKeyFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product');
}

function renderProduct(product) {
  if (!product) {
    document.querySelector('.product-section').innerHTML = `<div class="product-not-found"><h2>Product Not Found</h2><p>The product you are looking for does not exist.</p></div>`;
    document.title = 'Product Not Found | Chandni Jewellery';
    return;
  }
  // Update title
  document.title = `${product.title} | Chandni Jewellery`;
  // Update product title
  document.querySelector('.product-info__title').textContent = product.title;
  // Update price
  document.querySelector('[data-product-price]').textContent = product.price;
  // Update images
  const galleryMain = document.querySelector('[data-gallery-main] img');
  if (galleryMain && product.images[0]) galleryMain.src = product.images[0];
  // Update thumbnails
  const thumbs = document.querySelectorAll('.product-gallery__thumb img');
  thumbs.forEach((img, i) => {
    if (product.images[i]) {
      img.src = product.images[i].replace('width=150', 'width=150');
      img.alt = product.colors[i] ? product.colors[i].name : product.title;
    }
  });
  // Update color swatches
  const swatchContainer = document.querySelector('.product-form__swatches');
  if (swatchContainer) {
    swatchContainer.innerHTML = product.colors.map((c, i) => `
      <label class="product-swatch">
        <input type="radio" name="color" value="${c.name}" ${i === 0 ? 'checked' : ''} data-swatch>
        <span class="product-swatch__color" style="background-color: ${c.color};${c.border ? ' border: 1px solid #ddd;' : ''}" title="${c.name}"></span>
        <span class="sr-only">${c.name}</span>
      </label>
    `).join('');
  }
  // Update description
  document.querySelector('.product-accordion__content p').textContent = product.description;
  // Update features
  const featuresList = document.querySelector('.product-accordion__content ul');
  if (featuresList) {
    featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const key = getProductKeyFromURL();
  renderProduct(PRODUCTS[key]);
});
