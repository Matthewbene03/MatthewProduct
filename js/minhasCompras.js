// --->>>---Inicio do código JS para a pagina minhasCompras.html ---<<<---

//Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina minhasCompras.html, como para pegar os elementos html (input, button).
let paragrafoNomeUsuario = $("#usuarioOn"); //Recebe o paragrafo para colocar o nome do usuario online na pagina.
let paragrafoAviso = document.getElementById("paragrafoAviso");
let tabelaAviso = document.getElementById("tabela");
let tbody = $("#tbody");

$(document).ready(function () {
    let usuarioOn = JSON.parse(localStorage.getItem("usuarioAutenticado")); //Recebe um objeto do usuario online.
    paragrafoNomeUsuario.append(usuarioOn.nome);

    let vetCompras = JSON.parse(localStorage.getItem("compras"));
    if (vetCompras.length > 0) { //Significa que o vetor de alerta tem alertas cadastrados.
        limparParagrafoAviso();
    }

    mostrarTabela();
});

function limparParagrafoAviso() {
    paragrafoAviso.style.display = "none";
}

function addParagrafoAviso() {
    paragrafoAviso.style.display = "block";
}

function mostrarTabela() {
    let vetCompras = JSON.parse(localStorage.getItem("compras"));
    let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    vetCompras = vetCompras.filter(compra =>{
        return compra.Usuario.id === usuario.id;
    });

    if (vetCompras.length === 0) { //Significa que o vetor de alerta tem alertas cadastrados.
        addParagrafoAviso();
    }

    vetCompras.forEach(compra => {
        let linha =
            `<tr>
                <td>${compra.idProduto}</td>
                <td>${compra.descricao}</td>
                <td>R$${compra.valorCompra}</td>
                <td>${compra.acao}</td>
                <td>${compra.dataCompra}</td>
            </tr>`
        tbody.append(linha);
    });
}