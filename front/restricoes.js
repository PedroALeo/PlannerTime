const apiEndpoint = 'http://localhost:8080';

// Função para adicionar uma nova restricao
function adicionarRestricao() {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td><input type="text" class="input-edit" placeholder="Nova Restricao" /></td>
        <td><input type="text" class="input-edit" placeholder="Frequencia" /></td>
        <td>
            <button class="btn-editar" onclick="salvarRestricao(this)">Salvar</button>
            <button class="btn-excluir" onclick="excluirRestricao(this)">Excluir</button>
        </td>
    `;
    tabelaAtividades.appendChild(novaLinha);
}

async function carregarRestricoes() {

    const user = localStorage.getItem('username');

    const listarTarefas = `http://localhost:8080/getRestrictions/${user}`;

    try {
        const response = await fetch(listarTarefas,{
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
        });
        const tarefas = await response.json();
        console.log(tarefas);
        // Adiciona cada tarefa na tabela
        tarefas.forEach(tarefa => {
            const novaLinha = document.createElement('tr');
            novaLinha.dataset.id = tarefa.restrictionId; // Guarda o ID da tarefa
            novaLinha.innerHTML = `
                <td>${tarefa.description}</td>
                <td>${tarefa.frequency}</td>
                <td>
                    <button class="btn-editar" onclick="editarTarefa(this)">Editar</button>
                    <button class="btn-excluir" onclick="excluirTarefa(this)">Excluir</button>
                </td>
            `;
            tabelaAtividades.appendChild(novaLinha);
        });
    } catch (error) {
        console.error('Erro ao carregar restricoes:', error);
    }
}

async function excluirTarefa(botao) {
    const linha = botao.closest('tr');
    const id = linha.dataset.id;
    console.log(id);
    try {
        const response = await fetch(`http://localhost:8080/deleteRestrictions/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tabelaAtividades.removeChild(linha);
            location.reload()
        } else {
            console.error('Erro ao excluir restricao:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao excluir restricao:', error);
    }
}

function salvarRestricao(button) {

    const linha = button.closest('tr');
    const user = localStorage.getItem('username');

    const restricao = linha.querySelector('input[placeholder="Nova Restricao"]').value;
    const frequencia =  linha.querySelector('input[placeholder="Frequencia"]').value;
    
    const dados = {
        description: restricao,
        frequency: frequencia,
    };


    const urlAddTarefa = apiEndpoint + `/createRestrictions/${user}`;

    fetch(urlAddTarefa, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Restrição salva com sucesso:', data);
        
    })
    .catch(error => {
        console.error('Erro ao salvar a restrição:', error);
    });

    location.reload()
}


carregarRestricoes()