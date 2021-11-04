// ELEMENTS

const searchElem = document.querySelector('.search');
const btnSearch = document.querySelector('#btn-search');
const resultsListElem = document.querySelector('.results');
const items = document.querySelectorAll('.item');
const updateCartBtns = document.querySelectorAll('.btn-update-cart');
const cartImg = document.querySelector('.img-cart');
const quantityElem = document.querySelector('.quantity');
const cartElem = document.querySelector('.cart');
const form = document.querySelector('form');
const emptyMessage = document.querySelector('.empty-cart');
const totalPriceElem = document.querySelector('.total-price');
const cartModal = document.querySelector('.cart-modal');
const approvedBoughtModal = document.querySelector('.approved-bought');
const overlay = document.querySelector('.overlay');

// PRODUCTS LISTS

class Product{
  constructor(name, imgSrc, price, id, btnElement){
    this.name = name;
    this.imgSrc = imgSrc;
    this.price = price;
    this.id = id;
    this.isInCart = false;
    this.btnElement = btnElement;
  }
  addToCart(){
    if (!this.isInCart){
      cart.push(this);
      this.isInCart = true;
      appendNewCartItem(this);
    }
  }
  removeFromCart(){
    if (this.isInCart){
      cart = cart.filter(prod => prod != this);
      this.isInCart = false;
    }
  }
}

const products = [];

items.forEach(item => products.push(new Product(
  item.querySelector('.item-name').textContent,
  item.querySelector('img').src,
  parseFloat(item.querySelector('.item-price').textContent.slice(2)),
  item.id,
  item.querySelector('button')
)));

let cart = [];
// cart.forEach(item => appendNewCartItem(item));

// FUNCTIONS

const search = function(){

  resultsListElem.textContent = '';

  const searched = searchElem.value.toLowerCase();
  products.forEach(item => {
    if (item.name.toLowerCase().includes(searched)){
      const newResult = resultsListElem.appendChild(document.createElement('div'));
      const span = document.createElement('span');
      const img = document.createElement('img');
      const foundItem = item.btnElement.parentElement.parentElement;

      newResult.appendChild(span);
      span.textContent = `${item.name}`;
      newResult.appendChild(img);
      img.setAttribute('src', `${item.imgSrc}`);
      img.classList.add('img-mini');

      newResult.addEventListener('click', function(){
        hideElements();
        scroll(0, foundItem.offsetTop - 50);
      }, {once: true});
    }
  });

  overlay.classList.remove('hidden');
  resultsListElem.classList.remove('hidden');
};

const displayCart = function(){
  cartModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  if (cart.length != 0){
    form.classList.remove('hidden');
    emptyMessage.classList.add('hidden');
  }else{
    form.classList.add('hidden');
    emptyMessage.classList.remove('hidden');
  }
};

const displayApprovedBoughtMessage = function(){
  approvedBoughtModal.classList.remove('hidden');
};

const hideElements = function(){
  resultsListElem.classList.add('hidden');
  cartModal.classList.add('hidden');
  approvedBoughtModal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const calcTotalPrice = function(){
  totalPriceElem.textContent = `R$${cart.reduce((total, item) => total+item.price, 0).toFixed(2)}`;
};

const appendNewCartItem = function(addedItem){
  quantityElem.textContent = cart.length;

  const span = document.createElement('span');
  span.textContent = `${addedItem.name}`;

  const img = document.createElement('img');
  img.setAttribute('src', `${addedItem.imgSrc}`);
  img.classList.add('img-mini');

  const newCartItem = document.createElement('div');
  newCartItem.appendChild(span);
  newCartItem.appendChild(img);
  newCartItem.setAttribute('id', `${addedItem.id}`);
  cartElem.appendChild(newCartItem);

  toggleUpdateCartBtn(addedItem.btnElement);
};

const toggleUpdateCartBtn = function(btn){
  btn.classList.toggle('btn-danger');
  btn.classList.toggle('btn-primary');
};

const removeItemFromCart = function(item, itemBtn){
  item.removeFromCart();
  quantityElem.textContent = cart.length > 0 ? cart.length : '';

  cartElem.childNodes.forEach(cartItem => {
    if (cartItem.id === item.id)
      cartItem.remove();
  });

  calcTotalPrice();

  toggleUpdateCartBtn(itemBtn);
  itemBtn.textContent = 'Adicionar Ao Carrinho';
};

const addItemToCart = function(item, itemBtn){
  item.addToCart();
    
  calcTotalPrice();

  itemBtn.textContent = 'Remover do Carrinho';
};

const handleUpdateCartClick = function(){
  const clickedItemElem = this.parentNode.parentNode;
  const clickedItem = products.find(prod => prod.id === clickedItemElem.id);

  if (clickedItem.isInCart) removeItemFromCart(clickedItem, this);
  else addItemToCart(clickedItem, this);
};

const generateCartItemsString = function(){
  return cart.reduce((str, item, index, arr) => {
    return index === arr.length - 2 ? `${str} ${item.name} e` :
        index === arr.length - 1 ? `${str} ${item.name}` :
          index === 0 ? `${item.name},` :
            `${str} ${item.name},`;
  }, '');
};

const approveBought = function(e){
  e.preventDefault();
  
  let userName = this.querySelector('#name').value;

  const cartItemsStr = generateCartItemsString();
  
  approvedBoughtModal.querySelector('.message').textContent = `Compra de ${cartItemsStr} aprovada com sucesso. Agracedemos pela preferência, ${userName}`;
  displayApprovedBoughtMessage();

  cart.forEach(item => item.btnElement.click());
  cartModal.classList.add('hidden');
};

// EVENT LISTENERS

searchElem.addEventListener('keydown', function(e){
  if (e.key === 'Enter') search();
});
btnSearch.addEventListener('click', search);
updateCartBtns.forEach(btn => btn.addEventListener('click', handleUpdateCartClick));
cartImg.addEventListener('click', displayCart);
overlay.addEventListener('click', hideElements);
form.addEventListener('submit', approveBought);

// TODO: clean the code.