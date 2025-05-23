// --->>>---Inicio do código JS para a pagina alertaPreco.html ---<<<---

//Classe AlertaAcao: Uma classa que é um alerta de cada ação que o usuario autenticado criar.
class AlertaAcao {
    constructor(Usuario, idProduto, descricao, valorAntigo, valorDesejado, valorAtual, valorCompra, acao, dataCompra) {
        this.Usuario = Usuario;
        this.idProduto = idProduto;
        this.descricao = descricao;
        this.valorAntigo = valorAntigo;
        this.valorDesejado = valorDesejado;
        this.valorAtual = valorAtual;
        this.valorCompra = valorCompra;
        this.acao = acao;
        this.dataCompra = dataCompra;
    }
}

//Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina index.html, como para pegar os elementos html (input, button).
let paragrafoNomeUsuario, inputIdProduto, inputValorProduto, selectProduto, inputValorDesejado, selectAcao, valorProduto, idProduto;

$(document).ready(function () {
    paragrafoNomeUsuario = $("#usuarioOn"); //Recebe o paragrafo para colocar o nome do usuario online na pagina.
    inputIdProduto = $("#idProduto"); //Recebe o input do ID do produto.
    inputValorProduto = $("#valorProduto"); //Recebe o input do valor do produto.
    selectProduto = $("#produtos"); //Recebe o select para adicionar os produtos do usuario.
    inputValorDesejado = $("#valorDesejado"); //Recebe o input o valor desejado do produto.
    selectAcao = $("#acao"); //Recebe o select para a ação desejada.

    let usuarioOn = JSON.parse(localStorage.getItem("usuarioAutenticado")); //Recebe um objeto do usuario online.
    paragrafoNomeUsuario.append(usuarioOn.nome);

    carregarSelectDeProdutos();
});

$("#formAlerta").validate({
    rules: {
        produtos: {
            required: true
        },
        valorDesejado: {
            required: true
        },
        ação: {
            required: true
        }
    },
    messages: {
        produtos: {
            required: "Campo obrigatório"
        },
        valorDesejado: {
            required: "Campo obrigatório"
        },
        ação: {
            required: "Campo obrigatório"
        }
    }
});

async function carregarSelectDeProdutos() {
    try {
        let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
        let resposta = await fetch("https://api-odinline.odiloncorrea.com/produto/" + usuario.chave + "/usuario");
        let produtosUsuario = await resposta.json();

        produtosUsuario.forEach(produto => {
            let option = `<option value="${produto.descricao}">${produto.descricao}</option>`;
            selectProduto.append(option);
        });

    } catch (error) {
        alert("Error: " + error)
    }
}

async function addIdValorProduto() {
    try {
        let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
        let resposta = await fetch("https://api-odinline.odiloncorrea.com/produto/" + usuario.chave + "/usuario");
        let produtosUsuario = await resposta.json();

        let descricaoProduto = selectProduto.val();

        produtosUsuario.forEach(produto => {
            if (produto.descricao === descricaoProduto) {
                inputIdProduto.val(produto.id);
                inputValorProduto.val(produto.valor);
            }
        });
    } catch (error) {
        alert("Error: " + error)
    }
}

async function cadastrarAcao() {
    if ($("#formAlerta").valid()) {
        let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
        let alertasAcao = JSON.parse(localStorage.getItem("alertasPreco")); //Pega todos os alertasAcao
        let compras = JSON.parse(localStorage.getItem("compras")); //Pega todos as compras cadastradas.
        let notificacao = JSON.parse(localStorage.getItem("notificacao")); //Pega todos as notificacões cadastradas.

        if (alertasAcao.some(alerta => alerta.idProduto === inputIdProduto.val())) {
            alert("Você tem um alerta de preço para esse produto em aberto! Cancela ele para fazer uma compra ou tente outro produto...");
        } else {
            let idProduto = inputIdProduto.val();
            let produto = selectProduto.val();
            let valorAntigo = inputValorProduto.val();
            let valorDesejado = inputValorDesejado.val();
            let acao = selectAcao.val();
            let valorAtual = null;
            let valorCompra = null;
            let dataCompra = null;

            let alertaAcao = new AlertaAcao(usuario, idProduto, produto, valorAntigo, valorDesejado, valorAtual, valorCompra, acao, dataCompra); //Crio um objeto alerta.

            if (acao === "Notificacao") {
                alertasAcao.push(alertaAcao); //Adiciono na lista de alertas o alerta que acabou de ser instanciado.                 
                notificacao.push(alertaAcao); //Adiciono na lista de alertas o alerta que acabou de ser instanciado.                 
                localStorage.setItem("alertasPreco", JSON.stringify(alertasAcao)); //Salvo no localStorage
                localStorage.setItem("notificacao", JSON.stringify(notificacao)); //Salvo no localStorage
            } else if (acao === "Compra") {
                alertaAcao.valorCompra = valorAntigo;
                let data = new Date();
                alertaAcao.dataCompra = data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
                compras.push(alertaAcao);
                localStorage.setItem("compras", JSON.stringify(compras)); //Salvo no localStorage
            }

            alert("Cadastro de alerta de preço feito com sucesso!!!");
        }

        inputIdProduto.val("");
        selectProduto.val("");
        inputValorProduto.val("");
        inputValorDesejado.val("");
        selectAcao.val("");
    }
}

document.addEventListener('keyup', function (event) {
    let botaoCadastrar = document.getElementById("buttonMenu");
    if (event.keyCode === 13) {
        event.preventDefault();
        botaoCadastrar.click();
    }
});

/*async function monitorarPreco() {
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
                let data = new Date();
                produtoNotificado[0].dataCompra = data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR");
                alert("O produto " + produtoNotificado[0].descricao + " entrou em promoção, no valor de R$" + valorAlterado + ". Compra realizada!!!");
                compras.push(produtoNotificado[0]);
                indexAlerta = alertaPreco.indexOf(produtoNotificado[0]);
                indexNotificações = notificacoes.indexOf(produtoNotificado[0]);
                alertaPreco.splice(indexAlerta, 1);
                notificacoes.splice(indexNotificações, 1);
                localStorage.setItem("notificacao", JSON.stringify(notificacoes)); //Salvo no localStorage
                localStorage.setItem("alertasPreco", JSON.stringify(alertaPreco)); //Salvo no localStorage
                localStorage.setItem("compras", JSON.stringify(compras)); //Salvo no localStorage
                apagarLinhasTabela();
                mostrarTabela();
            }
        }
    } catch (error) {
        console.log("Error: " + error);
    }
};*/

