import { products } from "./products.js";
const shopContainer = document.querySelector(".shop-products-container");
const bagShopping = document.querySelector(".fa-bag-shopping");
const modal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");
const menueIcone = document.querySelector("#menu-icon");
const backScreen = document.querySelector(".backscreen");
const navBar = document.querySelector(".navbar");

let cart = [];
let buttonsDom = [];
class Products {
  getProducts() {
    return products;
  }
}
class UI {
  displayProducts(products) {
    let resContainer = "";
    products.forEach((item) => {
      resContainer += `
      <div class="shop-box">
      <img src=${item.imgUrl} alt=${item.title} />
      <h4>${item.title}</h4>
      <h5>${item.price}</h5>
      <button><i class="fa-solid fa-cart-shopping add-to-cart" id=${item.id}></i></button>
      </div>
      `;
      shopContainer.innerHTML = resContainer;
    });
  }
  getAddToCartsBtns() {
    const addToCartsBtns = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartsBtns];
    buttonsDom = buttons;
    buttons.forEach((btn) => {
      const id = btn.id;
      const isInCart = cart.find((p) => p.id === Number(id));
      if (isInCart) {
        btn.style.opacity = 0.5;
        btn.style.cursor = "not-allowed";
      }
      btn.addEventListener("click", (event) => {
        btn.style.opacity = 0.5;
        btn.style.cursor = "not-allowed";
        const addedProduct = { ...LocalStorage.getProduct(id), quantity: 1 };
        const cartId = cart.map((i) => i.id);

        if (cartId.includes(addedProduct.id)) {
        } else {
          cart = [...cart, addedProduct];
          LocalStorage.saveCart(cart);
          this.setCartValue(cart);
          this.addCartItem(addedProduct);
        }
        // cart=cart.filter((item, index) => {
        //   cart.indexOf(item) === index;
        // });

        // console.log(cart, addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let numOfCarts = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      numOfCarts += curr.quantity;
      return acc + curr.quantity * Number(curr.price.split(" ")[0]);
    }, 0);
    cartTotal.innerText = ` total price: ${totalPrice}$`;
    cartItems.innerText = numOfCarts;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList = "cart-item";
    div.innerHTML = `
    <img
    class="cart-item-image"
    src=${cartItem.imgUrl}
    alt=""
  />
  <div class="cart-item-desc">
    <h4>${cartItem.title}</h4>
    <h5>${cartItem.price}</h5>
  </div>
  <div class="cart-item-controller">
    <i class="fas fa-chevron-up" id=${cartItem.id}></i>
    <p>${cartItem.quantity}</p>
    <i class="fas fa-chevron-down" id=${cartItem.id}></i>
  </div>
  <i class="fas fa-trash" id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setupApp() {
    cart = LocalStorage.getCart() || [];
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => {
      cart.forEach((cItem) => this.removeItem(cItem.id));
      while (cartContent.children.length) {
        cartContent.removeChild(cartContent.children[0]);
      }
      closModalFunction();
    });
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;
        const addItem = cart.find(
          (cItem) => parseInt(cItem.id) === parseInt(addQuantity.id)
        );
        addItem.quantity++;
        this.setCartValue(cart);
        LocalStorage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addItem.quantity;
      } else if (event.target.classList.contains("fa-trash")) {
        const removeItem = event.target;
        const _removedItem = cart.find(
          (cItem) => parseInt(cItem.id) === parseInt(removeItem.id)
        );
        this.removeItem(_removedItem.id);
        LocalStorage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractItem = cart.find(
          (cItem) => parseInt(cItem.id) === parseInt(subQuantity.id)
        );
        if (substractItem.quantity === 1) {
          this.removeItem(substractItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
        }
        substractItem.quantity--;
        this.setCartValue(cart);
        LocalStorage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractItem.quantity;
      }
    });
  }
  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setCartValue(cart);
    LocalStorage.saveCart(cart);
    const button = buttonsDom.find((btn) => parseInt(btn.id) === parseInt(id));
    button.style.opacity = 1;
    button.style.cursor = "pointer";
  }
}
class LocalStorage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === Number(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.cartLogic();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartsBtns();
  LocalStorage.saveProducts(productsData);
});

function showModal() {
  modal.classList.add("apear-modal");
  backdrop.style.display = "block";
}
function closModalFunction() {
  modal.classList.remove("apear-modal");
  backdrop.style.display = "none";
}
bagShopping.addEventListener("click", showModal);
backdrop.addEventListener("click", closModalFunction);

function showMenu() {
  navBar.classList.add("apear-menu");
  backScreen.style.display = "block";
}
function closeMenu() {
  navBar.classList.remove("apear-menu");
  backScreen.style.display = "none";
}
menueIcone.addEventListener("click", showMenu);
backScreen.addEventListener("click", closeMenu);
