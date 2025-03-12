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
            <label>Hotel/Pousada desejado:</label>
            <select class="pessoaHotel" required>
                <option value="">Selecione a opção</option>
                <option value="Hotel Torino Plaza">Hotel Torino Plaza</option>
                <option value="Pousada São Nicolau">Pousada São Nicolau</option>
            </select>
            <label>Data de Check-in: <input type="date" class="pessoaCheckin" required></label>
            <label>Data de Check-out: <input type="date" class="pessoaCheckout" required></label>
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

    document.querySelectorAll('.pessoaCEP').forEach(input => {
        input.addEventListener('blur', function () {
            let cep = this.value.replace(/\D/g, '');
            if (cep.length !== 8) {
                alert('CEP inválido!');
                return;
            }

            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (data.erro) {
                        alert('CEP não encontrado!');
                        return;
                    }

                    let container = this.closest('div');
                    if (container) {
                        container.querySelector('.pessoaRua').value = data.logradouro;
                        container.querySelector('.pessoaCidade').value = data.localidade;
                        container.querySelector('.pessoaEstado').value = data.uf;
                    }
                })
                .catch(() => alert('Erro ao buscar o CEP!'));
        });
    });

});

// Validação e envio do formulário
function formatarDataParaBR(dataISO) {
    let partes = dataISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

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
    let hoteis = document.querySelectorAll('.pessoaHotel');
    let checkins = document.querySelectorAll('.pessoaCheckin');
    let checkouts = document.querySelectorAll('.pessoaCheckout');
    let ruas = document.querySelectorAll('.pessoaRua');
    let numeros = document.querySelectorAll('.pessoaNumero');
    let cidades = document.querySelectorAll('.pessoaCidade');
    let estados = document.querySelectorAll('.pessoaEstado');
    let celulares = document.querySelectorAll('.pessoaCelular');
    let emails = document.querySelectorAll('.pessoaEmail');

    for (let i = 0; i < nomes.length; i++) {
        if (hoteis[i].value === '') {
            alert('Por favor, selecione um hotel ou pousada para cada pessoa.');
            return;
        }

        pessoas.push({
            nome: nomes[i].value,
            cpf: cpfs[i].value,
            rg: rgs[i].value,
            nascimento: formatarDataParaBR(nascimentos[i].value),
            diocese: dioceses[i].value,
            grupo: grupos[i].value,
            hotel: hoteis[i].value,
            checkin: formatarDataParaBR(checkins[i].value),
            checkout: formatarDataParaBR(checkouts[i].value),
            endereco: `${ruas[i].value}, ${numeros[i].value}, ${cidades[i].value} - ${estados[i].value}`,
            celular: celulares[i].value,
            email: emails[i].value
        });
    }

    let dadosReserva = { nome, celular, quantidadePessoas, pessoas };

    fetch("https://script.google.com/macros/s/AKfycbxZ6lbhIZha5Dx8v-uvhKDqmDfXRRGyWKv4kgweTHkNNuHz6I8fB1B_Es_IwegthHsN/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosReserva)
    }).then(() => alert("Dados enviados!"));

    let mensagem = `Olá Capital da Fé Turismo, vim através do formulário fazer minha reserva!

*Cliente que está entrando em contato para reservar:*
Nome: ${nome}
Celular: ${celular}
Quantidade de Pessoas: ${quantidadePessoas}\n\n`;

    pessoas.forEach((pessoa, i) => {
        mensagem += `*Pessoa ${i + 1}:* ${pessoa.nome}, \n*CPF:* ${pessoa.cpf}, \n*RG:* ${pessoa.rg}, \n*Hotel:* ${pessoa.hotel}, \n*Check-in:* ${pessoa.checkin}, \n*Check-out:* ${pessoa.checkout}, \n*Endereço:* ${pessoa.endereco}, \n*Celular:* ${pessoa.celular}, \n*Email:* ${pessoa.email}\n\n`;
    });

    mensagem += `\nQuero confirmar minha reserva e prosseguir com o processo de pagamento!`;

    let numeroFixo = "5512992183865";
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
