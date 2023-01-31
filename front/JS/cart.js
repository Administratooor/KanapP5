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
            totalProduit();
          }
        }

        deleteProduct();
      });
  }
  changeQuantity();
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
  // selection de la liste de noeuds
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
          totalProduit();
        } // Re calcul du prix total
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

function deleteProduct() {
  const deleteButtons = document.querySelectorAll('.deleteItem');
  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', () => {
      const deleteItem = deleteButton.closest('.cart__item');
      const localFound = localStorage.getItem(
        deleteItem.dataset.id + '|' + deleteItem.dataset.color
      );
      if (localFound) {
        const item = JSON.parse(localFound);
        if (
          deleteItem.dataset.id === item.id &&
          deleteItem.dataset.color === item.color
        ) {
          localStorage.removeItem(item.id + '|' + item.color);
          deleteItem.remove();
          totalProduit();
          window.location.reload();
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
let cityRegExp = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
let emailRegExp = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/i;

// Déclaration des variables pour utilisation dans les contrôles de form
const order = document.getElementById('order');
let form = document.querySelector('.cart__order__form');
let submit = document.querySelector('.cart__order__form__submit');

//------------ Validation du prénom  ------------//
form.firstName.addEventListener('change', function (e) {
  e.preventDefault();
  valideFirstname(this);
});
const valideFirstname = function (inputFirstName) {
  let testFirstname = firstNameLastNameRegExp.test(inputFirstName.value);

  let firstNameValidate = document.getElementById('firstNameErrorMsg');
  let firstNameChangeColor = document.getElementById('firstName');

  if (testFirstname) {
    firstNameChangeColor.style.border = '4px solid green';
    firstNameValidate.textContent = 'Prénom valide';
    return true;
  } else {
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

/*------- Envoi de la commande et informations client --------*/

form.addEventListener('submit', function (e) {
  e.preventDefault();
  // if (
  //   valideFirstname(form.valideFirstname) &&
  //   valideLastName(form.valideLastName) &&
  //   valideAddress(form.valideAddress) &&
  //   valideCity(form.valideCity) &&
  //   valideEmail(form.valideEmail) === true
  // ) {
  order.style.background = 'green';
  form.textContent = 'Merci pour votre commande !';
  // localStorage.setItem('formulaireValues', JSON.stringify(formulaireValues));
  // form.submit();
  // } else {
  // }
});

// Création d'une classe avec un constructor pour définir les objet dans lesquel iront les values du formulaire
class Formulaire {
  constructor() {
    this.firstName = document.getElementById('firstName').value;
    this.lastName = document.getElementById('lastName').value;
    this.address = document.getElementById('address').value;
    this.city = document.getElementById('city').value;
    this.email = document.getElementById('email').value;
  }
}

const formulaireValues = new Formulaire();

const prenom = formulaireValues.firstName;
const nom = formulaireValues.lastName;
const adress = formulaireValues.address;
const ville = formulaireValues.city;
/*------ Mettre le contenu du LS dans les champs du formulaire ------*/
// Récupération dans localStorage du formulaire saisie
const dataLocalStorage = localStorage.getItem('formulaireValues');
//Parse du localStorage pour exploitation de l'objet
const dataLsParse = JSON.parse(dataLocalStorage);

// Fonction pour réinjecter automatiquement les valeurs enregistrés dans LS
// function remplirChamp(input) {
//   document.querySelector(`#${input}`).value = dataLsParse[input];
// }
// On joue la fonction avec en paramétre les valeurs des querySelector concernés
// remplirChamp('firstName');
// remplirChamp('lastName');
// remplirChamp('address');
// remplirChamp('city');
// remplirChamp('email');
