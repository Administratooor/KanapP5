/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 8 : Afficher un tableau récapitulatif des achats dans la page Panier---------*/

// constructeur d'élements

class Article {
  constructor(jsonArticle) {
    jsonArticle && Object.assign(this, jsonArticle);
  }
}
/*----------------------------------------------------------------------------
      Parcourir le localStorage et injection des éléments du localStorage
------------------------------------------------------------------------------*/

function returnParse() {
  //On parcour les key du localStorage en lui passant en argument i.
  for (let i = 0; i < localStorage.length; i++) {
    let detailsProduct = localStorage.getItem(localStorage.key(i));
    //Stockage des données avec JSON.parse(), et les données deviennent un objet JavaScript.
    let storageInsert = JSON.parse(detailsProduct);
    //Assignation de chaque élement de l'objet à la variable article
    for (let jsonArticle of storageInsert) {
      let article = new Article(jsonArticle);
      // Injection de la fonction insert à #carts__items (article en argument pour récupérer dans la fonction insert)
      document.querySelector('#cart__items').innerHTML += insert(article);
    }
  }
}

/*----------------------------------------------------------------------------
                Fonction pour innertHTML de #cart__items 
------------------------------------------------------------------------------*/

function insert(article) {
  return `<article class="cart__item" data-id="" data-color="${article.color}">
      <div class="cart__item__img">
      <img src ="${article.pictureSrc}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
          <p>42,00 €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : ${article.quantity} </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
}

returnParse();

/*-------------------------------------------------------------------------------------------------*/
/* ------Étape 9 : Gérer la modification et la suppression de produits dans la page Panier--------*/

let itemQuantity = document.querySelector('.itemQuantity').value;
