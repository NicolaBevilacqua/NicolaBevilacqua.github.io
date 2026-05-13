// DATI UTENTI
const utenti = [
    { nome:"Ludohfantastico", ruolo:"Cancelliere ad interim delle Aespa", punti:22, img:"Ludo.jpg" },
    { nome:"Felis", ruolo:"Il tupperaio matto", punti:55, img:"Felis.jpg" },
    { nome:"Manel", ruolo:" ", punti:85, img:"profilo.png" },
    { nome:"Sosò", ruolo:"la voce della verità", punti:115, img:"Sofy.jpg" },
    { nome:"Giulia", ruolo:" ", punti:145, img:"profilo.png" },
    { nome:"Diego", ruolo:" ", punti:105, img:"profilo.png" },
    { nome:"Alien", ruolo:" ", punti:40, img:"profilo.png" },
    { nome:"Giangiu", ruolo:" ", punti:65, img:"profilo.png" },
    { nome:"Mad", ruolo:" ", punti:60, img:"profilo.png" },
    { nome:"herzlos", ruolo:" ", punti:90, img:"profilo.png" },
    { nome:"Pyro", ruolo:" ", punti:45, img:"profilo.png" },
    { nome:"Cho", ruolo:" ", punti:90, img:"profilo.png" },
    { nome:"Velia", ruolo:" ", punti:85, img:"profilo.png" },
    { nome:"Roman", ruolo:" ", punti:25, img:"profilo.png" },
    { nome:"Lunatica", ruolo:"WINX FATA GUARDIANA DEL LUNAPARK", punti:65, img:"miri.jpg" },
    { nome:"Spartaco", ruolo:" ", punti:20, img:"profilo.png" },
    { nome:"andrea", ruolo:" ", punti:70, img:"profilo.png" },
    { nome:"MidNight", ruolo:" ", punti:85, img:"profilo.png" },
    { nome:"Guido", ruolo:" ", punti:60, img:"profilo.png" },
    { nome:"Samuel", ruolo:" ", punti:35, img:"profilo.png" },
    { nome:"Aself", ruolo:" ", punti:30, img:"profilo.png" },
    { nome:"Miki", ruolo:" ", punti:40, img:"profilo.png" },
    { nome:"Akene", ruolo:" ", punti:10, img:"profilo.png" },
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