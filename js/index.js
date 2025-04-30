// --->>>---Inicio do código JS para a pagina Index.html ---<<<---

let inputLogin, inputSenha, buttonEntrar, imgIconeVisibilityOff, imgIconeVisibilityOn;

$(document).ready(function () {
    //Variaveis globais: Aqui tem todas as variaveis globais que utilizo para a pagina index.html, como para pegar os elementos html (input, button).
    inputLogin = document.getElementById("login"); //Recebe o elemento input para o Login
    inputSenha = document.getElementById("senha"); //Recebe o elemento input para a Senha
    buttonEntrar = document.getElementById("BtnEntrar"); //Recebe o elemento button para fazer a autenticação.
    imgIconeVisibilityOff = document.getElementById("iconeVisibilityOff"); //Recebe o elemento icone (iconeVisibilityOff) para fazer a autenticação.
    imgIconeVisibilityOn = document.getElementById("iconeVisibilityOn"); //Recebe o elemento icone (iconeVisibilityOn) para fazer a autenticação.
});

$("#form").validate({
    rules: {
        login: {
            required: true
        },
        senha: {
            required: true
        }
    },
    messages: {
        login: {
            required: "Campo obrigatório"
        },
        senha: {
            required: "Campo obrigatório"
        }
    }
});

async function autenticarLogin() {
    if ($("#form").valid()) {
        let login = inputLogin.value; //Recebe o valor que o usuario digitou no input de login.
        let senha = inputSenha.value; //Recebe o valor que o usuario digitou no input de senha.

        try {
            let respostaDaAPI = await fetch(`https://api-odinline.odiloncorrea.com/usuario/${login}/${senha}/autenticar`) //Caminho para buscar o login e senha que o usuario digitar na API Odinline.
            let usuario = await respostaDaAPI.json(); //Recebe apenas um usuario.

            if (usuario.id !== undefined) {
                localStorage.setItem("usuarioAutenticado", JSON.stringify(usuario));
                window.location.href = "menuAcesso.html"
            } else {
                alert("Usuario não existe!")
            }
            inputLogin.value = "";
            inputSenha.value = "";
        } catch (error) {
            alert("Erro ao tentar autenticar! Tente digitar algo.")
        }
    }
}

function vizualizarSenha() {
    let iconeVisibilityOff = imgIconeVisibilityOff;
    iconeVisibilityOff.style.display = "none";
    let iconeVisibilityOn = imgIconeVisibilityOn;
    iconeVisibilityOn.style.display = "inline"
    let senha = inputSenha;
    senha.type = "Text";
}

function ocultarSenha() {
    let iconeVisibilityOn = imgIconeVisibilityOn;
    iconeVisibilityOn.style.display = "none"
    let iconeVisibilityOff = imgIconeVisibilityOff;
    iconeVisibilityOff.style.display = "inline";
    let senha = inputSenha;
    senha.type = "password";
}