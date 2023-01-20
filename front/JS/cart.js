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
  for (let i = 0; i < localStorage.length; i++) {
    const localFound = localStorage.getItem(localStorage.key(i));
    // console.log(localFound);
    /* Stockage des données avec JSON.parse(), 
    et les données deviennent des objets JavaScript. */
    let storageInsert = JSON.parse(localFound);
    // console.log(storageInsert);
    // Récupération des id dans tableau/élements ayant l'index 0 puis la valeur id
    let idPanier = storageInsert[0].id;
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
              // totalQuantity(article);
            }
          }
        }
      });
  }
}

// Rechercher le prix via api
// Une fonction qui modifie localStorage
// Une fonction qui se charge de modifier le panier prix

/*----------------------------------------------------------------------------
                Fonction pour innertHTML de #cart__items 
------------------------------------------------------------------------------*/

function insert(article, priceRecovery) {
  return `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
      <div class="cart__item__img">
      <img src ="${article.pictureSrc}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${article.name}</h2>
          <p>${article.color}</p>
          <p>${priceRecovery.price} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté :</p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
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

