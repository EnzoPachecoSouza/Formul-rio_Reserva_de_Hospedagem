// Buscar estados da BrasilAPI
fetch('https://brasilapi.com.br/api/ibge/uf/v1')
    .then(response => response.json())
    .then(estados => {
        let selectEstado = document.getElementById('estado');
        estados.forEach(estado => {
            let option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = estado.nome;
            selectEstado.appendChild(option);
        });
    });

// Buscar cidades ao selecionar um estado
document.getElementById('estado').addEventListener('change', function () {
    let estadoSelecionado = this.value;
    let selectCidade = document.getElementById('cidade');
    selectCidade.innerHTML = '<option value="">Carregando...</option>';

    fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${estadoSelecionado}`)
        .then(response => response.json())
        .then(cidades => {
            selectCidade.innerHTML = '<option value="">Selecione uma cidade</option>';
            cidades.forEach(cidade => {
                let option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                selectCidade.appendChild(option);
            });
        });
});

document.getElementById('tipoQuarto').addEventListener('change', function () {
    let tipo = this.value;
    let dadosExtras = document.getElementById('dadosExtras');
    dadosExtras.innerHTML = '';
    let qtd = tipo === 'individual' ? 1 : (tipo === 'duplo' ? 2 : tipo === 'triplo' ? 3 : 4);

    for (let i = 1; i <= qtd; i++) {
        dadosExtras.innerHTML += `
            <h3>Pessoa ${i}</h3>
            <label>Nome: <input type="text" class="pessoaNome" required></label>
            <label>CPF: <input type="text" class="pessoaCPF" required></label>
            <label>RG: <input type="text" class="pessoaRG" required></label>
            <label>Celular: <input type="tel" class="pessoaCelular" required></label>
        `;
    }
});

document.getElementById('reservaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let nome = document.getElementById('nome').value;
    let estado = document.getElementById('estado').selectedOptions[0].text;
    let cidade = document.getElementById('cidade').selectedOptions[0].text;
    let celular = document.getElementById('celular').value;
    let tipoQuarto = document.getElementById('tipoQuarto').value;
    let mensagem = `Olá, vim através do formulário de reserva!%0A%0A`;
    mensagem += `Nome: ${nome}%0AEstado: ${estado}%0ACidade: ${cidade}%0ACelular: ${celular}%0AQuarto: ${tipoQuarto}%0A%0A`;

    let nomes = document.querySelectorAll('.pessoaNome');
    let cpfs = document.querySelectorAll('.pessoaCPF');
    let rgs = document.querySelectorAll('.pessoaRG');
    let celulares = document.querySelectorAll('.pessoaCelular');

    for (let i = 0; i < nomes.length; i++) {
        mensagem += `Pessoa ${i + 1}: ${nomes[i].value}, CPF: ${cpfs[i].value}, RG: ${rgs[i].value}, Celular: ${celulares[i].value}%0A`;
    }

    mensagem += `%0AQuero confirmar minha reserva e prosseguir com o processo de pagamento!?`;
    let numeroFixo = "5512991382679"; // Número fixo (com código do país 55 para Brasil)
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${mensagem}`;
    window.open(linkWhatsApp, '_blank');
});
