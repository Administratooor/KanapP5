/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 8 : Afficher un tableau récapitulatif des achats dans la page Panier---------*/

const url = 'http://localhost:3000/api/products';

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
        changeQuantity();
        deleteProduct();
      });
  }
  totalProduit();
}

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
returnProductDom();

/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 9 : Gérer la modification et la suppression de produits dans la page Panier---------*/

//--------------------------------------------------------------
// fonction pour modifier la quantité dans le localStorage
//--------------------------------------------------------------

function changeQuantity() {
  // selection de la list de noeuds
  const KanapArea = document.querySelectorAll('.cart__item');
  //  utilisation de la méthode nodeList pour appelle callback sur chaque éléments de cart__item
  KanapArea.forEach((KanapArea) => {
    // Appel de l'événement au change sur kanapArea et récupération de la valeur
    KanapArea.addEventListener('change', (e) => {
      //boucle sur les key du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        // stockage des key dans localFound
        let localFound = localStorage.getItem(localStorage.key(i));
        // Parse des key dans localParse
        let localParse = JSON.parse(localFound);
        // utilisation des valeurs pour création de la condition qui pointe le produit ayant le méme id et color que dataset
        let panier = localParse.id + '|' + localParse.color;
        // utilisation de la condition
        if (panier == KanapArea.dataset.id + '|' + KanapArea.dataset.color) {
          //  retourne la valeur d'un nombre arrondi à l'entier le plus proche dans la variable priceMatch
          let priceMath = Math.round(e.target.value);
          // assigner la quantité de priceMatch dans localStorage
          localParse.quantity = priceMath;
          // envoi des nouvelle valeur dans localStorage
          localStorage.setItem(panier, JSON.stringify(localParse));
          console.log(localParse);
        }
      }

      // Re calcul du prix total
      totalProduit();
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

function deleteProduct() {
  const deleteKanap = document.querySelectorAll('.deleteItem');

  deleteKanap.forEach((deleteKanap) => {
    deleteKanap.addEventListener('click', () => {
      for (const greyback of document.getElementsByClassName('deleteItem')) {
        let deleteItem = greyback.closest('.cart__item');

        let localFound = localStorage.getItem(
          deleteItem.dataset.id + '|' + deleteItem.dataset.color
        );
        let localParse = JSON.parse(localFound);
        console.log(localParse);

        for (item of localFound) {
          if (
            deleteItem.dataset.id !== item.id &&
            deleteItem.dataset.color !== item.color
          ) {
            //si l'article ajouté correspond à un article du panier
            deleteItem.remove();
            localStorage.removeItem(localParse.id + '|' + localParse.color);
            location.reload(); // modifier sa quantité
            return; //mettre fin à la fonction
          } else {
            console.log(localParse.id + '|' + localParse.color);
          }
        }
      }
    });
  });

  totalProduit();
}

// ------------------Étape 10 : Passer la commande -----------------
