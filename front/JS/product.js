
/*---Étape 4 : Faire le lien entre un produit de la page
d’accueil et la page Produit---*/

//1.Récupératon de la chaîne de requête dans l'url*/ 
const queryString_url_id = window.location.search;
console.log(queryString_url_id);

/*---Étape 5 : Récupérer l’id du produit à afficher---*/ 
//Enlever le ? de queryString_url_id

//1.Méthode 1 - > Extraire juste l'id avec slice */
/*const idProduct = queryString_url_id.slice(1);
console.log(idProduct);*/ 

//2.Méthode 2 - > Extraire l'id avec urlSearchParams 
const idProduct = new URLSearchParams(queryString_url_id);
console.log(idProduct);

const idResult = idProduct.get("id");
console.log(idResult);

/*---Étape 6 : Insérer un produit et ses détails dans la page
Produit---*/ 
// 1. Block de code pour insertion Html + variables correspondantes 
function addProduct(product) {
    document.querySelector(".item__img").innerHTML += `<img src=${product.imageUrl}>`;
    document.querySelector("#title").innerHTML += `${product.name}`;
    document.querySelector("#price").innerHTML += `${product.price}`;
    document.querySelector("#description").innerHTML += `${product.description}`
    // A TERMINER !!!! 
    document.querySelector("#colors").innerHTML += `<option value=${product.colors[0]}>${product.colors[0]}</option>
    <option value=${product.colors[1]}>${product.colors[1]}</option><option value=${product.colors}>${product.colors[3]}</option>`
};


/*---Étape 6 :Appeler l'API avec promess pour récupérer les données du produit---*/ 
//1.Promess pour récupération du produit concerné par idResult 
fetch ('http://localhost:3000/api/products/'+ idResult)
    .then((res) => res.json())
    .then(product => {
        addProduct(product)})
// 2.Message d'erreur > contact service commercial  
    .catch(function(){
        document.querySelector(".item__img").innerHTML += `<h2>Oops ! L'affichage des détails du produit est introuvable.</h2> 
                                                            <p>Envoyer un mail à l'un de nos commercial qui vous répondra dans les plus bref délais <a href="mailto:support@name.com"> Contact </a></p>`;
    });



