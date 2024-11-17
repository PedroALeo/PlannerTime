    document.querySelector('form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        const username = document.getElementById('usuario').value.trim();
        const password = document.getElementById('senha').value.trim();

        if (!username || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const apiEndpoint = 'http://localhost:8080/login';
        const credenciais = { password, username };

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credenciais),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login realizado com sucesso!');

                // Salve as informações do usuário (exemplo: token de autenticação) no localStorage
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userId', data.userId);

                // Redireciona para a página inicial ou painel do usuário
                window.location.href = 'dashboard.html';
            } else if (response.status === 401) {
                alert('Usuário ou senha inválidos.');
            } else {
                alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
            }
        } catch (error) {
            console.error('Erro ao tentar autenticar:', error);
            alert('Falha na comunicação com o servidor. Tente novamente mais tarde.');
        }
    });

