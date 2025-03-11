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

    if (!estadoSelecionado) {
        selectCidade.innerHTML = '<option value="">Selecione um estado primeiro</option>';
        return;
    }

    fetch(`https://brasilapi.com.br/api/ibge/municipios/v1/${estadoSelecionado}`)
        .then(response => response.json())
        .then(cidades => {
            cidades.sort((a, b) => a.nome.localeCompare(b.nome));

            selectCidade.innerHTML = '<option value="">Selecione uma cidade</option>';
            cidades.forEach(cidade => {
                let option = document.createElement('option');
                option.value = cidade.nome;
                option.textContent = cidade.nome;
                selectCidade.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar cidades:", error);
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        });
});

// Gerar campos extras para hóspedes com base no tipo de quarto
document.getElementById('tipoQuarto').addEventListener('change', function () {
    let tipo = this.value;
    let dadosExtras = document.getElementById('dadosExtras');
    dadosExtras.innerHTML = '';

    if (!tipo) return;

    let qtd = tipo === 'individual' ? 1 : tipo === 'duplo' ? 2 : tipo === 'triplo' ? 3 : 4;

    for (let i = 1; i <= qtd; i++) {
        let div = document.createElement('div');
        div.innerHTML = `
            <h3>Pessoa ${i}</h3>
            <label>Nome: <input type="text" class="pessoaNome" required></label>
            <label>CPF: <input type="text" class="pessoaCPF" required></label>
            <label>Data de Nascimento: <input type="date" class="pessoaNascimento" required></label>
            <label>Celular: <input type="tel" class="pessoaCelular" required></label>
        `;
        dadosExtras.appendChild(div);
    }

    aplicarMascaras();
});

// Aplicar máscaras aos campos de CPF e Celular
function aplicarMascaras() {
    Inputmask("999.999.999-99").mask(document.querySelectorAll(".pessoaCPF"));
    Inputmask("(99) 99999-9999").mask(document.querySelectorAll(".pessoaCelular"));
    Inputmask("(99) 99999-9999").mask(document.getElementById("celular"));
}

// Envio para WhatsApp
document.getElementById('reservaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let nome = document.getElementById('nome').value;
    let estado = document.getElementById('estado').selectedOptions[0].text;
    let cidade = document.getElementById('cidade').selectedOptions[0].text;
    let celular = document.getElementById('celular').value;
    let tipoQuarto = document.getElementById('tipoQuarto').value;

    let mensagem = `Olá Capital da Fé Turismo, vim através do formulário de reserva de hospedagem!\n\n *Quem está entrando em contato:*`;
    mensagem += `\nNome: ${nome} \nEstado: ${estado} \nCidade: ${cidade}  \nCelular: ${celular} \nQuarto: ${tipoQuarto}\n`;

    let nomes = document.querySelectorAll('.pessoaNome');
    let cpfs = document.querySelectorAll('.pessoaCPF');
    let nascimentos = document.querySelectorAll('.pessoaNascimento');
    let celulares = document.querySelectorAll('.pessoaCelular');

    for (let i = 0; i < nomes.length; i++) {
        mensagem += `\n*Pessoa ${i + 1}:* ${nomes[i].value}, \n*CPF:* ${cpfs[i].value}, \n*Data de Nascimento:* ${nascimentos[i].value}, \n*Celular:* ${celulares[i].value}`;
    }

    mensagem += `\n\nQuero confirmar minha reserva e prosseguir com o processo de pagamento!`;

    let numeroFixo = "5512991382679"; 
    let linkWhatsApp = `https://wa.me/${numeroFixo}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkWhatsApp, '_blank');
});
