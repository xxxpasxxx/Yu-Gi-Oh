const URL = "https://db.ygoprodeck.com/api/v7/cardinfo.php";
const container = document.getElementById("Home");

fetch(URL)
    .then(response => response.json())
    .then(data => {
        const cardsArray = data.data;
        const cardArraySliced = cardsArray.slice(0, 100);

        const createCard = (dataItem) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("data-id", dataItem.id);
            card.innerHTML = `
                <img src=${dataItem.card_images[0].image_url}>
                ${dataItem.name}
            `;

            return card;
        };

        const inputText = document.getElementById("InputText");
        inputText.addEventListener("input", function() {
            const searchText = inputText.value.toLowerCase();
            if (searchText === "") {
                container.innerHTML = "";
                cardArraySliced.forEach(dataItem => {
                    const card = createCard(dataItem);
                    container.appendChild(card);
                });
            } else {
                const filteredCards = cardsArray.filter(card => card.name.toLowerCase().includes(searchText));
                container.innerHTML = "";
                filteredCards.forEach(dataItem => {
                    const card = createCard(dataItem);
                    container.appendChild(card);
                });
            }
        });

        cardArraySliced.forEach(dataItem => {
            const card = createCard(dataItem);
            container.appendChild(card);
        });
    });

container.addEventListener("click", function(event) {
    const cardClicked = event.target.closest(".card");
    if (cardClicked) {
        const cardID = cardClicked.getAttribute("data-id");
        fetchCardDetails(cardID);
    }
});

function fetchCardDetails(cardID) {
    const urlCard = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardID}`;
    fetch(urlCard)
    .then(response => response.json())
    .then(details => {
        const card = details.data[0];
        const detailsContainer = document.getElementById("CardsDetails");

        detailsContainer.innerHTML = `
            <span id="closeBTN">&times;</span>
            <div><img src=${card.card_images[0].image_url} alt="${card.name}"></div>
            <div><h1>${card.name} - ${card.frameType}</h1></div>
            <p style="font-weight: bold;">Description:</p>
            <p>${card.desc}</p>
        `;

        detailsContainer.style.display = "block";

        document.getElementById("closeBTN").addEventListener("click", () => {
            detailsContainer.style.display = "none";
        });
    })
    .catch(error => console.error('Errore nel recupero dei dati della carta', error));
}

function fetchCardDetails(cardID) {
    const urlCard = `https://db.ygoprodeck.com/api/v7/cardinfo.php?id=${cardID}`;
    fetch(urlCard)
    .then(response => response.json())
    .then(details => {
        const card = details.data[0];
        
        const existingPopup = document.querySelector(".details-popup");
        if (existingPopup) {
            existingPopup.remove();
        }

        const detailsPopup = document.createElement("div");
        detailsPopup.classList.add("details-popup");
        detailsPopup.innerHTML = `
            <span id="closeBTN">&times;</span>
            <div><img src=${card.card_images[0].image_url} alt="${card.name}"></div>
            <div><h1>${card.name} - ${card.frameType}</h1></div>
            <p style="font-weight: bold;">Description:</p>
            <p>${card.desc}</p>
        `;

        document.body.appendChild(detailsPopup);

        detailsPopup.querySelector("#closeBTN").addEventListener("click", () => {
            detailsPopup.remove();
        });
    })
    .catch(error => console.error('Errore nel recupero dei dati della carta', error));
}