// ------------------- 1er Etape --------------------//  

// ADRESS API
let url ='http://localhost:3000/api/products' 
function insertHtml(article) {
  return `<a href="http://127.0.0.1:5000/front/html/product.html?id=${article._id}">
                                                      <article>
                                                        <img src="${article.imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
                                                        <h3 class="productName">${article.name}</h3>
                                                        <p class="productDescription">${article.description}</p>
                                                      </article>
                                                      </a>`;    
}
// /*  Request the data API, convert it to .json and receive each item in order via the for loop then inject it into the items tag | FR => |
// Requeter l'API de données, le convertir en .json et réceptionner chaque élément dans l'ordre via la boucle for puis l'injecter dans la balise items */
fetch(url)
// Extraction des données en json
  .then( data => data.json() )
// affichages des données (jsonListArticle ) avec l'exploration de l'objet (for of), et les assignés à la variable article en utilisant la class Article et son contructor.
  .then( jsonListArticle => {
    for ( let jsonArticle of jsonListArticle){
      let article = new Article(jsonArticle);
      //Ajout des données extraites dans la balise "items" avec innerHML et insertion des différents index récupérés du for of   
      document.querySelector('.items').innerHTML += insertHtml(article)                                                       
}});                                                 

