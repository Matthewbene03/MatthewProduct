// --->>>---Inicio do código JS para a pagina alertaPreco.html ---<<<---

//Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina index.html, como para pegar os elementos html (input, button).
let paragrafoNomeUsuario, inputIdProduto, inputValorProduto, selectProduto, inputValorDesejado, selectAcao;

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
    try{
        let usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
        let resposta = await fetch("https://api-odinline.odiloncorrea.com/produto/" + usuario.chave + "/usuario");
        let produtosUsuario = await resposta.json();
        
        console.log(produtosUsuario);

        let descricaoProduto = selectProduto.val();

        console.log(descricaoProduto);

        produtosUsuario.forEach(produto => {
            if (produto.descricao === descricaoProduto) {
                console.log(produto.id);
                inputIdProduto.attr({placeholder: "ID: " + produto.id});
                console.log(produto.valor)
                inputValorProduto.attr({placeholder: "Valor: " + produto.valor});
            }
        });
    } catch (error) {
        alert("Error: " + error)
    }
}

