const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());


// Servir les fichiers du site
app.use(express.static(__dirname));


// =====================================================
// FICHIER DES COMMANDES
// =====================================================

const ordersFile =
    path.join(__dirname, "orders.json");


// Créer orders.json s'il n'existe pas
if (!fs.existsSync(ordersFile)) {

    fs.writeFileSync(
        ordersFile,
        "[]",
        "utf8"
    );

}


// =====================================================
// RECEVOIR UNE COMMANDE
// =====================================================

app.post(
    "/api/orders",
    function (req, res) {

        try {

            const order =
                req.body;


            // -----------------------------------------
            // VÉRIFICATION
            // -----------------------------------------

            if (!order.customer) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Informations client manquantes."

                });

            }


            if (
                !order.customer.name ||
                !order.customer.phone ||
                !order.customer.address
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Veuillez remplir toutes les informations de livraison."

                });

            }


            if (
                !Array.isArray(order.products) ||
                order.products.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Le panier est vide."

                });

            }


            // -----------------------------------------
            // LIRE LES COMMANDES EXISTANTES
            // -----------------------------------------

            let orders = [];

            try {

                const fileContent =
                    fs.readFileSync(
                        ordersFile,
                        "utf8"
                    );

                orders =
                    JSON.parse(fileContent);

            }

            catch (error) {

                orders = [];

            }


            // -----------------------------------------
            // CRÉER UNE COMMANDE
            // -----------------------------------------

            const newOrder = {

                id:
                    Date.now(),

                customer: {

                    name:
                        order.customer.name,

                    phone:
                        order.customer.phone,

                    address:
                        order.customer.address

                },

                products:
                    order.products,

                total:
                    order.total,

                date:
                    new Date().toISOString()

            };


            // -----------------------------------------
            // AJOUTER LA COMMANDE
            // -----------------------------------------

            orders.push(newOrder);


            // -----------------------------------------
            // SAUVEGARDER
            // -----------------------------------------

            fs.writeFileSync(

                ordersFile,

                JSON.stringify(
                    orders,
                    null,
                    2
                ),

                "utf8"

            );


            // -----------------------------------------
            // RÉPONSE
            // -----------------------------------------

            console.log(
                "Nouvelle commande :",
                newOrder
            );


            res.status(201).json({

                success: true,

                message:
                    "Commande enregistrée avec succès.",

                orderId:
                    newOrder.id

            });

        }

        catch (error) {

            console.error(
                "Erreur serveur :",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Erreur interne du serveur."

            });

        }

    }
);

app.get("/api/orders", (req, res) => {

    try {

        const fileContent = fs.readFileSync(
            ordersFile,
            "utf8"
        );

        const orders = JSON.parse(fileContent);

        res.json(orders);

    } catch (error) {

        console.error("Erreur lecture commandes :", error);

        res.status(500).json({
            success: false,
            message: "Impossible de lire les commandes."
        });

    }

});

app.delete("/api/orders/:id", (req, res) => {

    try {

        const orderId = Number(req.params.id);

        const fileContent = fs.readFileSync(
            ordersFile,
            "utf8"
        );

        let orders = JSON.parse(fileContent);


        const oldLength = orders.length;


        orders = orders.filter(
            order => Number(order.id) !== orderId
        );


        if (orders.length === oldLength) {

            return res.status(404).json({
                success: false,
                message: "Commande introuvable."
            });

        }


        fs.writeFileSync(
            ordersFile,
            JSON.stringify(orders, null, 2),
            "utf8"
        );


        res.json({
            success: true,
            message: "Commande supprimée."
        });


    } catch (error) {

        console.error(
            "Erreur suppression :",
            error
        );

        res.status(500).json({
            success: false,
            message: "Erreur serveur."
        });

    }

});

// =====================================================
// DÉMARRER LE SERVEUR
// =====================================================

app.listen(
    PORT,
    function () {

        console.log(
            `Serveur lancé sur http://localhost:${PORT}`
        );

    }
);