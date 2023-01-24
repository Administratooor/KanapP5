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
//Enlever le ? de queryString_url_id

//1.Méthode 1 - > Extraire juste l'id avec slice */
/*const idProduct = queryString_url_id.slice(1);
console.log(idProduct);*/

//2.Méthode 2 - > Extraire l'id avec urlSearchParams
const idProduct = new URLSearchParams(queryString_url_id);
console.log(idProduct);

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
  // A TERMINER !!!!
  document.querySelector(
    '#colors'
  ).innerHTML += `<option value=${product.colors[0]}>${product.colors[0]}</option>
    <option value=${product.colors[1]}>${product.colors[1]}</option><option value=${product.colors}>${product.colors[3]}</option>`;
}

/*---Étape 6 :Appeler l'API avec promess pour récupérer les données du produit---*/
//1.Promess pour récupération du produit concerné par idResult
fetch('http://localhost:3000/api/products/' + idResult)
  .then((res) => res.json())
  .then((product) => {
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

//Evénement au click sur le button
addToCart.addEventListener('click', () => {
  // Récupération sur le DOM des éléments "color,quantity,price + name"
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  // Récupérer le titre pour l'assigner en clés de l'objet JSON
  const name = document.querySelector('#title').textContent;
  const picture = document.getElementsByTagName('img'); //#endregion
  pictureFound = picture[5].src;

  let item = {
    name: name,
    id: idResult,
    color: color,
    quantity: Number(quantity), // Convertir la quantité en number
    pictureSrc: pictureFound,
  };

  /* Fonction pour itérer sur data et vérifier que l'id est le même et la couleur, 
auxquels  cas incrémenter la quantity de la quantity saisie */
  function updateData(item, data) {
    if (item.color === '' || item.quantity == 0 || item.quantity == '') {
      alert('Veuillez renseigner une couleur et une quantitée ');

      return;
    }
    for (let dat of data) {
      if (dat.id === item.id && dat.color === item.color) {
        dat.quantity += item.quantity;
        return;
      }
    }
    data.push(item);
  }
  // On joue la fonction
  updateData(item, data);

  // Ont injecte dans un format JSON.stringify sérialisé
  localStorage.setItem(name, JSON.stringify(data));

  /*-----  Redirection vers la page panier (optionnel)-----
       =>   window.location.href = 'cart.html'; */
});
