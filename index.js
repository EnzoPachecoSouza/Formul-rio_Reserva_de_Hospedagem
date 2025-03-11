document.getElementById('quantidadePessoas').addEventListener('change', function () {
    let quantidade = parseInt(this.value);
    let dadosExtras = document.getElementById('dadosExtras');
    dadosExtras.innerHTML = '';

    if (!quantidade) return;

    for (let i = 1; i <= quantidade; i++) {
        let div = document.createElement('div');
        div.innerHTML = `
            <h3>Pessoa ${i}</h3>
            <label>Nome: <input type="text" class="pessoaNome" required></label>
            <label>CPF: <input type="text" class="pessoaCPF" required></label>
            <label>RG: <input type="text" class="pessoaRG" required></label>
            <label>Data de Nascimento: <input type="date" class="pessoaNascimento" required></label>
            <label>Endereço:</label>
            <input type="text" class="pessoaCEP" placeholder="CEP" required>
            <input type="text" class="pessoaRua" placeholder="Rua" required>
            <input type="text" class="pessoaNumero" placeholder="Número" required>
            <input type="text" class="pessoaCidade" placeholder="Cidade" required>
            <input type="text" class="pessoaEstado" placeholder="Estado" required>
            <label>Celular: <input type="tel" class="pessoaCelular" required></label>
            <label>Email: <input type="email" class="pessoaEmail" required></label>
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
    mensagem += `*Nome:* ${nome}\n*Celular:* ${celular}\n*Quantidade de Pessoas:* ${quantidadePessoas}\n\n`;

    let nomes = document.querySelectorAll('.pessoaNome');
    let cpfs = document.querySelectorAll('.pessoaCPF');
    let rgs = document.querySelectorAll('.pessoaRG');
    let nascimentos = document.querySelectorAll('.pessoaNascimento');
    let ruas = document.querySelectorAll('.pessoaRua');
    let numeros = document.querySelectorAll('.pessoaNumero');
    let cidades = document.querySelectorAll('.pessoaCidade');
    let estados = document.querySelectorAll('.pessoaEstado');
    let celulares = document.querySelectorAll('.pessoaCelular');
    let emails = document.querySelectorAll('.pessoaEmail');

    for (let i = 0; i < nomes.length; i++) {
        mensagem += `*Pessoa ${i + 1}:* ${nomes[i].value}, \n*CPF:* ${cpfs[i].value}, \n*RG:* ${rgs[i].value}, \n*Data de Nascimento:* ${nascimentos[i].value}, \n*Endereço:* ${ruas[i].value}, ${numeros[i].value}, ${cidades[i].value} - ${estados[i].value}, \n*Celular:* ${celulares[i].value}, \n*Email:* ${emails[i].value}\n\n`;
    }

    mensagem += `Quero confirmar minha reserva e prosseguir com o processo de pagamento!`;

    let numeroFixo = "5512991382679"; 
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
