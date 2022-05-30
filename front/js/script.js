fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => addProducts(data))



function addProducts(donnees) {
  
    donnees.forEach((canapé) => {

        const {_id, imageUrl, altTxt, name, description } = canapé

        const image = makeImage(imageUrl, altTxt)
        const produits = makeProduits(_id)
        const article = makeArticle(image)
        const h3 = makeH3(name)
        const p = makeParagraph(description)

        article.appendChild(image)
        article.appendChild(h3)
        article.appendChild(p)
        appendChildren(produits, article)
    })
}


function makeProduits(_id) {

    const produits = document.createElement("a")
    produits.href = "./product.html?id=" + _id
    produits.classList.add("itemsA")
    return produits
}


function appendChildren(produits, article) {

    const items = document.querySelector("#items")

    if (items != null) {
        items.appendChild(produits)
        produits.appendChild(article)

    }

}


function makeImage(imageUrl, altTxt) {

    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    image.classList.add("itemsArticleImg")
    return image
}


function makeArticle(image) {

    const article = document.createElement("article")
    article.classList.add("itemsArticle")
    article.appendChild(image)
    document.body.appendChild(article)
    return article
}


function makeH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("itemsArticleH3")
    return h3
}

function makeParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("itemsArticleP")
    return p
}