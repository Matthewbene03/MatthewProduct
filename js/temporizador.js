export class Temporizador{
    constructor(){}

    async monitorarPreco(){
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
                
                if (!(produtoNotificado.length === 0) && (valorAlterado <= (parseFloat(produtoNotificado[0].valorDesejado)))) {
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
                    localStorage.setItem("compras", JSON.stringify(compras)); //Salvo no localStorage*/
                    apagarLinhasTabela();
                    mostrarTabela();
                }
            }
        } catch (error) {
            console.log("Error: " + error);
        }
    };
}