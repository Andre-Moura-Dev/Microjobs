document.addEventListener('DOMContentLoaded', function () {

    // ---- Cadastro ----
    const formFreelancer = document.getElementById('form-freelancer');
    const formCliente = document.getElementById('form-cliente');

    if (formFreelancer) {
        formFreelancer.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('freelancerNome').value;
            const email = document.getElementById('freelancerEmail').value;
            const senha = document.getElementById('freelancerSenha').value;
            const servico = document.getElementById('freelancerServico').value;
            const descricao = document.getElementById('freelancerDescricao').value;

            if (!nome || !email || !senha || !servico) {
                alert("Preencha todos os campos obrigatórios");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            if (usuarios.some(u => u.email === email)) {
                alert("Usuário já cadastrado!");
                return;
            }

            usuarios.push({
                nome,
                email,
                senha,
                tipo: "profissional",
                servico,
                descricao
            });
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        });
    }

    if (formCliente) {
        formCliente.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('clienteNome').value;
            const email = document.getElementById('clienteEmail').value;
            const senha = document.getElementById('clienteSenha').value;

            if (!nome || !email || !senha) {
                alert("Preencha todos os campos obrigatórios");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            if (usuarios.some(u => u.email === email)) {
                alert("Usuário já cadastrado!");
                return;
            }

            usuarios.push({
                nome,
                email,
                senha,
                tipo: "cliente"
            });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "login.html";
        });
    }

    // ---- Login ----
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            let usuario = usuarios.find(u => u.email === email && u.senha === senha);

            if(!usuario) {
                alert("Email ou senha inválidos!");
                return;
            }

            localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

            if (usuario.tipo === 'cliente') {
                window.location.href = "../pages/search.html";
            } else {
                window.location.href = "../pages/my-services.html";
            }
        });
    }

    // ---- Proteção de Páginas ----
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (window.location.pathname.includes("search.html") ||
        window.location.pathname.includes('profile.html')) {
        if (!usuario || usuario.tipo !== "cliente") {
            alert("Acesso restrito! Faça login como cliente!");
            window.location.href = "./login.html";
        }
    }

    init();
});

// ---- Atualizar nome na navbar ----
function atualizarNomeUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nomeUsuario = document.getElementById('nome-usuario');

    if (nomeUsuario && usuario) {
        nomeUsuario.textContent = usuario.nome.split(" ")[0];
    }
}

// ---- Logout ----
function logout() {
    const btnLogout = document.getElementById('btn-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            localStorage.removeItem("usuarioLogado");
            alert("Você saiu com sucesso!");
            window.location.href = "./login.html";
        });
    }
}

// ---- Carregar lista de profissionais ----
function carregarListaProfissionais() {
    const lista = document.getElementById('lista-profissionais');
    if (!lista) return;

    const profissionais = [
        {nome: "Ana Clara", servico: "Desenvolvedora", preco: "170/hora", img: "../assets/profissionais/Ana Clara.jpg"},
        {nome: "Carlos Mendes", servico: "Encanador", preco: "70/dia", img: "../assets/profissionais/Carlos Mendes.jpg"},
        {nome: "João Silva", servico: "Eletricista", preco: "80/dia", img: "../assets/profissionais/João Silva.jpg"},
        {nome: "Beatriz Almeida", servico: "Professora de Matemática", preco: "90/hora", img: "../assets/profissionais/Beatriz Almeida.jpg"},
        {nome: "Lucas Ferreira", servico: "Designer Gráfico", preco: "100/hora", img: "../assets/profissionais/Lucas Ferreira.jpg"}
    ];

    lista.innerHTML = "";
    profissionais.forEach((p) => {
        lista.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm h-100">
                    <img src="${p.img}" class="card-img-top rounded-top" alt="${p.nome}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${p.nome}</h5>
                        <p class="text-muted">${p.servico} • R$ ${p.preco}</p>
                        <p class="card-text flex-grow-1">Profissional experiente e bem avaliado.</p>
                        <a href="./profile.html" class="btn btn-outline-primary btn-sm mt-2">Ver Perfil</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// ---- Dark Mode ----
function configurarDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.textContent = '☀️'
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.textContent = '🌙'
        }
    });
}

// ---- Inicialização ----
function init() {
    atualizarNomeUsuario();
    logout();
    carregarListaProfissionais();
    configurarDarkMode();
}