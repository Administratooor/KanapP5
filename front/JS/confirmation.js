function returnIdCommande() {
  // nous ciblons la page confirmation
  if (document.location.href.match('confirmation')) {
    // clear du localStorage
    localStorage.clear();
    // Récupération du n° de commande dans l'url
    let idCommande = new URLSearchParams(document.location.search).get(
      'commande'
    );
    // Affichage du n° de commande dans le DOM et remerciement
    document.querySelector(
      '#orderId'
    ).innerHTML = `<br>${idCommande}<br> Merci pour votre achat `;
    // supression du n° de commande
    idCommande = undefined;
  } else {
    console.log('erreur');
  }
}
//on joue la fonction
returnIdCommande();
