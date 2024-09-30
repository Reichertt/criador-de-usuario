//O useEffect é uma ferramenta poderosa para gerenciar efeitos colaterais em componentes React, tornando possível implementar lógica que interage com o mundo externo ou que precisa ser limpa quando o componente deixa de existir.
import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/trash.svg'
import api from '../../services/api'

function Home() {

  const [users, setUser] = useState([])

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  // Função assincrona que trás os usuários do servidor
  async function getUsers() {
    // No React, await é uma palavra-chave usada em conjunto com async para lidar com operações assíncronas, como chamadas a APIs ou funções que retornam Promises.
    const usersFromApi = await api.get('/usuarios')

    setUser(usersFromApi.data)
  }

// Função para criar novos usuários
async function createUser() {
  try {
    await api.post('/usuarios', {
      nome: inputName.current.value,
      idade: inputAge.current.value,
      email: inputEmail.current.value
    });

    // Limpar os campos de input após salvar
    inputName.current.value = '';
    inputAge.current.value = '';
    inputEmail.current.value = '';

    // Depois de criar um novo usuário, atualiza a lista
    getUsers();
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
}

  // Função para deletar usuário
  async function deleteUser(id) {
    // A crase `` é utilizada para usar variavel
    await api.delete(`/usuarios/${id}`)

    // Depois de deletar um usuário, a tela é atualizada 
    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, []);

  return (
    <div className='container'>
      <form action="">
        <h1>Cadastro de usuário</h1>
        <input placeholder="Nome" type="text" name='nome' ref={inputName} />
        <input placeholder="Idade" type="number" name='idade' ref={inputAge} />
        <input placeholder="Seu melhor E-mail" type="email" name='email' ref={inputEmail} />
        <button type='button' onClick={createUser}>Cadastrar</button>
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome:  <span>{user.nome}</span></p>
            <p>Idade: <span>{user.idade}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <button onClick={() => deleteUser(user.id)}>
            <img src={Trash} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Home
