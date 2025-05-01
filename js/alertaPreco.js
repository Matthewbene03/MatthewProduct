// --->>>---Inicio do código JS para a pagina alertaPreco.html ---<<<---

//Classe AlertaAcao: Uma classa que é um alerta de cada ação que o usuario autenticado criar.
class AlertaAcao {
    constructor(Usuario, idProduto, descricao, valorAntigo, valorDesejado, valorAtual, acao) {
        this.Usuario = Usuario;
        this.idProduto = idProduto;
        this.descricao = descricao;
        this.valorAntigo = valorAntigo;
        this.valorDesejado = valorDesejado;
        this.valorAtual = valorAtual;
        this.acao = acao;
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

    if (!localStorage.alertasPreco) {
        let alertaPreco = [];
        localStorage.setItem("alertasPreco", JSON.stringify(alertaPreco));
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

        console.log(produtosUsuario);

        let descricaoProduto = selectProduto.val();

        console.log(descricaoProduto);

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
    let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    let alertasAcao = JSON.parse(localStorage.getItem("alertasPreco")); //Pega todos os alertasAcao

    if (alertasAcao.some(alerta => alerta.idProduto === inputIdProduto.val())) {
        alert("Você não pode cadastrar mais de um alerta para um mesmo produto!!! Tente outro...")
    } else {
        let idProduto = inputIdProduto.val();
        let produto = selectProduto.val();
        let valorAntigo = inputValorProduto.val();
        let valorDesejado = inputValorDesejado.val();
        let acao = selectAcao.val();
        let valorAtual = null;

        let alertaAcao = new AlertaAcao(usuario, idProduto, produto, valorAntigo, valorDesejado, valorAtual, acao); //Crio um objeto alerta.

        alertasAcao.push(alertaAcao); //Adiciono na lista de alertas o alerta que acabou de ser instanciado. 

        localStorage.setItem("alertasPreco", JSON.stringify(alertasAcao)); //Salvo no localStorage

        alert("Cadastro de alerta de preço feito com sucesso!!!");
    }

    inputIdProduto.val("");
    selectProduto.val("");
    inputValorProduto.val("");
    inputValorDesejado.val("");
    selectAcao.val("");
}