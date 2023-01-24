/*--- Étape 2 : Manipuler l’API--- */

/* New Article (script.js) récupére sur let = article l'itération de jsonArticle (tableau)
en lui affectant les propriétés (object.assign(target , source)) si les 2 conditions
sont vraies avec this. */

class Article {
  constructor(jsonArticle) {
    jsonArticle && Object.assign(this, jsonArticle);
  }
}

// ADRESS API
const url = 'http://localhost:3000/api/products';

/*---Étape 3 : Insérer les produits dans la page d’accueil---*/

// 1.fonction pour insertion des article dans class "items"
function insertHtml(article) {
  return `<a href="product.html?id=${article._id}">
                                                      <article>
                                                        <img src="${article.imageUrl}" alt="${article.altTxt}">
                                                        <h3 class="productName">${article.name}</h3>
                                                        <p class="productDescription">${article.description}</p>
                                                      </article>
                                                      </a>`;
}

/*---Étape 3 : Insérer les produits dans la page d’accueil---*/

// /*  Request the data API, convert it to .json and receive each item in order via the for loop then inject it into the items tag | FR => |
// Requeter l'API de données, le convertir en .json et réceptionner chaque élément dans l'ordre via la boucle for puis l'injecter dans la balise items */
fetch(url)
  // Extraction des données en json
  .then((data) => data.json())
  // affichages des données (jsonListArticle ) avec l'exploration de l'objet (for of), et les assignés à la variable article en utilisant la class Article et son contructor.
  .then((jsonListArticle) => {
    for (let jsonArticle of jsonListArticle) {
      let article = new Article(jsonArticle);
      //Ajout des données extraites dans la balise "items" avec innerHML et insertion des différents index récupérés du for of
      document.querySelector('.items').innerHTML += insertHtml(article);
    }
  })

  .catch(function () {
    document.querySelector(
      '#items'
    ).innerHTML += `<h2> Oops ! Une erreur est survenue, nous tentons de résoudre le problème au plus vite.</h2> 
                                                      <p> Vous pouvez envoyer un mail à l'un de nos commercial qui vous répondra dans les plus bref délais <a href="mailto:support@name.com"> : <strong>Contact</strong></a></p>`;
  });
