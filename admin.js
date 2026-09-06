document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONNEXION ADMIN
    // ==========================================

    const ADMIN_CODE = "NewCodeODWeuz";

    const adminLogin = document.getElementById("adminLogin");
    const adminPassword = document.getElementById("adminPassword");
    const loginButton = document.getElementById("loginButton");
    const loginError = document.getElementById("loginError");


    // Bloquer le défilement tant que le code n'est pas entré
    document.body.style.overflow = "hidden";


    // ==========================================
    // ÉLÉMENTS DU DASHBOARD
    // ==========================================

    const ordersList = document.getElementById("ordersList");
    const totalOrders = document.getElementById("totalOrders");
    const totalRevenue = document.getElementById("totalRevenue");
    const totalCustomers = document.getElementById("totalCustomers");
    const refreshButton = document.getElementById("refreshOrders");


    // ==========================================
    // CHARGER LES COMMANDES
    // ==========================================

    async function loadOrders() {

        try {

            const response = await fetch(
                "http://localhost:3000/api/orders"
            );

            if (!response.ok) {
                throw new Error(
                    "Impossible de récupérer les commandes."
                );
            }

            const orders = await response.json();

            displayOrders(orders);
            updateStats(orders);

        } catch (error) {

            console.error(error);

            ordersList.innerHTML = `
                <div class="empty">

                    <i class="bi bi-exclamation-triangle"
                       style="font-size:40px;color:#dc3545;">
                    </i>

                    <p>
                        Impossible de charger les commandes.
                    </p>

                    <small>
                        Vérifiez que le serveur est lancé.
                    </small>

                </div>
            `;
        }
    }


    // ==========================================
    // BOUTON DE CONNEXION
    // ==========================================

    loginButton.addEventListener("click", function () {

        if (adminPassword.value === ADMIN_CODE) {

            // Cacher l'écran de connexion
            adminLogin.style.display = "none";

            // Autoriser le défilement
            document.body.style.overflow = "auto";

            // Charger les commandes seulement maintenant
            loadOrders();

        } else {

            loginError.style.display = "block";

            adminPassword.value = "";

            adminPassword.focus();

        }

    });


    // Entrée = connexion
    adminPassword.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            loginButton.click();
        }

    });


    // ==========================================
    // AFFICHER LES COMMANDES
    // ==========================================

    function displayOrders(orders) {

        if (!orders || orders.length === 0) {

            ordersList.innerHTML = `
                <div class="empty">

                    <i class="bi bi-cart-x"
                       style="font-size:45px;">
                    </i>

                    <p>
                        Aucune commande pour le moment.
                    </p>

                </div>
            `;

            return;
        }


        // Plus récentes en premier
        orders.sort((a, b) => b.id - a.id);


        ordersList.innerHTML = "";


        orders.forEach(order => {

            const date = new Date(order.date);

            const formattedDate = date.toLocaleString(
                "fr-FR",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );


            let productsHTML = "";


            order.products.forEach(product => {

                const quantity = product.quantity || 1;

                const productTotal =
                    Number(product.price) * quantity;


                productsHTML += `
                    <div class="product-item">

                        <span>
                            ${escapeHTML(product.name)}
                            × ${quantity}
                        </span>

                        <strong>
                            ${productTotal.toLocaleString("fr-FR")}
                            FCFA
                        </strong>

                    </div>
                `;

            });


            const orderHTML = `

                <div class="order-card">

                    <div class="order-top">

                        <div>

                            <div class="order-id">
                                Commande #${order.id}
                            </div>

                            <small class="text-muted">
                                ${formattedDate}
                            </small>

                        </div>


                        <button
                            class="delete-btn"
                            onclick="deleteOrder(${order.id})">

                            <i class="bi bi-trash"></i>
                            Supprimer

                        </button>

                    </div>


                    <div class="customer-info">

                        <strong>
                            <i class="bi bi-person"></i>
                            ${escapeHTML(order.customer.name)}
                        </strong>

                        <br>

                        <i class="bi bi-telephone"></i>
                        ${escapeHTML(order.customer.phone)}

                        <br>

                        <i class="bi bi-geo-alt"></i>
                        ${escapeHTML(order.customer.address)}

                    </div>


                    <h5>
                        <i class="bi bi-box"></i>
                        Produits
                    </h5>


                    ${productsHTML}


                    <div class="order-total">

                        Total :
                        ${Number(order.total).toLocaleString("fr-FR")}
                        FCFA

                    </div>

                </div>
            `;


            ordersList.insertAdjacentHTML(
                "beforeend",
                orderHTML
            );

        });

    }


    // ==========================================
    // STATISTIQUES
    // ==========================================

    function updateStats(orders) {

        totalOrders.textContent = orders.length;


        const revenue = orders.reduce(
            (total, order) => {

                return total + Number(
                    order.total || 0
                );

            },
            0
        );


        totalRevenue.textContent =
            revenue.toLocaleString("fr-FR") +
            " FCFA";


        const customers = new Set(
            orders.map(
                order => order.customer.phone
            )
        );


        totalCustomers.textContent =
            customers.size;

    }


    // ==========================================
    // BOUTON ACTUALISER
    // ==========================================

    refreshButton.addEventListener(
        "click",
        loadOrders
    );


    // ==========================================
    // SUPPRIMER UNE COMMANDE
    // ==========================================

    window.deleteOrder = async function(id) {

        const confirmation = confirm(
            "Voulez-vous vraiment supprimer cette commande ?"
        );


        if (!confirmation) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:3000/api/orders/${id}`,
                {
                    method: "DELETE"
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message
                );

            }


            alert("Commande supprimée.");


            loadOrders();


        } catch (error) {

            console.error(error);

            alert(
                "Impossible de supprimer la commande."
            );

        }

    };


    // ==========================================
    // PROTECTION HTML
    // ==========================================

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value ?? "";

        return div.innerHTML;

    }

});