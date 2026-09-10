document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // CONFIGURATION DU PANIER PARTAGÉ
    // =====================================================

    const CART_KEY = "diaTechbrosCart";

    let cart = [];
    let selectedProduct = null;

    // Charger le panier sauvegardé
    try {
        const savedCart = localStorage.getItem(CART_KEY);

        if (savedCart) {
            cart = JSON.parse(savedCart);
        }

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
        cart = [];
    }


    // Sauvegarder le panier
    function saveCart() {

        try {
            localStorage.setItem(
                CART_KEY,
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Erreur lors de la sauvegarde du panier :",
                error
            );

        }

    }


    // =====================================================
    // VARIABLES PANIER
    // =====================================================

    const cartModal =
        document.getElementById("cartModal");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");

    const cartCount =
        document.querySelector(".cart-count");

    const cartClose =
        document.getElementById("cartClose");

    const cartIcon =
        document.querySelector(".cart-icon");


    // =====================================================
    // FORMULAIRE CLIENT
    // =====================================================

    const customerName =
        document.getElementById("customerName");

    const customerPhone =
        document.getElementById("customerPhone");

    const deliveryAddress =
        document.getElementById("deliveryAddress");

    const checkoutButton =
        document.querySelector(".checkout-btn");


    // =====================================================
    // MODAL PRODUIT
    // =====================================================

    const productModal =
        document.getElementById("productModal");

    const productModalClose =
        document.getElementById("productModalClose");

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
    // FONCTION AJOUTER UN PRODUIT
    // =====================================================

    function addProductToCart(product) {

        if (!product) return;

        cart.push(product);

        // IMPORTANT :
        // Sauvegarder immédiatement
        saveCart();

        updateCart();

    }


    // =====================================================
    // AJOUTER AU PANIER DEPUIS UNE CARTE PRODUIT
    // =====================================================

    document
        .querySelectorAll(".add-to-cart")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const productCard =
                        this.closest(".product-card");

                    if (!productCard) return;


                    const image =
                        productCard.querySelector("img");


                    const product = {

                        name:
                            this.dataset.name || "Produit",

                        price:
                            Number(this.dataset.price) || 0,

                        description:
                            this.dataset.description || "",

                        image:
                            image ? image.src : ""

                    };


                    // Ajouter
                    addProductToCart(product);


                    // Ouvrir automatiquement le panier
                    if (cartModal) {

                        cartModal.classList.add("active");

                    }

                }
            );

        });


    // =====================================================
    // AFFICHER LE PANIER
    // =====================================================

    function updateCart() {

        if (!cartItems) return;


        cartItems.innerHTML = "";

        let total = 0;


        // =================================================
        // PANIER VIDE
        // =================================================

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Votre panier est vide.
                </p>
            `;

        }


        // =================================================
        // PANIER AVEC PRODUITS
        // =================================================

        else {

            cart.forEach(
                function (product, index) {

                    total += Number(product.price) || 0;


                    const item =
                        document.createElement("div");

                    item.className =
                        "cart-item";


                    item.innerHTML = `

                        <img
                            src="${product.image || ""}"
                            alt="${product.name || "Produit"}"
                        >

                        <div class="cart-item-info">

                            <h4>
                                ${product.name || "Produit"}
                            </h4>

                            <p>
                                CFA ${
                                    Number(product.price || 0)
                                    .toLocaleString("fr-FR")
                                }
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

                }
            );

        }


        // =================================================
        // COMPTEUR
        // =================================================

        if (cartCount) {

            cartCount.textContent =
                cart.length;

        }


        // =================================================
        // TOTAL
        // =================================================

        if (cartTotal) {

            cartTotal.textContent =
                "CFA " +
                total.toLocaleString("fr-FR");

        }


        // =================================================
        // BOUTONS SUPPRIMER
        // =================================================

        document
            .querySelectorAll(".remove-item")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(this.dataset.index);


                        if (
                            !Number.isNaN(index) &&
                            index >= 0 &&
                            index < cart.length
                        ) {

                            cart.splice(index, 1);

                            // IMPORTANT :
                            // Sauvegarder après suppression
                            saveCart();

                            updateCart();

                        }

                    }
                );

            });

    }


    // =====================================================
    // OUVRIR LE PANIER
    // =====================================================

    if (cartIcon && cartModal) {

        cartIcon.addEventListener(
            "click",
            function () {

                cartModal.classList.add("active");

                updateCart();

            }
        );

    }


    // =====================================================
    // FERMER LE PANIER
    // =====================================================

    if (cartClose && cartModal) {

        cartClose.addEventListener(
            "click",
            function () {

                cartModal.classList.remove("active");

            }
        );

    }


    // Fermer en cliquant à l'extérieur
    if (cartModal) {

        cartModal.addEventListener(
            "click",
            function (event) {

                if (event.target === cartModal) {

                    cartModal.classList.remove("active");

                }

            }
        );

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


            image.addEventListener(
                "click",
                function () {

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

                        name:
                            name,

                        price:
                            Number(productPrice) || 0,

                        description:
                            description,

                        image:
                            image.src

                    };


                    // =================================================
                    // AFFICHER LES INFORMATIONS
                    // =================================================

                    if (modalProductImage) {

                        modalProductImage.src =
                            selectedProduct.image;

                        modalProductImage.alt =
                            selectedProduct.name;

                    }


                    if (modalProductName) {

                        modalProductName.textContent =
                            selectedProduct.name;

                    }


                    if (modalProductDescription) {

                        modalProductDescription.textContent =
                            selectedProduct.description;

                    }


                    if (modalProductPrice) {

                        modalProductPrice.textContent =
                            "CFA " +
                            selectedProduct.price
                                .toLocaleString("fr-FR");

                    }


                    // Ouvrir modal
                    if (productModal) {

                        productModal.classList.add("active");

                        document.body.style.overflow =
                            "hidden";

                    }

                }
            );

        });


    // =====================================================
    // FERMER MODAL PRODUIT
    // =====================================================

    function closeProductModal() {

        if (productModal) {

            productModal.classList.remove("active");

        }

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


    // =====================================================
    // ESC
    // =====================================================

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


                // Ajouter directement le produit sélectionné
                addProductToCart(selectedProduct);


                // Ouvrir le panier
                if (cartModal) {

                    cartModal.classList.add("active");

                }


                // Fermer le modal
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
                    customerName
                        ? customerName.value.trim()
                        : "";

                const phone =
                    customerPhone
                        ? customerPhone.value.trim()
                        : "";

                const address =
                    deliveryAddress
                        ? deliveryAddress.value.trim()
                        : "";


                // -----------------------------------------
                // VÉRIFICATION
                // -----------------------------------------

                if (!name) {

                    alert(
                        "Veuillez entrer votre nom complet."
                    );

                    if (customerName) {

                        customerName.focus();

                    }

                    return;

                }


                if (!phone) {

                    alert(
                        "Veuillez entrer votre numéro de téléphone."
                    );

                    if (customerPhone) {

                        customerPhone.focus();

                    }

                    return;

                }


                if (!address) {

                    alert(
                        "Veuillez entrer votre adresse de livraison."
                    );

                    if (deliveryAddress) {

                        deliveryAddress.focus();

                    }

                    return;

                }


                // -----------------------------------------
                // CALCUL TOTAL
                // -----------------------------------------

                const total =
                    cart.reduce(
                        function (sum, product) {

                            return (
                                sum +
                                (Number(product.price) || 0)
                            );

                        },
                        0
                    );


                // -----------------------------------------
                // DONNÉES DE LA COMMANDE
                // -----------------------------------------

                const order = {

                    customer: {

                        name:
                            name,

                        phone:
                            phone,

                        address:
                            address

                    },


                    products:
                        cart.map(
                            function (product) {

                                return {

                                    name:
                                        product.name,

                                    price:
                                        product.price,

                                    image:
                                        product.image

                                };

                            }
                        ),


                    total:
                        total,


                    date:
                        new Date().toISOString()

                };


                // -----------------------------------------
                // BOUTON EN CHARGEMENT
                // -----------------------------------------

                const originalText =
                    checkoutButton.innerHTML;


                checkoutButton.disabled =
                    true;


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
                            "/api/orders",
                            {

                                method:
                                    "POST",

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


                    // IMPORTANT :
                    // Vider le panier ET le localStorage
                    cart = [];

                    saveCart();

                    updateCart();


                    // Vider formulaire
                    if (customerName) {

                        customerName.value = "";

                    }

                    if (customerPhone) {

                        customerPhone.value = "";

                    }

                    if (deliveryAddress) {

                        deliveryAddress.value = "";

                    }


                    // Fermer panier
                    if (cartModal) {

                        cartModal.classList.remove(
                            "active"
                        );

                    }

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
    // RECHERCHE PRODUITS
    // =====================================================

    const searchButton =
        document.querySelector(".search-button");

    const searchInput =
        document.getElementById("searchInput");

    const navbar =
        document.querySelector(".navbar");

    const navbarBrand =
        document.querySelector(".navbar-brand");


    if (searchButton && searchInput) {

        searchButton.addEventListener(
            "click",
            function () {

                // Sur téléphone
                if (window.innerWidth <= 600) {

                    if (navbar) {

                        navbar.classList.toggle(
                            "search-open"
                        );

                    }


                    if (
                        navbar &&
                        navbar.classList.contains(
                            "search-open"
                        )
                    ) {

                        // Faire disparaître le logo
                        if (navbarBrand) {

                            navbarBrand.style.display =
                                "none";

                        }


                        // Afficher recherche
                        searchInput.classList.add(
                            "active"
                        );

                        searchInput.focus();

                    }

                    else {

                        // Faire réapparaître le logo
                        if (navbarBrand) {

                            navbarBrand.style.display =
                                "";

                        }


                        // Fermer recherche
                        searchInput.classList.remove(
                            "active"
                        );

                        searchInput.value = "";

                        filterProducts("");

                    }

                }


                // Sur ordinateur
                else {

                    searchInput.classList.toggle(
                        "active"
                    );


                    if (
                        searchInput.classList.contains(
                            "active"
                        )
                    ) {

                        searchInput.focus();

                    }

                    else {

                        searchInput.value = "";

                        filterProducts("");

                    }

                }

            }
        );


        searchInput.addEventListener(
            "input",
            function () {

                filterProducts(
                    this.value
                );

            }
        );

    }


    // =====================================================
    // FILTRER LES PRODUITS
    // =====================================================

    function filterProducts(searchText) {

        const search =
            searchText
                .trim()
                .toLowerCase();


        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            function (card) {

                const title =
                    card.querySelector(
                        ".card-title"
                    );


                if (!title) return;


                const productName =
                    title.textContent
                        .trim()
                        .toLowerCase();


                const productContainer =
                    card.parentElement;


                if (!productContainer) return;


                if (
                    productName.includes(search)
                ) {

                    productContainer.style.display =
                        "";

                }

                else {

                    productContainer.style.display =
                        "none";

                }

            }
        );

    }


    // =====================================================
    // MENU ☰
    // =====================================================

    const menuButton =
        document.querySelector(
            ".menu-button"
        );

    const menuDropdown =
        document.querySelector(
            "#menuDropdown"
        );


    if (menuButton && menuDropdown) {

        menuButton.addEventListener(
            "click",
            function () {

                menuDropdown.classList.toggle(
                    "show"
                );

            }
        );


        // Fermer le menu après Contact
        const contactLink =
            menuDropdown.querySelector("a");


        if (contactLink) {

            contactLink.addEventListener(
                "click",
                function () {

                    menuDropdown.classList.remove(
                        "show"
                    );

                }
            );

        }

    }


    // =====================================================
    // SYNCHRONISATION DU PANIER ENTRE LES ONGLETS
    // =====================================================

    window.addEventListener(
        "storage",
        function (event) {

            if (event.key !== CART_KEY) return;


            try {

                cart =
                    event.newValue
                        ? JSON.parse(event.newValue)
                        : [];


                if (!Array.isArray(cart)) {

                    cart = [];

                }

            }

            catch (error) {

                cart = [];

            }


            updateCart();

        }
    );


    // =====================================================
    // INITIALISATION
    // =====================================================

    updateCart();

});