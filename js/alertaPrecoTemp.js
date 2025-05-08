// --->>>---Inicio do código JS para a pagina alertaPrecoTemp.html ---<<<---

//Esse arquivo serve apenas para monitorar os preços dos produtos para a pagina alertaPreco.js

import {Temporizador} from "./temporizador.js";

setInterval(() => {
    let monitorarPreco = new Temporizador();
    monitorarPreco.monitorarPreco();
    console.log("Fez a verificação no site Odinline!");
}, 1000*10);