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

    // Adiciona evento para buscar endereço ao digitar o CEP
    document.querySelectorAll('.pessoaCEP').forEach(cepInput => {
        cepInput.addEventListener('input', function () {
            let cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
            if (cep.length === 8) {
                buscarEndereco(cep, this);
            }
        });
    });
});

// Função para buscar o endereço via API do ViaCEP
function buscarEndereco(cep, campoCEP) {
    let url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                let divPessoa = campoCEP.closest('div');
                divPessoa.querySelector('.pessoaRua').value = data.logradouro || '';
                divPessoa.querySelector('.pessoaCidade').value = data.localidade || '';
                divPessoa.querySelector('.pessoaEstado').value = data.uf || '';
            } else {
                alert('CEP não encontrado!');
            }
        })
        .catch(error => console.error('Erro ao buscar o CEP:', error));
}

// Envio do formulário
document.getElementById('reservaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let nome = document.getElementById('nome').value;
    let celular = document.getElementById('celular').value;
    let quantidadePessoas = document.getElementById('quantidadePessoas').value;

    let pessoas = [];
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
        pessoas.push({
            nome: nomes[i].value,
            cpf: cpfs[i].value,
            rg: rgs[i].value,
            nascimento: nascimentos[i].value,
            diocese: dioceses[i].value,
            grupo: grupos[i].value,
            checkin: checkins[i].value,
            checkout: checkouts[i].value,
            endereco: `${ruas[i].value}, ${numeros[i].value}, ${cidades[i].value} - ${estados[i].value}`,
            celular: celulares[i].value,
            email: emails[i].value
        });
    }

    let dadosReserva = {
        nome: nome,
        celular: celular,
        quantidadePessoas: quantidadePessoas,
        pessoas: pessoas
    };

    // **1. Enviar para o Google Sheets**
    fetch("https://script.google.com/macros/s/AKfycbzhHSn2BADBnFK3C3AXucfkf_mL72b9n9j5AjmEslsOCTMrQfB5DzTzuWVjxZipXtca/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosReserva)
    }).then(() => alert("Dados prontos para enviar no WhatsApp"));

    // **2. Enviar para WhatsApp**
    let mensagem = `Olá Capital da Fé Turismo, vim através do formulário de reserva!\n\n Pessoa que está entrando em contato:\n*Nome:* ${nome}\n*Celular:* ${celular}\n*Quantidade de Pessoas:* ${quantidadePessoas}\n\n`;

    pessoas.forEach((pessoa, i) => {
        mensagem += `*Pessoa ${i + 1}:* ${pessoa.nome}, \n*CPF:* ${pessoa.cpf}, \n*RG:* ${pessoa.rg}, \n*Data de Nascimento:* ${pessoa.nascimento}, \n*Diocese:* ${pessoa.diocese}, \n*Grupo de Oração:* ${pessoa.grupo}, \n*Check-in:* ${pessoa.checkin}, \n*Check-out:* ${pessoa.checkout}, \n*Endereço:* ${pessoa.endereco}, \n*Celular:* ${pessoa.celular}, \n*Email:* ${pessoa.email}\n\n`;
    });

    mensagem += `Quero confirmar minha reserva e prosseguir com o processo de pagamento!`;

    let numeroFixo = "5512992183865"; 
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
