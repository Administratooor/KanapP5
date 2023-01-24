/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 8 : Afficher un tableau récapitulatif des achats dans la page Panier---------*/

const url = 'http://localhost:3000/api/products';

// constructeur d'élements
class Article {
  constructor(jsonArticle) {
    jsonArticle && Object.assign(this, jsonArticle);
  }
}
/*----------------------------------------------------------------------------
            Parcourir le localStorage et injection des éléments
                  dans #cart__items via function insert 
------------------------------------------------------------------------------*/

function returnParse() {
  //On parcour les key du localStorage en lui passant en argument i.
  // for (let i = 0; i < localStorage.length; i++) {
  //   console.log(i);
  const localFound = localStorage.getItem('product');
  // console.log(localFound);
  /* Stockage des données avec JSON.parse(), 
    et les données deviennent des objets JavaScript. */
  let storageInsert = JSON.parse(localFound);
  // console.log(storageInsert);
  // Récupération des id dans tableau/élements ayant l'index 0 puis la valeur id
  let idPanier = storageInsert[0].id;
  console.log(idPanier);
  // Promess qui récupére les objects dans l'API
  fetch(url)
    // Extraction des données en json
    .then((data) => data.json())
    // Itération des données (dataFound) avec (for of),
    // et les assignés à la variable priceRecovery en utilisant la class Article et son contructor.
    .then((dataFound) => {
      // console.log(dataFound);
      for (let jsonArticle of dataFound) {
        let priceRecovery = new Article(jsonArticle);
        // Si le priceRecovery et égale à l'id du panier
        if (priceRecovery._id == idPanier) {
          /* Créer un nouvel object via localStorage  */
          for (let jsonArticle of storageInsert) {
            let article = new Article(jsonArticle);
            // console.log(article);
            /* Récupérer un élément HTML et inserer facilement le contenu existant
               d'une fonction avec innertHTML ( function insert) qui prend en argument les éléments de l'API
              "sensible" (priceRecovery) et (article) pour les éléments du local Storage */
            document.querySelector('#cart__items').innerHTML += insert(
              article,
              priceRecovery
            );
            totalProduit();
            // totalQuantity(article);
          }
        }
      }
    });
}

// Rechercher le prix via api
// Une fonction qui modifie localStorage
// Une fonction qui se charge de modifier le panier prix

/*----------------------------------------------------------------------------
                Fonction pour innertHTML de #cart__items 
------------------------------------------------------------------------------*/

function insert(article, priceRecovery) {
  return `<article class="cart__item" data-id="${article.id}" data-color="${article.color}"data-quantité="${article.quantity}"data-prix="${priceRecovery.price}">
      <div class="cart__item__img">
      <img src ="${article.pictureSrc}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
          <p >${priceRecovery.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${article.id}" data-couleur="${article.color}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
}

returnParse();

//--------------------------------------------------------------
// fonction pour modifier la quantité dans le localStorage
//--------------------------------------------------------------
function modifQuantité() {
  // boucle sur le localStorage.key dans localFound
  for (let i = 0; i < localStorage.length; i++) {
    const localFound = localStorage.getItem(localStorage.key(i));
    console.log(localFound);
    //transformation des données en objet
    let storageInsert = JSON.parse(localFound);
    console.log(storageInsert);
    //récupération des clés "name" sur les objets
    let foundName = storageInsert[0].name;
    console.log(foundName);

    // Récupération de l'élément .cartItem sur le DOM
    let cart = document.querySelectorAll('.cart__item');
    /* forEach pour itérer sur les propriétés du tableau*/
    cart.forEach((cart) => {
      // ecoute de l'article au changement avec attribut (e)
      cart.addEventListener('change', (e) => {
        //recuperation du localStorage avec leurs "foundName" dans la variable "basket"
        let basket = JSON.parse(localStorage.getItem(foundName));
        // boucle
        for (itemOfBasket of basket)
          if (
            // Verification que que les color sont identiques && les id
            cart.dataset.color === itemOfBasket.color &&
            cart.dataset.id === itemOfBasket.id
          ) {
            // si la condition est remplie ont assigne les nouvelle valeurs
            itemOfBasket.quantity = e.target.value;
            // Ont intégre une nouvelle valeur (mise à jour ) au localStorage
            localStorage.setItem('panierStocké', JSON.stringify(basket));
            // Mise à jour de dataset.quantité
            cart.dataset.quantité = e.target.value;
            // rejoue la fonction totalProduit pour mettre à jour le prixTotal
            totalProduit();
          }
      });
    });
  }
}

//--------------------------------------------------------------
// fonction pour modifier le prix de façon dynamique
//--------------------------------------------------------------
function totalProduit() {
  // initialisation en nombre de la variable totalProduct
  let totalProduct = 0;
  // initialisation en nombre de la variable totalPrice
  let totalPrice = 0;
  // Récupération de l'élément .cartItem sur le DOM
  const itemCart = document.querySelectorAll('.cart__item');
  // pour chaque élément itemcart
  itemCart.forEach((itemCart) => {
    //Inserer les dataset "quantité" pour les affecter à totalProduct
    totalProduct += JSON.parse(itemCart.dataset.quantité);
    // affectation de totalPrice à  : itemCart.dataset.quantité * itemCart.dataset.prix
    totalPrice += itemCart.dataset.quantité * itemCart.dataset.prix;
  });

  // affichage de la quantité dynamique dans avec totalProduct
  document.getElementById('totalQuantity').textContent = totalProduct;
  // affichage du prix dynamique dans avec totalPrice
  document.getElementById('totalPrice').textContent = totalPrice;
  modifQuantité();
}

// ------------------Étape 10 : Passer la commande -----------------
