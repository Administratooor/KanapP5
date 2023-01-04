/* New Article (script.js) récupére sur let = article l'itération de jsonArticle (tableau)
en lui affectant les propriétés (object.assign(target , source)) si les 2 conditions
sont vraies avec this. */

class Article{
    constructor(jsonArticle){
        jsonArticle && Object.assign(this, jsonArticle);
    }
}