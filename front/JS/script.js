/*--- Étape 2 : Manipuler l’API--- */

/* création d'une class avec constructor pour renvoyer les valeurs 
de toutes les propriétés énumérable avec la méthode Objet.assign() de un ou plusieurs objets sources vers une cible*/

class Article {
  constructor(jsonArticle) {
    jsonArticle && Object.assign(this, jsonArticle);
  }
}

// ADRESS API
const url = 'http://localhost:3000/api/products';

//----- Étape 3 : Insérer les produits dans la page d’accueil -----//

// fonction pour insertion des articles dans class "items"
function insertHtml(article) {
  /*Avec les littéraux de modèle, 
  on intègre "article" dans un espace réservé est représenté par ${}, 
  avec tout ce qui se trouve entre les accolades traitées comme du 
  JavaScript et tout ce qui se trouve en dehors des parenthèses traité comme une chaîne.
  Passage dans l'url de id=${article.id} pour récupération page produit*/
  return `<a href="product.html?id=${article._id}">
                                                      <article>
                                                        <img src="${article.imageUrl}" alt="${article.altTxt}">
                                                        <h3 class="productName">${article.name}</h3>
                                                        <p class="productDescription">${article.description}</p>
                                                      </article>
                                                      </a>`;
}

// créer une promess vers l'API avec fetch 
fetch(url)
  // Récupération des données en json
  .then((data) => data.json())
  // on récupère l'information que l'on traite avec une boucle
  .then((jsonListArticle) => {
    for (let jsonArticle of jsonListArticle) {
      // on récupére dans la variable article les informations de chaque produit de l'API qui vont être traités avec la class Article
      let article = new Article(jsonArticle);
      // insertion des informations dans la balise 'items' avec la fonction insertHtml qui prend article en argument
      document.querySelector('.items').innerHTML += insertHtml(article);
    }
  })
  // affichage message d'erreur en cas d'indisponibilité du serveur
  .catch(function () {
    document.querySelector(
      '#items'
    ).innerHTML += `<h2> Oops ! Une erreur est survenue, nous tentons de résoudre le problème au plus vite. Oops ! Une erreur est survenue, nous tentons de résoudre le problème au plus vite.</h2> 
                                                      <p> Vous pouvez envoyer un mail à l'un de nos commercial qui vous répondra dans les plus bref délais <a href="mailto:support@name.com"> : <strong>Contact</strong></a></p>`;
  });
