// --->>>---Inicio do código JS para a pagina menuAcesso.html ---<<<---


//Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina index.html, como para pegar os elementos html (input, button).
let paragrafoNomeUsuario = $("#usuarioOn"); //Recebe o paragrafo para colocar o nome do usuario online na pagina.

$(document).ready(function(){
    let usuarioOn = JSON.parse(localStorage.getItem("usuarioAutenticado")); //Recebe um objeto do usuario online.
    paragrafoNomeUsuario.append(usuarioOn.nome);
});