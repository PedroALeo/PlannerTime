// Função para adicionar uma nova restricao
function adicionarRestricao() {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td><input type="text" class="input-edit" placeholder="Nova Restricao" /></td>
        <td><input type="text" class="input-edit" placeholder="Frequencia" /></td>
        <td>
            <button class="btn-editar" onclick="salvarTarefa(this)">Salvar</button>
            <button class="btn-excluir" onclick="excluirTarefa(this)">Excluir</button>
        </td>
    `;
    tabelaAtividades.appendChild(novaLinha);
}