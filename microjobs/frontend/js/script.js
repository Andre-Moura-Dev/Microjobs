document.addEventListener('DOMContentLoaded', () => {
    init();
});

function cadastrarUsuarios(tipo, dadosExtras = {}) {
    const {nome, email, senha} = dadosExtras;

    if (!nome || !email || !senha) {
        exibirMensagem("Preencha todos os campos obrigatórios.", "error");
        return false;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.some(u => u.email === email)) {
        exibirMensagem("Usuário já cadastrado!", "error");
    }

    const usuario = {
        nome,
        email,
        senha: hashSenha(senha),
        tipo,
        servico: dadosExtras.servico || "",
        descricao: dadosExtras.descricao || "",
        img: dadosExtras.img || ""
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    exibirMensagem("Cadastro realizado com sucesso!", "success");
    setTimeout(() => window.location.href = "./login.html", 1500);

    return true;
}

// criptografia da senha
function hashSenha(senha) {
    return btoa(senha);
}

function loginUsuario(email, senha, tipo) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const senhaHash = hashSenha(senha);
    const usuario = usuarios.find(u =>
        u.email === email &&
        u.senha === senhaHash &&
        u.tipo === tipo
    );

    if (!usuario) {
        exibirMensagem("Email ou senha inválidos!", "error");
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    exibirMensagem("Login realizado com sucesso!", "success");

    atualizarNomeUsuario(); // Mostra nome usuário na navBar

    setTimeout(() => {
        if (usuario.tipo === "cliente") {
            window.location.href = "../pages/search.html";
        } else {
            window.location.href = "../pages/my-services.html";
        }
    }, 1000);
}

function configurarLogout() {
    const btnLogout = document.getElementById("btn-logout");
    if(btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            exibirMensagem("Usuário Deslogado!", "info");
            setTimeout(() => window.location.href = "./login.html", 1000);
        });
    }
}

function protecaoPaginas() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const accessRules = {
        "search.html": "cliente",
        "profile.html": "cliente",
        "my-services.html": "profissional"
    };

    const currentPage = window.location.pathname.split("/").pop();
    const acessoNecessario = accessRules[currentPage];

    if (acessoNecessario && (!usuario || usuario.tipo !== acessoNecessario)) {
        alert("Acesso Restrito! Faça login com seu email e senha!", "error");
        setTimeout(() => window.location.href = "./login.html", 2000);
    }
}

function configurarDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    if(!toggle) return;
    
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const ativo = document.body.classList.contains("dark-mode");
        localStorage.setItem("darkMode", ativo ? "enabled" : "disabled");
        toggle.textContent = ativo ? '☀️' : '🌙';
    });
}

function aplicarDarkMode() {
    const ativo = localStorage.getItem("darkMode") === "enabled";
    document.body.classList.toggle("dark-mode", ativo);
    const toggle = document.getElementById("darkModeToggle");
    if(toggle) toggle.textContent = ativo ? '☀️' : '🌙';
}

function atualizarNomeUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nomeUsuario = document.getElementById("nome-usuario");
    if (nomeUsuario && usuario) {
        nomeUsuario.textContent = usuario.nome.split(" ")[0];
    }
}

function carregarListaProfissionais() {
    const lista = document.getElementById("lista-profissionais");
    if(!lista) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const profissionais = usuarios.filter(u => u.tipo === "profissional");

    if(profissionais.length === 0) {
        lista.innerHTML = "<p class='text-center'>Nenhum profissional cadastrado ainda.</p>";
        return;
    }

    lista.innerHTML = profissionais.map(p => `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <img src="${p.img || '../assets/default.jpg'}" class="card-img-top rounded-top" alt="${p.nome}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.nome}</h5>
                    <p class="text-muted">${p.servico || 'Serviço não informado'}</p>
                    <p class="card-text flex-grow-1">${p.descricao || 'Profissional cadastrado recentemente.'}</p>
                    <a href="./profile.html" class="btn btn-outline-primary btn-sm mt-2">Ver Perfil</a>
                </div>
            </div>
        </div>
    `).join('');
}

function exibirMensagem(msg, tipo = "info") {
    const container = document.createElement("div");
    container.className = `alert alert-${tipo} position-fixed top-0 start-50 translate-middle-x mt-3`;
    container.style.zIndex = "2000";
    container.style.minWidth = "300px";
    container.textContent = msg;

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 2000);
}

function init() {
    configurarLogout();
    protecaoPaginas();
    atualizarNomeUsuario();
    configurarDarkMode();
    carregarListaProfissionais();
    configurarFormularios();
}

function configurarFormularios() {
    // Freelancer
    const formFreelancer = document.getElementById("form-freelancer");
    if (formFreelancer) {
        formFreelancer.addEventListener("submit", e => {
            e.preventDefault();
            cadastrarUsuarios("profissional", {
                nome: freelancerNome.value,
                email: freelancerEmail.value,
                senha: freelancerSenha.value,
                servico: freelancerServico.value,
                descricao: freelancerDescricao.value
            });
        });
    }

    // Cliente
    const formCliente = document.getElementById("form-cliente");
    if(formCliente) {
        formCliente.addEventListener("submit", e => {
            e.preventDefault();
            cadastrarUsuarios("cliente", {
                nome: clienteNome.value,
                email: clienteEmail.value,
                senha: clienteSenha.value,
                tipo: clienteTipo.value
            });
        });
    }

    // Login
    const formLogin = document.getElementById("form-login");
    if(formLogin) {
        formLogin.addEventListener("submit", e => {
            e.preventDefault();
            loginUsuario(loginEmail.value, loginSenha.value, tipo.value);
        })
    }
}