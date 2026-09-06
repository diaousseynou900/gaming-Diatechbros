document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // VARIABLES
    // =====================================================

    let cart = [];
    let selectedProduct = null;

    // PANIER
    const cartModal = document.getElementById("cartModal");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.querySelector(".cart-count");
    const cartClose = document.getElementById("cartClose");
    const cartIcon = document.querySelector(".cart-icon");

    // FORMULAIRE CLIENT
    const customerName = document.getElementById("customerName");
    const customerPhone = document.getElementById("customerPhone");
    const deliveryAddress = document.getElementById("deliveryAddress");
    const checkoutButton = document.querySelector(".checkout-btn");

    // MODAL PRODUIT
    const productModal = document.getElementById("productModal");
    const productModalClose = document.getElementById("productModalClose");

    const modalProductImage =
        document.getElementById("modalProductImage");

    const modalProductName =
        document.getElementById("modalProductName");

    const modalProductDescription =
        document.getElementById("modalProductDescription");

    const modalProductPrice =
        document.getElementById("modalProductPrice");

    const modalAddToCart =
        document.getElementById("modalAddToCart");


    // =====================================================
    // AJOUTER AU PANIER
    // =====================================================

    document.querySelectorAll(".add-to-cart").forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const productCard =
                this.closest(".product-card");

            if (!productCard) return;

            const image =
                productCard.querySelector("img");

            const product = {

                name: this.dataset.name,

                price: Number(this.dataset.price),

                description:
                    this.dataset.description || "",

                image:
                    image ? image.src : ""

            };

            cart.push(product);

            updateCart();

            // Ouvrir automatiquement le panier
            cartModal.classList.add("active");

        });

    });


    // =====================================================
    // AFFICHER LE PANIER
    // =====================================================

    function updateCart() {

        cartItems.innerHTML = "";

        let total = 0;


        // PANIER VIDE
        if (cart.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Votre panier est vide.
                </p>
            `;

        }

        // PANIER AVEC PRODUITS
        else {

            cart.forEach(function (product, index) {

                total += product.price;

                const item =
                    document.createElement("div");

                item.className = "cart-item";

                item.innerHTML = `

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="cart-item-info">

                        <h4>${product.name}</h4>

                        <p>
                            CFA ${product.price.toLocaleString("fr-FR")}
                        </p>

                    </div>

                    <button
                        class="remove-item"
                        data-index="${index}"
                        type="button"
                        aria-label="Supprimer"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                `;

                cartItems.appendChild(item);

            });

        }


        // COMPTEUR
        cartCount.textContent = cart.length;


        // TOTAL
        cartTotal.textContent =
            "CFA " + total.toLocaleString("fr-FR");


        // =================================================
        // BOUTONS SUPPRIMER
        // =================================================

        document
            .querySelectorAll(".remove-item")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const index =
                        Number(this.dataset.index);

                    cart.splice(index, 1);

                    updateCart();

                });

            });

    }


    // =====================================================
    // OUVRIR LE PANIER
    // =====================================================

    if (cartIcon) {

        cartIcon.addEventListener("click", function () {

            cartModal.classList.add("active");

            updateCart();

        });

    }


    // =====================================================
    // FERMER LE PANIER
    // =====================================================

    if (cartClose) {

        cartClose.addEventListener("click", function () {

            cartModal.classList.remove("active");

        });

    }


    // Fermer en cliquant à l'extérieur
    if (cartModal) {

        cartModal.addEventListener("click", function (event) {

            if (event.target === cartModal) {

                cartModal.classList.remove("active");

            }

        });

    }


    // =====================================================
    // MODAL PRODUIT
    // =====================================================

    document
        .querySelectorAll(".product-card")
        .forEach(function (card) {

            const image =
                card.querySelector("img");

            const title =
                card.querySelector(".card-title");

            const price =
                card.querySelector(".price");

            const addButton =
                card.querySelector(".add-to-cart");


            if (!image) return;


            image.addEventListener("click", function () {

                const name =
                    addButton?.dataset.name ||
                    title?.textContent.trim() ||
                    "Produit";


                const productPrice =
                    addButton?.dataset.price ||
                    "0";


                const description =
                    addButton?.dataset.description ||
                    "Découvrez ce produit de qualité, conçu pour vous offrir une excellente expérience. Profitez d’un produit fiable, pratique et adapté à vos besoins.";


                selectedProduct = {

                    name: name,

                    price: Number(productPrice),

                    description: description,

                    image: image.src

                };


                // AFFICHER LES INFORMATIONS

                modalProductImage.src =
                    selectedProduct.image;

                modalProductImage.alt =
                    selectedProduct.name;


                modalProductName.textContent =
                    selectedProduct.name;


                modalProductDescription.textContent =
                    selectedProduct.description;


                modalProductPrice.textContent =
                    "CFA " +
                    selectedProduct.price.toLocaleString("fr-FR");


                // OUVRIR
                productModal.classList.add("active");

                document.body.style.overflow =
                    "hidden";

            });

        });


    // =====================================================
    // FERMER MODAL PRODUIT
    // =====================================================

    function closeProductModal() {

        productModal.classList.remove("active");

        document.body.style.overflow = "";

    }


    if (productModalClose) {

        productModalClose.addEventListener(
            "click",
            closeProductModal
        );

    }


    // Cliquer dehors
    if (productModal) {

        productModal.addEventListener(
            "click",
            function (event) {

                if (event.target === productModal) {

                    closeProductModal();

                }

            }
        );

    }


    // ESC
    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeProductModal();

            }

        }
    );


    // =====================================================
    // AJOUTER DEPUIS LE MODAL
    // =====================================================

    if (modalAddToCart) {

        modalAddToCart.addEventListener(
            "click",
            function () {

                if (!selectedProduct) return;


                const productCards =
                    document.querySelectorAll(
                        ".product-card"
                    );


                productCards.forEach(function (card) {

                    const button =
                        card.querySelector(
                            ".add-to-cart"
                        );

                    if (!button) return;


                    const buttonName =
                        button.dataset.name;


                    if (
                        buttonName ===
                        selectedProduct.name
                    ) {

                        button.click();

                    }

                });


                closeProductModal();

            }
        );

    }


    // =====================================================
    // PASSER LA COMMANDE
    // =====================================================

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            async function () {

                // -----------------------------------------
                // VÉRIFIER LE PANIER
                // -----------------------------------------

                if (cart.length === 0) {

                    alert(
                        "Votre panier est vide."
                    );

                    return;

                }


                // -----------------------------------------
                // RÉCUPÉRER LES INFORMATIONS
                // -----------------------------------------

                const name =
                    customerName.value.trim();

                const phone =
                    customerPhone.value.trim();

                const address =
                    deliveryAddress.value.trim();


                // -----------------------------------------
                // VÉRIFICATION
                // -----------------------------------------

                if (!name) {

                    alert(
                        "Veuillez entrer votre nom complet."
                    );

                    customerName.focus();

                    return;

                }


                if (!phone) {

                    alert(
                        "Veuillez entrer votre numéro de téléphone."
                    );

                    customerPhone.focus();

                    return;

                }


                if (!address) {

                    alert(
                        "Veuillez entrer votre adresse de livraison."
                    );

                    deliveryAddress.focus();

                    return;

                }


                // -----------------------------------------
                // CALCUL TOTAL
                // -----------------------------------------

                const total = cart.reduce(
                    function (sum, product) {

                        return sum + product.price;

                    },
                    0
                );


                // -----------------------------------------
                // DONNÉES DE LA COMMANDE
                // -----------------------------------------

                const order = {

                    customer: {

                        name: name,

                        phone: phone,

                        address: address

                    },

                    products: cart.map(
                        function (product) {

                            return {

                                name: product.name,

                                price: product.price,

                                image: product.image

                            };

                        }
                    ),

                    total: total,

                    date: new Date().toISOString()

                };


                // -----------------------------------------
                // BOUTON EN CHARGEMENT
                // -----------------------------------------

                const originalText =
                    checkoutButton.innerHTML;

                checkoutButton.disabled = true;

                checkoutButton.innerHTML = `
                    <i class="bi bi-hourglass-split"></i>
                    Envoi en cours...
                `;


                // -----------------------------------------
                // ENVOYER AU SERVER.JS
                // -----------------------------------------

                try {

                    const response =
    await fetch(
        "http://localhost:3000/api/orders",
                            {

                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(order)

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Erreur lors de la commande."
                        );

                    }


                    // -------------------------------------
                    // SUCCÈS
                    // -------------------------------------

                    alert(
                        "Commande envoyée avec succès ! Merci " +
                        name +
                        "."
                    );


                    // Vider panier
                    cart = [];

                    updateCart();


                    // Vider formulaire
                    customerName.value = "";

                    customerPhone.value = "";

                    deliveryAddress.value = "";


                    // Fermer panier
                    cartModal.classList.remove(
                        "active"
                    );


                }

                catch (error) {

                    console.error(
                        "Erreur :",
                        error
                    );


                    alert(
                        "Impossible d'envoyer la commande. Vérifiez que le serveur est bien lancé."
                    );

                }

                finally {

                    checkoutButton.disabled =
                        false;

                    checkoutButton.innerHTML =
                        originalText;

                }

            }
        );

    }


    // =====================================================
    // INITIALISATION
    // =====================================================

    updateCart();

});