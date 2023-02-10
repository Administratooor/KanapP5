/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 8 : Afficher un tableau récapitulatif des achats dans la page Panier---------*/

const url = 'http://localhost:3000/api/products';
// const page = document.location.href;

/*----------------------------------------------------------------------------
            Parcourir le localStorage et injection des éléments
                  dans #cart__items via function insert 
------------------------------------------------------------------------------*/

function returnProductDom() {
  // Récuperer et parsé le localStorage et toutes les key
  for (let i = 0; i < localStorage.length; i++) {
    let localFound = localStorage.getItem(localStorage.key(i));
    let localParse = JSON.parse(localFound);
    // promess ver API pour récupérer le prix de maniére sécurisé
    fetch(url)
      // Extraction des données en json
      .then((data) => data.json())
      // retour de l'objet en JSON
      .then((dataFound) => {
        // boucle for of pour récupérer kes id
        for (let article of dataFound) {
          // si les id correspondent ont injecte les informations dans le DOM avec la fontion insert()
          if (article._id === localParse.id) {
            document.querySelector('#cart__items').innerHTML += insert(
              localParse,
              article
            );
            // on calcul le total des articles
            totalProduit();
          }
        }
        // ont donne la possibilitée de jouer les fonctions de suppréssion et de modification de la quantité
        changeQuantity();
        deleteProduct();
      });
  }
}

/*----------------------------------------------------------------------------
                Fonction pour innertHTML de #cart__items 
------------------------------------------------------------------------------*/
/* --insertion localParse provennant du localStorage ( pour les informations non sensible)
---- insertion de article via API pour sécurisé le prix*/
function insert(localParse, article) {
  return `<article class="cart__item" data-id="${localParse.id}" data-color="${localParse.color}">
  <div class="cart__item__img">
    <img src="${article.imageUrl}" alt="${article.description}">
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
// On joue la fonction
returnProductDom();

/*-------------------------------------------------------------------------------------------------*/
/* -------------Étape 9 : Gérer la modification et la suppression de produits dans la page Panier---------*/

//--------------------------------------------------------------
// fonction pour modifier la quantité dans le localStorage
//--------------------------------------------------------------

function changeQuantity() {
  // selection de la liste de noeuds
  const KanapArea = document.querySelectorAll('.cart__item');
  //  utilisation de la méthode nodeList pour appelle callback sur chaque éléments de cart__item
  KanapArea.forEach((KanapArea) => {
    // écoute de l'événement au change sur kanapArea et récupération de la valeur
    KanapArea.addEventListener('change', (e) => {
      //boucle sur les key du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        // stockage des key dans localFound
        let localFound = localStorage.getItem(localStorage.key(i));
        // Parse des key dans localParse
        let localParse = JSON.parse(localFound);
        /* déclaration des key du localStorage dans une variable*/
        let panier = localParse.id + '|' + localParse.color;
        // utilisation de la condition
        if (panier == KanapArea.dataset.id + '|' + KanapArea.dataset.color) {
          //  retourne la valeur d'un nombre arrondi à l'entier le plus proche dans la variable priceMatch
          let priceMath = Math.round(e.target.value);
          // on s'assure que la quantité du produit est bien entre 1 et 100 unité
          if (priceMath >= 1 && priceMath <= 100) {
            // assigner la quantité de priceMatch dans localStorage
            localParse.quantity = priceMath;
            // envoi des nouvelles valeurs dans localStorage
            localStorage.setItem(panier, JSON.stringify(localParse));
            // on recalcul le total
            totalProduit();
            // attention ! une alert est déclenché si la quantité saisie n'est pas bonne
          } else {
            alert('Attention les quantités sont comprises entre 1 et 100');
          }
        }
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
  /* boucle sur localStorage pour recupération de la quantity si le localStorage est > à 0*/
  //----------------- appel des quantités sur localStorage -----------//
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      let localFoundKey = localStorage.getItem(localStorage.key(i));
      // Parse de localFoundKey
      let localParseProduct = JSON.parse(localFoundKey);
      // Injection de la quantity du local storage
      totalProduct += localParseProduct.quantity;
      // Injection de la quantity dans le DOM
      document.getElementById('totalQuantity').textContent = totalProduct;

      //----------------- appel des prix sur API -----------//
      fetch(url)
        // Extraction des données en json
        .then((data) => data.json())
        // exploitation des donnés via une boucle for of
        .then((dataFound) => {
          for (let foundProduct of dataFound) {
            // Importation du prix dans la variable price pour plus de sécurité (importation du prix via l'API)
            let price = foundProduct.price;
            // si l'Id est identique à celui du localStorage ,on multiplie la quantité par le prix.
            if (foundProduct._id === localParseProduct.id) {
              totalPrice += localParseProduct.quantity * price;
              document.getElementById('totalPrice').textContent = totalPrice;
            }
          }
        })
        .catch(function () {
          console.log('test');
        });
    }
  } else {
    // On remet les éléments à 0
    document.getElementById('totalPrice').textContent = 0;
    document.getElementById('totalQuantity').textContent = 0;
  }
}

function deleteProduct() {
  // déclaration d'une variable pour écouter les supréssion
  const deleteButtons = document.querySelectorAll('.deleteItem');
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      /* element.closest nous permet de cibler un éléments supérieur du noeud 
      jusqu'à la racine avec le nom indiqué en paramétre */
      const deleteItem = deleteButton.closest('.cart__item');
      // on récupére les dataset pour cibler le bonne élément
      const localFound = localStorage.getItem(
        deleteItem.dataset.id + '|' + deleteItem.dataset.color
      );
      // si localFound est vrai ont le parse
      if (localFound) {
        const item = JSON.parse(localFound);
        /* si les dataset(id et color) et item(id et color) 
        sont identiques ont suprimme l'élément du localStorage 
        et on supprime la cart concérné du DOM et on re-calcul le total*/
        if (
          deleteItem.dataset.id === item.id &&
          deleteItem.dataset.color === item.color
        ) {
          localStorage.removeItem(item.id + '|' + item.color);
          deleteItem.remove();
          totalProduit();
        }
      }
    });
  });
}

// ------------------Étape 10 : Passer la commande ----------------- //

//---------- REGEX Contrôle Formulaire--------------//

// Déclaration des Regex pour utilisation dans les contrôles de form
let firstNameLastNameRegExp = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
let addressRegExp = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let cityRegExp = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,50}$/i;
let emailRegExp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/i;

// Déclaration des variables pour utilisation dans les contrôles de form
const order = document.getElementById('order');
let form = document.querySelector('.cart__order__form');
let submit = document.querySelector('.cart__order__form__submit');

//------------ Validation du prénom  ------------//
form.firstName.addEventListener('change', function (e) {
  // on prévient le comportement par défault
  e.preventDefault();
  //on joue la function valideFirstName
  valideFirstname(this);
});

const valideFirstname = function (inputFirstName) {
  // Test de la Regex avec la value de inputFirstName
  let testFirstname = firstNameLastNameRegExp.test(inputFirstName.value);

  let firstNameValidate = document.getElementById('firstNameErrorMsg');
  let firstNameChangeColor = document.getElementById('firstName');

  if (testFirstname) {
    // on applique si vrai
    firstNameChangeColor.style.border = '4px solid green';
    firstNameValidate.textContent = 'Prénom valide';
    return true;
  } else {
    // on applique si false
    firstNameChangeColor.style.border = '4px solid red';
    firstNameValidate.textContent = "Merci d'inscrire un prénom valide";
    return false;
  }
};

//------------ Validation du nom ------------//
form.lastName.addEventListener('change', function (e) {
  e.preventDefault();
  valideLastName(this);
});

const valideLastName = function (inputLastName) {
  let testLastName = firstNameLastNameRegExp.test(inputLastName.value);

  let lastNameChangeColor = document.getElementById('lastName');
  let LastNameValidate = document.getElementById('lastNameErrorMsg');

  if (testLastName) {
    lastNameChangeColor.style.border = '4px solid green';
    LastNameValidate.textContent = 'Nom valide';
    return true;
  } else {
    lastNameChangeColor.style.border = '4px solid red';
    LastNameValidate.textContent = "Merci d'inscrire un nom valide";
    return false;
  }
};

//------------ Validation de l'adresse ------------//
form.address.addEventListener('change', function (e) {
  e.preventDefault();
  valideAddress(this);
});

const valideAddress = function (inputAddress) {
  let testAddress = addressRegExp.test(inputAddress.value);

  let addressValidate = document.getElementById('addressErrorMsg');
  let addressChangeColor = document.getElementById('address');

  if (testAddress) {
    addressChangeColor.style.border = '4px solid green';
    addressValidate.textContent = 'Adresse valide';
    return true;
  } else {
    addressChangeColor.style.border = '4px solid red';
    addressValidate.textContent = "Merci d'inscrire une adresse valide";
    return false;
  }
};

//------------ Validation ville ------------//
form.city.addEventListener('change', function (e) {
  e.preventDefault(e);
  valideCity(this);
});

const valideCity = function (inputCity) {
  let testCity = cityRegExp.test(inputCity.value);

  let cityValidate = document.getElementById('cityErrorMsg');
  let cityChangeColor = document.getElementById('city');
  if (testCity) {
    cityChangeColor.style.border = '4px solid green';
    cityValidate.textContent = 'Ville valide';
    return true;
  } else {
    cityChangeColor.style.border = '4px solid red';
    cityValidate.textContent = "Merci d'inscrire une ville valide";
    return false;
  }
};

//------------ Validation E-mail ------------//
form.email.addEventListener('change', function (e) {
  e.preventDefault();
  valideEmail(this);
});

const valideEmail = function (inputEmail) {
  let testEmail = emailRegExp.test(inputEmail.value);

  let emailValidate = document.getElementById('emailErrorMsg');
  let emailChangeColor = document.getElementById('email');
  if (testEmail) {
    emailChangeColor.style.border = '4px solid green';
    emailValidate.textContent = 'Email valide';
    return true;
  } else {
    emailChangeColor.style.border = '4px solid red';
    emailValidate.textContent = 'Veuillez renseigner une adresse Email valide';
    return false;
  }
};

// -------- Étape 11 : Afficher le numéro de commande --------*/

// ecoute de l'événement de soumission du formulaire
form.addEventListener('submit', function (e) {
  //on prévient le comportement par défaut du boutton pour le contrôler
  e.preventDefault();
  // si tout les champ du formulaire on pu être vérifier et que le localStorage et supérieur à 1 élément
  if (
    valideFirstname(form.firstName) &&
    valideLastName(form.lastName) &&
    valideAddress(form.address) &&
    valideCity(form.city) &&
    valideEmail(form.email) &&
    localStorage.length > 0
  ) {
    // on envoi la commande
    envoiPaquet();
    // si le panier n'est pas remplie d'au moins 1 produit
  } else {
    alert('Erreur, merci de renseigner 1 produit au minimum');
  }
});

// déclaration d'un tableau qui acceuillera les id des produits
let commandeProduct = [];

function produitSend() {
  // boucle sur les clefs pour obtenir les id
  for (i = 0; i < localStorage.length; i++) {
    let itemId = localStorage.getItem(localStorage.key(i));
    let myProduct = JSON.parse(itemId);
    // on récupère en passant les id de chaque produit pour les injecter dans le tableau
    commandeProduct.push(myProduct.id);
  }
}

// preparation de la commande -> contact + produits
function paquet() {
  paquetPost = {
    contact: {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
    },
    products: commandeProduct,
  };
}

function envoiPaquet() {
  // on déclenche la fontion
  paquet();
  // remise des information à l'API pour récéption order.Id
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // selection paquetPost et transformation en chaine de caractères
    body: JSON.stringify(paquetPost),
  })
    // Quand l'objet reviens , convertir en json
    .then((res) => res.json())

    .then((data) => {
      // redirection vers la page de confirmation avec l'insertion de data.orderId dans url
      window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
    })
    // en cas d'erreur
    .catch(function (err) {
      alert('erreur');
    });
}
