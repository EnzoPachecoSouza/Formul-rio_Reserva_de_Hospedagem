document.getElementById('quantidadePessoas').addEventListener('change', function () {
    let quantidade = parseInt(this.value);
    let dadosExtras = document.getElementById('dadosExtras');
    dadosExtras.innerHTML = '';

    if (!quantidade) return;

    for (let i = 1; i <= quantidade; i++) {
        let div = document.createElement('div');
        div.innerHTML = `
            <h3>Pessoa ${i}</h3>
            <label>Nome: <input type="text" class="pessoaNome" placeholder="Nome Completo" required></label>
            <label>CPF: <input type="text" class="pessoaCPF" placeholder="xxx.xxx.xxx-xx" required></label>
            <label>RG: <input type="text" class="pessoaRG" placeholder="xx.xxx.xxx-x" required></label>
            <label>Data de Nascimento: <input type="date" class="pessoaNascimento" required></label>
            <label>Diocese: <input type="text" class="pessoaDiocese" placeholder="Nome da Diocese" required></label>
            <label>Grupo de oração: <input type="text" class="pessoaGrupo" placeholder="Nome do Grupo" required></label>
            <label>Data de Check-in no Hotel/Pousada: <input type="date" class="pessoaCheckin" required></label>
            <label>Data de Check-out no Hotel/Pousada: <input type="date" class="pessoaCheckout" required></label>
            <label>Endereço:</label>
            <input type="text" class="pessoaCEP" placeholder="CEP" required>
            <input type="text" class="pessoaRua" placeholder="Rua" required>
            <input type="text" class="pessoaNumero" placeholder="Número" required>
            <input type="text" class="pessoaCidade" placeholder="Cidade" required>
            <input type="text" class="pessoaEstado" placeholder="Estado" required>
            <label>Celular: <input type="tel" class="pessoaCelular" placeholder="(xx) xxxxx-xxxx" required></label>
            <label>Email: <input type="email" class="pessoaEmail" placeholder="Email" required></label>
        `;
        dadosExtras.appendChild(div);
    }

    aplicarMascaras();
});

// Aplicar máscaras nos campos
function aplicarMascaras() {
    Inputmask("999.999.999-99").mask(document.querySelectorAll(".pessoaCPF"));
    Inputmask("99.999.999-9").mask(document.querySelectorAll(".pessoaRG"));
    Inputmask("(99) 99999-9999").mask(document.querySelectorAll(".pessoaCelular"));
    Inputmask("(99) 99999-9999").mask(document.getElementById("celular"));
}

// Preencher endereço a partir do CEP
document.addEventListener("input", function (event) {
    if (event.target.classList.contains("pessoaCEP")) {
        let cep = event.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    let parent = event.target.parentElement;
                    if (!data.erro) {
                        parent.querySelector(".pessoaRua").value = data.logradouro || "";
                        parent.querySelector(".pessoaCidade").value = data.localidade || "";
                        parent.querySelector(".pessoaEstado").value = data.uf || "";
                    } else {
                        alert("CEP não encontrado!");
                    }
                })
                .catch(() => alert("Erro ao buscar CEP!"));
        }
    }
});

// Envio para WhatsApp
document.getElementById('reservaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let nome = document.getElementById('nome').value;
    let celular = document.getElementById('celular').value;
    let quantidadePessoas = document.getElementById('quantidadePessoas').value;

    let mensagem = `Olá Capital da Fé Turismo, vim através do formulário de reserva!\n\n Pessoa que está entrando em contato:`;
    mensagem += `\n*Nome:* ${nome}\n*Celular:* ${celular}\n*Quantidade de Pessoas:* ${quantidadePessoas}\n\n`;

    let nomes = document.querySelectorAll('.pessoaNome');
    let cpfs = document.querySelectorAll('.pessoaCPF');
    let rgs = document.querySelectorAll('.pessoaRG');
    let nascimentos = document.querySelectorAll('.pessoaNascimento');
    let dioceses = document.querySelectorAll('.pessoaDiocese');
    let grupos = document.querySelectorAll('.pessoaGrupo');
    let checkins = document.querySelectorAll('.pessoaCheckin');
    let checkouts = document.querySelectorAll('.pessoaCheckout');
    let ruas = document.querySelectorAll('.pessoaRua');
    let numeros = document.querySelectorAll('.pessoaNumero');
    let cidades = document.querySelectorAll('.pessoaCidade');
    let estados = document.querySelectorAll('.pessoaEstado');
    let celulares = document.querySelectorAll('.pessoaCelular');
    let emails = document.querySelectorAll('.pessoaEmail');

    for (let i = 0; i < nomes.length; i++) {
        let dataNascimento = new Date(nascimentos[i].value).toLocaleDateString('pt-BR');
        let dataCheckin = new Date(checkins[i].value).toLocaleDateString('pt-BR');
        let dataCheckout = new Date(checkouts[i].value).toLocaleDateString('pt-BR');
        
        mensagem += `*Pessoa ${i + 1}:* ${nomes[i].value}, \n*CPF:* ${cpfs[i].value}, \n*RG:* ${rgs[i].value}, \n*Data de Nascimento:* ${dataNascimento}, \n*Diocese:* ${dioceses[i].value}, \n*Grupo de Oração:* ${grupos[i].value}, \n*Check-in:* ${dataCheckin}, \n*Check-out:* ${dataCheckout}, \n*Endereço:* ${ruas[i].value}, ${numeros[i].value}, ${cidades[i].value} - ${estados[i].value}, \n*Celular:* ${celulares[i].value}, \n*Email:* ${emails[i].value}\n\n`;
    }

    mensagem += `Quero confirmar minha reserva e prosseguir com o processo de pagamento!`;

    let numeroFixo = "5512992183865"; 
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
