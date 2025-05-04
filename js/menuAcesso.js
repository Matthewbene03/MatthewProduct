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

    if (!localStorage.notificacao) {
        let notificacao = [];
        localStorage.setItem("notificacao", JSON.stringify(notificacao));
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

    if (vetAlertaPreco.length === 0 || !(vetAlertaPreco.some(notificacao => notificacao.acao === "Notificacao"))) { //Significa que o vetor de alerta tem alertas cadastrados.
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
    let notificacoes = JSON.parse(localStorage.getItem("notificacao")); //Recebe as notificações.

    let linha = botao.closest("tr"); //Serve para pegar a linha do botão que eu cliquei.
    let idProduto = parseInt(linha.cells[0].textContent); //Pega o primeiro elemento td dessa linha, que nesse caso é sempre o id de um produto.

    for (let index = 0; index < vetAlertaPreco.length; index++) {
        if (parseInt(vetAlertaPreco[index].idProduto) === idProduto) {
            vetAlertaPreco.splice(index, 1); //deleta do vetor
            notificacoes.splice(index, 1); //deleta do vetor
            localStorage.setItem("alertasPreco", JSON.stringify(vetAlertaPreco));
            localStorage.setItem("notificacao", JSON.stringify(notificacoes));
            apagarLinhasTabela();
            mostrarTabela();
            break;
        }
    }
}

async function monitorarPreco() {
    try {
        let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado")); //Recebe o usuario online
        let resposta = await fetch("https://api-odinline.odiloncorrea.com/produto/" + usuario.chave + "/usuario");
        let produtos = await resposta.json();
        let notificacoes = JSON.parse(localStorage.getItem("notificacao")); //Recebe as notificações.
        let alertaPreco = JSON.parse(localStorage.getItem("alertasPreco")); //Recebe todos os alertas cadastrado. 
        alertaPreco = alertaPreco.filter(alerta => {
            return alerta.acao == "Notificacao";
        });
        let compras = JSON.parse(localStorage.getItem("compras")); //Recebe as compras.
        let valorAlterado = null;

        for (let i = 0; i < produtos.length; i++) {
            valorAlterado = produtos[i].valor;
            let produto = produtos[i];
            let produtoNotificado = alertaPreco.filter(alerta => {
                return produto.id === parseInt(alerta.idProduto);
            }); //Verifico se eu tenho um produto dentro do meu vetor de alerta de preços com notificações.
        
            if (!(produtoNotificado.length === 0) && (parseFloat(produtoNotificado[0].valorDesejado) === valorAlterado)) {
                produtoNotificado[0].valorAtual = valorAlterado;
                produtoNotificado[0].acao = "Compra";
                produtoNotificado[0].valorCompra = valorAlterado;
                alert("O produto " + produtoNotificado[0].descricao + " entrou em promoção, no valor de R$" + valorAlterado + ". Compra realizada!!!");
                compras.push(produtoNotificado[0]);
                indexAlerta = alertaPreco.indexOf(produtoNotificado[0]);
                indexNotificações = notificacoes.indexOf(produtoNotificado[0]);
                alertaPreco.splice(indexAlerta, 1);
                notificacoes.splice(indexNotificações, 1);
                localStorage.setItem("notificacao", JSON.stringify(notificacoes)); //Salvo no localStorage
                localStorage.setItem("alertasPreco", JSON.stringify(alertaPreco)); //Salvo no localStorage
                localStorage.setItem("compras", JSON.stringify(compras)); //Salvo no localStorage*/
                apagarLinhasTabela();
                mostrarTabela();
            }
        }
    } catch (error) {
        console.log("Error: " + error);
    }
};

setInterval(() => {
    monitorarPreco();
    console.log("Fez a verificação no site Odinline!");
}, 1000*60);