fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => addProducts(data))



function addProducts(donnees) {
    
    const imageUrl = donnees[0].imageUrl

    const produits = document.createElement("a")
    produits.href = imageUrl
    produits.text = "Photo d'un canapé bleu"
    const items = document.querySelector("#items")
    if (items != null) {
        items.appendChild(produits)
    }
}