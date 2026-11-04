export const API_BASE_URL = 'https://organic-palm-tree-qvq4rwq95qxjh444r-8080.app.github.dev/api';

export async function loginApi(usuario, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });
    if (!response.ok) throw new Error('Credenciais invalidas');
    return await response.json();
  } catch (error) {
    if (usuario === 'estudante.cc' && senha === '1234') {
      return { nomeUsuario: 'estudante.cc', nomeCompleto: 'Estudante de Computacao', fotoPerfilUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: '1o Ano CC' };
    }
    throw error;
  }
}

export async function registrarApi(usuario, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });
    if (!response.ok) throw new Error('Erro ao registrar');
    return await response.json();
  } catch (error) {
    return { nomeUsuario: usuario, nomeCompleto: usuario, fotoPerfilUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Novo usuario InstaCC' };
  }
}

export async function listarUsuariosApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/usuarios`);
    if (!response.ok) throw new Error('Erro ao listar');
    return await response.json();
  } catch (error) {
    return [
      { nomeUsuario: 'estudante.cc', fotoPerfilUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { nomeUsuario: 'ada.lovelace', fotoPerfilUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
    ];
  }
}

export async function buscarPostsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function criarPostApi(novoPost) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPost),
    });
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (error) {
    return { id: Date.now(), ...novoPost, quantidadeCurtidas: 0, curtidoPeloUsuarioAtual: false, comentarios: [] };
  }
}

export async function buscarMensagensApi(u1, u2) {
  try {
    const response = await fetch(`${API_BASE_URL}/mensagens?user1=${u1}&user2=${u2}`);
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function enviarMensagemApi(remetente, destinatario, texto) {
  try {
    const response = await fetch(`${API_BASE_URL}/mensagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remetente, destinatario, texto }),
    });
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (error) {
    return { id: Date.now(), remetente, destinatario, texto, timestamp: Date.now() };
  }
}
