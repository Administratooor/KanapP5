/*---Étape 4 : Faire le lien entre un produit de la page
d’accueil et la page Produit---*/

/* New Article (script.js) récupére sur let = article l'itération de jsonArticle (tableau)
en lui affectant les propriétés (object.assign(target , source)) si les 2 conditions
sont vraies avec this. */

class Article {
  constructor(jsonArticle) {
    jsonArticle && Object.assign(this, jsonArticle);
  }
}

//1.Récupératon de la chaîne de requête dans l'url*/
const queryString_url_id = window.location.search;
console.log(queryString_url_id);

/*---Étape 5 : Récupérer l’id du produit à afficher---*/

// Extraire l'id avec urlSearchParams
const idProduct = new URLSearchParams(queryString_url_id);
console.log(idProduct);

// Récupération de l'id
const idResult = idProduct.get('id');
console.log(idResult);

/*---Étape 6 : Insérer un produit et ses détails dans la page
Produit---*/
// 1. Block de code pour insertion Html + variables correspondantes
function addProduct(product) {
  document.querySelector(
    '.item__img'
  ).innerHTML += `<img src=${product.imageUrl}>`;
  document.querySelector('#title').innerHTML += `${product.name}`;
  document.querySelector('#price').innerHTML += `${product.price}`;
  document.querySelector('#description').innerHTML += `${product.description}`;
  // boucle sur les couleurs de l'api pour insérer dans l'id colors les values associés au produit
  for (let couleur of product.colors) {
    document.querySelector(
      '#colors'
    ).innerHTML += `<option value="${couleur}">${couleur}</option>`;
  }
}

/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 6 :Appeler l'API avec promess pour récupérer les données du produit---------*/

//1.Promess pour récupération du produit concerné par idResult
fetch('http://localhost:3000/api/products/' + idResult)
  .then((res) => res.json())
  .then((product) => {
    // Fonction pour afficher le produit sur le DOM
    addProduct(product);
  })
  // 2.Message d'erreur > contact service commercial
  .catch(function () {
    document.querySelector(
      '.item__img'
    ).innerHTML += `<h2>Oops ! L'affichage des détails du produit est introuvable.</h2> 
                                                            <p>Envoyer un mail à l'un de nos commercial qui vous répondra dans les plus bref délais <a href="mailto:support@name.com"> Contact </a></p>`;
  });

/* ------------Étape 7 : Ajouter des produits dans le panier--------------*/

// Récupérer le button sur le DOM via la const addToCart
const addToCart = document.querySelector('#addToCart');

//Initialiser un tableau vide qui va acceuillir item
let data = [];

// Récupératoin de l'input dans la variable pour ajout panier en cas de modification
let inputQuantity = document.querySelector('input[id="quantity"]');

//Evénement au click sur le button
addToCart.addEventListener('click', (e) => {
  e.preventDefault();
  // Récupération sur le DOM des éléments "color,quantity,name"
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  const name = document.querySelector('#title').textContent;

  // On crée un objet qui servira de structure à data

  const item = {
    name: name,
    id: idResult,
    color: color,
    quantity: Math.round(Number(quantity)), // Convertir la quantité en number
  };

  function updateData(item, data) {
    if (
      item.color === '' ||
      item.color === undefined ||
      item.quantity < 1 ||
      item.quantity > 100 ||
      item.quantity === undefined
    ) {
      alert('Veuillez renseigner une couleur et une quantitée ');
      return;
    } else {
      /* On pousse l'objet item dans le tableau data , on crée un identifiant unique pour la clés 
      ( id + color ).On sérialise*/
      data.push(item);
      localStorage.setItem(item.id + '|' + item.color, JSON.stringify(item));
      addToCart.innerHTML = 'Produit ajouté';
    }
  }

  // On joue la fonction
  updateData(item, data);
  modifQuantity(item);
  /*-----  Redirection vers la page panier (optionnel)-----
      =>   window.location.href = 'cart.html'; */
});

function modifQuantity(item) {
  inputQuantity.addEventListener('input', () => {
    item.quantity = item.quantity + inputQuantity.value;
  });
}
