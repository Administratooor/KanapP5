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

function returnProductDom() {
  // Récuperer et parsé le localStorage et toutes les key
  for (let i = 0; i < localStorage.length; i++) {
    let localFound = localStorage.getItem(localStorage.key(i));
    let localParse = JSON.parse(localFound);

    fetch(url)
      // Extraction des données en json
      .then((data) => data.json())

      .then((dataFound) => {
        // console.log(dataFound);
        for (let foundProduct of dataFound) {
          let article = foundProduct;
          if (article._id === localParse.id) {
            // let picture = document.querySelector('.cart__item__img');
            // console.log(picture);
            document.querySelector('#cart__items').innerHTML += insert(
              localParse,
              article
            );
          }
        }
      });
  }
  // deleteItem();
  quantityChange();
  totalProduit();
}

returnProductDom();

/*----------------------------------------------------------------------------
                Fonction pour innertHTML de #cart__items 
------------------------------------------------------------------------------*/

function insert(localParse, article) {
  return `<article class="cart__item" data-id="${localParse.id}" data-color="${localParse.color}">
  <div class="cart__item__img">
    <img src="" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${localParse.name}</h2>
      <p>${localParse.color}</p>
      <p>${article.price}€</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localParse.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
}

//--------------------------------------------------------------
// fonction pour modifier la quantité dans le localStorage
//--------------------------------------------------------------

function quantityChange() {
  const KanapArea = document.querySelectorAll('.cart__item');
  console.log(KanapArea);
  for (let i = 0; i < localStorage.length; i++) {
    let localFound = localStorage.getItem(localStorage.key(i));
    let localParse = JSON.parse(localFound);

    let panier = JSON.parse(
      localStorage.getItem(localParse.id + '|' + localParse.color)
    );
    console.log(panier);
  }
  KanapArea.forEach((KanapArea) => {
    KanapArea.addEventListener('change', (e) => {
      // Récupération des clés pour la variable panier

      // boucle pour vérifier si les id et color sont identiques
      for (product of panier)
        if (
          KanapArea.dataset.color === product.color &&
          product.id === KanapArea.dataset.id
        ) {
          // Appliquer la valeur récupéré à la quantité du panier
          product.quantité = e.target.value;
          //Réinjecter le panier
          localStorage.KanapArea = JSON.stringify(panier);

          totalProduit();
        }
    });
  });
}

// //--------------------------------------------------------------
// //             modification dynamique du prix
// //--------------------------------------------------------------
function totalProduit() {
  // Declaration en nombre de totalProduct
  let totalProduct = 0;
  // Declaration en nombre de totalPrice
  let totalPrice = 0;
  // boucle sur localStorage pour recupération de la quantity
  for (let i = 0; i < localStorage.length; i++) {
    let localFound = localStorage.getItem(localStorage.key(i));
    let localParse = JSON.parse(localFound);
    // Injection de la quantity du local storage
    totalProduct += localParse.quantity;
    // Injection de la quantity dans le DOM
    document.getElementById('totalQuantity').textContent = totalProduct;
    /* appel API si l'id est identique a l'id du localStorage 
    > Importer le prix et le multiplier par la quantity et l'afficher dans DOM */
    fetch(url)
      // Extraction des données en json
      .then((data) => data.json())

      .then((dataFound) => {
        // console.log(dataFound);
        for (let foundProduct of dataFound) {
          // Importation du prix dans la variable price
          let price = foundProduct.price;
          if (foundProduct._id === localParse.id) {
            totalPrice += localParse.quantity * price;
            document.getElementById('totalPrice').textContent = totalPrice;
          }
        }
      })
      .catch(function () {
        console.log('test');
      });
  }
}

// ------------------Étape 10 : Passer la commande -----------------
