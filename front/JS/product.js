/*--- Étape 4 : Faire le lien entre un produit de la page d’accueil et la page Produit ---*/

// récupératon de la chaîne de requête dans l'url
const queryString_url_id = window.location.search;
console.log(queryString_url_id);

/*--- Étape 5 : Récupérer l’id du produit à afficher ---*/

/* L’interface URLSearchParams défini des méthodes utilitaires pour 
travailler avec la chaîne de requête (les paramètres GET) d’une URL.*/
const idProduct = new URLSearchParams(queryString_url_id);
console.log(idProduct);

// Retourne la première valeur associée au paramètre de recherche donné à la méthode .get
const idResult = idProduct.get('id');
console.log(idResult);

/*---Étape 6 : Insérer un produit et ses détails dans la page produit---*/

// insertion éléments DOM
function addProduct(product) {
  document.querySelector(
    '.item__img'
  ).innerHTML += `<img src=${product.imageUrl}>`;
  document.querySelector('#title').innerHTML += `${product.name}`;
  document.querySelector('#price').innerHTML += `${product.price}`;
  document.querySelector('#description').innerHTML += `${product.description}`;
  /* boucle sur product.colors pour y extraire les valeurs 
  des couleurs disponibles dans l'API l'une après l'autre */
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
  // Message d'erreur > contact service commercial
  .catch(function () {
    document.querySelector(
      '.item__img'
    ).innerHTML += `<h2>Oops ! L'affichage des détails du produit est introuvable.</h2> 
                                                            <p>Envoyer un mail à l'un de nos commercial qui vous répondra dans les plus bref délais <a href="mailto:support@name.com"> Contact </a></p>`;
  });

/* ------------Étape 7 : Ajouter des produits dans le panier--------------*/

// Récupérer le button sur le DOM via la const addToCart
const addToCart = document.querySelector('#addToCart');

// Récupération de l'input dans la variable pour ajout panier en cas de modification
let inputQuantity = document.querySelector('input[id="quantity"]');

function removeEffect() {
  addToCart.innerHTML = ' Ajout au panier';
  addToCart.style.background = '';
}

// écoute sur la cart produit
addToCart.addEventListener('click', (e) => {
  // on previent le comportement par défaut
  e.preventDefault();
  // récupération sur le DOM des éléments "color,quantity,name"
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  const name = document.querySelector('#title').textContent;

  // initialiser un tableau vide qui va accueillir item
  let data = [];
  // On crée un objet
  const item = {
    name: name,
    id: idResult,
    color: color,
    quantity: Math.round(Number(quantity)), // Convertir la quantité en number
  };
  // on test si les conditions sont vraies on alerte le visiteur, autrement on crée notre tableau
  function updateData(item, data) {
    if (
      item.color === '' ||
      item.color === undefined ||
      item.quantity < 1 ||
      item.quantity > 100 ||
      item.quantity === undefined
    ) {
      alert(
        'Veuillez renseigner une couleur et une quantité comprises entre 1-100'
      );
      return;
    } else {
      data.push(item);
    }
    // Gérer l'ajout de produit ou l'ajout de la quantité à un produit existant avec une condition
    if (localStorage.getItem(item.id + '|' + item.color)) {
      // on récupère les clefs valeurs du produit si il existe
      let localFound = localStorage.getItem(item.id + '|' + item.color);
      // on parse pour exploiter
      let moveQuantity = JSON.parse(localFound);
      // on indique à la quantité du localStorage qu'elle ajoutera la valeur du champ associé à elle même 
      item.quantity = moveQuantity.quantity + item.quantity;
      // envoi des nouvelles valeurs dans localStorage si la quantité est égale ou inférieure à 100
      if (item.quantity <= 100) {
        localStorage.setItem(item.id + '|' + item.color, JSON.stringify(item));
        // Gestion visuel de la validation d'ajout produit
        function addEffect() {
          // indique au visiteur le nombre de produit dans leur panier
          addToCart.innerHTML = `Produit ajouté | Total de ${item.name} : ${item.quantity}`;
          addToCart.style.background = 'green';
        }
        setTimeout(addEffect, 3);
        setTimeout(removeEffect, 3000);
      }
    } else {
      // envoi des nouvelles valeurs dans le localStorage
      localStorage.setItem(item.id + '|' + item.color, JSON.stringify(item));
    }
  }

  // On joue la fonction
  updateData(item, data);

  /*-----  Redirection vers la page panier (optionnel)-----*/
  // window.location.href = 'cart.html';
});
