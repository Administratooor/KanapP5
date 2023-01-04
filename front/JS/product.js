/*---------Mémo ID Produit-----------*/ 

// const id = [
//     _id_1 = "107fb5b75607497b96722bda5b504926",
//     _id_2 = "415b7cacb65d43b2b5c1ff70f3393ad1",
//     _id_3 = "055743915a544fde83cfdfc904935ee7",
//     _id_4 = "a557292fe5814ea2b15c6ef4bd73ed83",
//     _id_5 = "8906dfda133f4c20a9d0e34f18adcf06",
//     _id_6 = "77711f0e466b4ddf953f677d30b0efc9",
//     _id_7 = "034707184e8e4eefb46400b5a3774b5f",
//     _id_8 = "a6ec5b49bd164d7fbe10f37b6363f9fb"
//   ]


// Récupératon de la chaîne de requête dans l'url 

const queryString_url_id = window.location.search;
console.log(queryString_url_id);

/* Enlever le ? de queryString_url_id 

Méthode 1 - > Extraire juste l'id avec slice */
/*const idProduct = queryString_url_id.slice(1);
console.log(idProduct);*/ 

//   Méthode 2 - > Extraire l'id avec urlSearchParams*/
const idProduct = new URLSearchParams(queryString_url_id);
console.log(idProduct);

const idResult = idProduct.get("id");
console.log(idResult);



// Appeler l'API avec promess pour récupérer les données du produit 
fetch ('http://localhost:3000/api/products/'+ idResult)
    .then((res) => res.json())
    .then((data => {
        console.log(data);
        for(let json of data){
            let product = new Article(json);
            console.log(product);
            let product_id = product._id;
            if (product_id == idResult){
               document.querySelector(".item__img").innerHTML += ` <img src="${product.imageUrl}">`;
               document.querySelector("#title").innerHTML += `${product.name}`;
               document.querySelector("#price").innerHTML += `${product.price}`;
               document.querySelector("#description").innerHTML += `${product.description}`;
            //    document.querySelector("#colors").innerHTML += `<option value="${product.colors[0]}">${product.colors[0]}</option>
            //    <option value="${product.colors[1]}">${product.colors[1]}</option><option value="${product.colors[2]}">${product.colors[2]}</option>`;
            }
        }
    }))
    .catch(function(result){
        console.log(result);
    });

    