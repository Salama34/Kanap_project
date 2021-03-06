const cart = [];


recupItems()
cart.forEach((item) => displayItem(item))

function recupItems() {
    const numberOfItems = localStorage.length
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item)
    article.appendChild(imageDiv)

    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)

    displayArticle(article)
    displayTotalPrice()
    displayTotalQuantity()

}

function displayTotalPrice() {
    let total = 0
    const totalPrice = document.querySelector("#totalPrice")

    cart.forEach(item => {
        const priceAdd = item.price * item.quantity
        total = priceAdd + total
    })
    totalPrice.textContent = total
}

function displayTotalQuantity() {
    total = 0
    const totalQuantity = document.querySelector("#totalQuantity")
    cart.forEach(item => {
        const quantityAdd = item.quantity
        total = quantityAdd + total
    })
    totalQuantity.textContent = total
}

function makeCartContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)

    return cartItemContent

}

function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}

function addDeleteToSettings(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item))
    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

function deleteItem(item) {
    const itemToDelete = cart.find(
        (product) => product.id === item.id && product.color === item.color
    )
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteData(item)
    deleteArticleHtml(item)
}

function deleteData(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)

}

function deleteArticleHtml(item) {
    const deleteArticle = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    deleteArticle.remove()
}

function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qt?? : "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.classList.add("itemQuantity")
    input.type = "number"
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updatePriceQuantity(item.id, input.value, item))

    quantity.appendChild(input)
    settings.appendChild(quantity)
}

function updatePriceQuantity(id, newValue, item) {
    const updateItem = cart.find((item) => item.id === id)
    updateItem.quantity = Number(newValue)
    item.quantity = updateItem.quantity
    displayTotalQuantity()
    displayTotalPrice()
    updateDataCart(item)
}

function updateDataCart(item) {

    const newData = JSON.stringify(item)
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, newData)
}

function makeDescription(item) {

    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name

    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")
    p2.textContent = item.price + "??"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)

    return description
}

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)

}

function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

function makeImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)

    return div
}


const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => envoiFormulaire(e))


function envoiFormulaire(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Votre panier est vide")
        return
    }

    if (validationFormulaire()) return
    if (validationMail()) return

    const body = makePageEnvoi()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
            

}

function validationFormulaire() {
    const formulaire = document.querySelector(".cart__order__form")
    const inputs = formulaire.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Veuillez remplir tout les champs")
            return true
        }
        return false
    })
}

function validationMail() {
    const mail = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(mail) === false) {
        alert("Addresse mail incorrecte")
        return true
    }
    return false
}


function makePageEnvoi() {

    const formulaire = document.querySelector(".cart__order__form")
    const firstName = formulaire.elements.firstName.value
    const lastName = formulaire.elements.lastName.value
    const address = formulaire.elements.address.value
    const city = formulaire.elements.city.value
    const email = formulaire.elements.email.value

    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: ajoutId()
    }
    return body
}


function ajoutId() {
    const qttProducts = localStorage.length
    const ids = []
    for (let i = 0; i < qttProducts; i++) {
        const key = localStorage.key(i)
        console.log(key)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}