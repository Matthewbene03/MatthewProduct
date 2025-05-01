// --->>>---Inicio do código JS para a pagina menuAcesso.html ---<<<---


//Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina menuAcesso.html, como para pegar os elementos html (input, button).
let paragrafoNomeUsuario = $("#usuarioOn"); //Recebe o paragrafo para colocar o nome do usuario online na pagina.
let paragrafoAviso = document.getElementById("paragrafoAviso");
let tabelaAviso = document.getElementById("tabela");
let tbody = $("#tbody");

$(document).ready(function () {
    let usuarioOn = JSON.parse(localStorage.getItem("usuarioAutenticado")); //Recebe um objeto do usuario online.
    paragrafoNomeUsuario.append(usuarioOn.nome);

    if (!localStorage.alertasPreco) {
        let alertaPreco = [];
        localStorage.setItem("alertasPreco", JSON.stringify(alertaPreco));
    }

    if (!localStorage.compras) {
        let compras = [];
        localStorage.setItem("compras", JSON.stringify(compras));
    }

    let alertaPrecos = JSON.parse(localStorage.getItem("alertasPreco"));
    if (alertaPrecos.length > 0) { //Significa que o vetor de alerta tem alertas cadastrados.
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
    let vetAlertaPreco = JSON.parse(localStorage.getItem("alertasPreco"));

    if (vetAlertaPreco.length === 0) { //Significa que o vetor de alerta tem alertas cadastrados.
        addParagrafoAviso();
    }

    vetAlertaPreco.forEach(alerta => {
        if (alerta.acao === "Notificacao") {
            let linha =
                `<tr>
                <td>${alerta.idProduto}</td>
                <td>${alerta.descricao}</td>
                <td>R$${alerta.valorAntigo}</td>
                <td>R$${alerta.valorDesejado}</td>
                <td>${alerta.acao}</td>
                <td><button type="button" class="BtnCancelarAcao" onclick="cancelarAcao(this)">Cancelar Ação</button></td>
            </tr>`
            tbody.append(linha);
        }
    });
}

function apagarLinhasTabela(idLinha) {
    tbody.empty();
}

function cancelarAcao(botao) {
    let vetAlertaPreco = JSON.parse(localStorage.getItem("alertasPreco"));

    let linha = botao.closest("tr"); //Serve para pegar a linha do botão que eu cliquei.
    let idProduto = parseInt(linha.cells[0].textContent); //Pega o primeiro elemento td dessa linha, que nesse caso é sempre o id de um produto.

    for (let index = 0; index < vetAlertaPreco.length; index++) {
        if (parseInt(vetAlertaPreco[index].idProduto) === idProduto) {
            vetAlertaPreco.splice(index, 1); //deleta do vetor
            localStorage.setItem("alertasPreco", JSON.stringify(vetAlertaPreco));
            apagarLinhasTabela();
            mostrarTabela();
            break;
        }
    }
}
