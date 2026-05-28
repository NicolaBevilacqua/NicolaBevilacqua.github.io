// DATI UTENTI
const utenti = [
    { nome:"Ludohfantastico", ruolo:"Cancelliere ad interim delle Aespa", punti:132, img:"Ludo.jpg" },
    { nome:"Felis", ruolo:"Il tupperaio matto", punti:170, img:"Felis.jpg" },
    { nome:"Manel", ruolo:"il Musicofilo", punti:180, img:"Manel.jpeg" },
    { nome:"Sosò", ruolo:"la voce della verità", punti:195, img:"Sofy.jpg" },
    { nome:"La Madrina", ruolo:"Ma dici vero?!", punti:445, img:"Giulia.png" },
    { nome:"Il SANTO", ruolo:"Ispiratore e protettore", punti:365, img:"diego.png" },
    { nome:"Alien", ruolo:" ", punti:70, img:"profilo.png" },
    { nome:"Giangiu", ruolo:" ", punti:140, img:"profilo.png" },
    { nome:"Mad", ruolo:" ", punti:235, img:"profilo.png" },
    { nome:"herzlos", ruolo:"THE BOSS", punti:390, img:"herzlos.png" },
    { nome:"Pyro", ruolo:" ", punti:95, img:"profilo.png" },
    { nome:"Cho", ruolo:" ", punti:265, img:"profilo.png" },
    { nome:"veve ga Kill!", ruolo:"si va in scena", punti:360, img:"Velia.jpeg" },
    { nome:"Roman", ruolo:" ", punti:160, img:"profilo.png" },
    { nome:"Lunatica", ruolo:"WINX FATA GUARDIANA DEL LUNAPARK", punti:190, img:"miri.jpg" },
    { nome:"Spartaco", ruolo:" ", punti:100, img:"profilo.png" },
    { nome:"andrea", ruolo:" ", punti:225, img:"profilo.png" },
    { nome:"MidNaight", ruolo:" ", punti:335, img:"profilo.png" },
    { nome:"Guido", ruolo:" ", punti:190, img:"profilo.png" },
    { nome:"Samuel", ruolo:" ", punti:160, img:"profilo.png" },
    { nome:"Aself", ruolo:" ", punti:80, img:"profilo.png" },
    { nome:"Miki", ruolo:" ", punti:50, img:"profilo.png" },
    { nome:"Giovanni", ruolo:" ", punti:40, img:"profilo.png" },
];

// ORDINA PER PUNTI
utenti.sort((a,b) => b.punti - a.punti);

const classifica = document.getElementById("classifica");

// CREA LE CARD
utenti.forEach((u, index) => {

    const card = document.createElement("div");
    card.classList.add("card");

    // PODIO
    if(index === 0) card.classList.add("first");
    else if(index === 1) card.classList.add("second");
    else if(index === 2) card.classList.add("third");

    // ULTIMO
    if(index === utenti.length - 1) card.classList.add("last");

    // TIPO PUNTI
    let tipo = "zero";
    if(u.punti > 0) tipo = "positivo";
    if(u.punti < 0) tipo = "negativo";

    card.innerHTML = `
        <div class="posizione">${index + 1}</div>
        <img src="${u.img}" class="avatar">
        <div class="info">
            <div class="nickname">${u.nome}</div>
            <div class="ruolo">${u.ruolo}</div>
        </div>
        <div class="punti ${tipo}">
            <span class="valore">${u.punti > 0 ? "+" + u.punti : u.punti}</span>
            <span class="label">pt</span>
        </div>
    `;

    classifica.appendChild(card);
});