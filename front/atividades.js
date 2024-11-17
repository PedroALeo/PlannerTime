const tabelaAtividades = document.getElementById('tabelaAtividades').querySelector('tbody');
const apiEndpoint = 'http://localhost:8080/'; // verificar essa API com o back-end

// Carregar tarefas ao carregar a página
async function carregarTarefas() {

    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');

    const listarTarefas = `localhost:8080/userScheduller/${user}`; //como pegar esse user ?

    try {
        const response = await fetch(listarTarefas,{
                method:'GET'
        });
        const tarefas = await response.json();

        // Adiciona cada tarefa na tabela
        tarefas.forEach(tarefa => {
            const novaLinha = document.createElement('tr');
            novaLinha.dataset.id = tarefa.id; // Guarda o ID da tarefa
            novaLinha.innerHTML = `
                <td>${tarefa.atividade}</td>
                <td>${tarefa.tempoEstimado}</td>
                <td>${tarefa.prioridade}</td>
                <td>${tarefa.prazo}</td>
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
            <button class="btn-editar" onclick="editarTarefa(this)">Salvar</button>
            <button class="btn-excluir" onclick="excluirTarefa(this)">Excluir</button>
        </td>
    `;
    tabelaAtividades.appendChild(novaLinha);
}

// Salvar nova tarefa no back-end
async function salvarNovaTarefa(botao) {
    const linha = botao.closest('tr');
    const inputs = linha.querySelectorAll('.input-edit');
    const tarefa = {
        atividade: inputs[0].value,
        tempoEstimado: inputs[1].value,
        prioridade: inputs[2].value,
        prazo: inputs[3].value,
    };

    try {
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tarefa),
        });

        if (response.ok) {
            const novaTarefa = await response.json();
            linha.dataset.id = novaTarefa.id; // Salva o ID retornado
            editarTarefa(botao); // Converte para modo visualização
        } else {
            console.error('Erro ao salvar tarefa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
    }
}

// Função para editar e salvar uma tarefa
async function editarTarefa(botao) {
    const linha = botao.closest('tr');
    const editando = botao.innerText === 'Salvar';

    if (editando) {
        const inputs = linha.querySelectorAll('.input-edit');
        const tarefaAtualizada = {
            id: linha.dataset.id,
            atividade: inputs[0].value,
            tempoEstimado: inputs[1].value,
            prioridade: inputs[2].value,
            prazo: inputs[3].value,
        };

        try {
            const response = await fetch(`${apiEndpoint}/${tarefaAtualizada.id}`, {
                method: 'PUT',
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
/*
async function excluirTarefa(botao) {
    const linha = botao.closest('tr');
    const id = linha.dataset.id;

    try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            tabelaAtividades.removeChild(linha);
        } else {
            console.error('Erro ao excluir tarefa:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
    }
}
*/
// Carregar as tarefas inicialmente
carregarTarefas();





// Função para excluir uma tarefa
function excluirTarefa(botao) {
    const linha = botao.closest('tr');
    tabelaAtividades.removeChild(linha);
}
