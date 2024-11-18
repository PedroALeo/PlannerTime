const tabelaAtividades = document.getElementById('tabelaAtividades').querySelector('tbody');
const apiEndpoint = 'http://localhost:8080';

// Carregar tarefas ao carregar a página
async function carregarTarefas() {

    const user = localStorage.getItem('username');

    const listarTarefas = `http://localhost:8080/userScheduller/${user}`;

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
            novaLinha.dataset.id = tarefa.eventId; // Guarda o ID da tarefa
            novaLinha.innerHTML = `
                <td>${tarefa.description}</td>
                <td>${tarefa.duration}</td>
                <td>${tarefa.priority}</td>
                <td>${tarefa.end}</td>
                <td>
                    <button class="btn-editar" onclick="editarTarefa(this)">Editar</button>
                    <button class="btn-excluir" onclick="excluirTarefa(this)">Excluir</button>
                </td>
            `;
            tabelaAtividades.appendChild(novaLinha);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}



// Função para adicionar uma nova tarefa
function adicionarTarefa() {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td><input type="text" class="input-edit" placeholder="Nova Atividade" /></td>
        <td><input type="text" class="input-edit" placeholder="Tempo Estimado" /></td>
        <td><input type="text" class="input-edit" placeholder="Prioridade" /></td>
        <td><input type="text" class="input-edit" placeholder="Prazo" /></td>
        <td>
            <button class="btn-editar" onclick="salvarTarefa(this)">Salvar</button>
            <button class="btn-excluir" onclick="excluirTarefa(this)">Excluir</button>
        </td>
    `;
    tabelaAtividades.appendChild(novaLinha);
}

function salvarTarefa(button) {

    const linha = button.closest('tr');
    const user = localStorage.getItem('username');

    const atividade = linha.querySelector('input[placeholder="Nova Atividade"]').value;
    const tempoEstimado =  parseInt(linha.querySelector('input[placeholder="Tempo Estimado"]').value);
    const prioridade =  parseInt(linha.querySelector('input[placeholder="Prioridade"]').value);
    const prazo = linha.querySelector('input[placeholder="Prazo"]').value;

    const dados = {
        description: atividade,
        duration: tempoEstimado,
        priority: prioridade,
        endDate: prazo
    };

    console.log(dados)

    const urlAddTarefa = apiEndpoint + `/createEvent/${user}`;

    fetch(urlAddTarefa, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tarefa salva com sucesso:', data);
    })
    .catch(error => {
        console.error('Erro ao salvar a tarefa:', error);
    });

    location.reload()
}

// Função para editar e salvar uma tarefa
async function editarTarefa(botao) {
    const linha = botao.closest('tr');
    const editando = botao.innerText === 'Salvar';

    if (editando) {
        const inputs = linha.querySelectorAll('.input-edit');
        const tarefaAtualizada = {
            eventId: parseInt(linha.dataset.id),
            description: inputs[0].value,
            duration: parseInt(inputs[1].value),
            priority: parseInt(inputs[2].value),
            end: inputs[3].value,
        };
        console.log(tarefaAtualizada)

        try {
            const response = await fetch(`${apiEndpoint}/updateEvent`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarefaAtualizada),
            });

            if (response.ok) {
                inputs.forEach(input => {
                    const valor = input.value;
                    const novaCelula = document.createElement('td');
                    novaCelula.innerText = valor;
                    input.closest('td').replaceWith(novaCelula);
                });
                botao.innerText = 'Editar';
            } else {
                console.error('Erro ao atualizar tarefa:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
        }
    } else {
        const celulas = linha.querySelectorAll('td:not(:last-child)');
        celulas.forEach(celula => {
            const valor = celula.innerText;
            celula.innerHTML = `<input type="text" class="input-edit" value="${valor}" />`;
        });
        botao.innerText = 'Salvar';
    }
}

/*
// Função para editar e salvar uma tarefa
function editarTarefa(botao) {
    const linha = botao.closest('tr');
    const editando = botao.innerText === 'Salvar';

    if (editando) {
        // Troca de modo edição para visualização
        const inputs = linha.querySelectorAll('.input-edit');
        inputs.forEach(input => {
            const valor = input.value;
            const novaCelula = document.createElement('td');
            novaCelula.innerText = valor;
            input.closest('td').replaceWith(novaCelula);
        });
        botao.innerText = 'Editar';
    } else {
        // Troca de modo visualização para edição
        const celulas = linha.querySelectorAll('td:not(:last-child)');
        celulas.forEach(celula => {
            const valor = celula.innerText;
            celula.innerHTML = `<input type="text" class="input-edit" value="${valor}" />`;
        });
        botao.innerText = 'Salvar';
    }
}
*/

// Função para excluir uma tarefa

async function excluirTarefa(botao) {
    const linha = botao.closest('tr');
    const id = linha.dataset.id;
    console.log(id);
    try {
        const response = await fetch(`${apiEndpoint}/deleteEvent/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tabelaAtividades.removeChild(linha);
            location.reload()
        } else {
            console.error('Erro ao excluir tarefa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
    }
}

// Carregar as tarefas inicialmente
carregarTarefas();





// Função para excluir uma tarefa
/*
function excluirTarefa(botao) {
    const linha = botao.closest('tr');
    tabelaAtividades.removeChild(linha);
}
    */
