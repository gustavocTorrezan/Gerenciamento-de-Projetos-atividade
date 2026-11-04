export const API_BASE_URL = 'https://organic-palm-tree-qvq4rwq95qxjh444r-8080.app.github.dev/api';

export async function loginApi(usuario, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha }),
  });
  if (!response.ok) throw new Error('Credenciais invalidas');
  return await response.json();
}

export async function registrarApi(usuario, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha }),
  });
  if (!response.ok) throw new Error('Erro ao registrar');
  return await response.json();
}

export async function listarUsuariosApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/usuarios`);
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (e) {
    return [
      { nomeUsuario: 'estudante.cc' },
      { nomeUsuario: 'ada.lovelace' }
    ];
  }
}

export async function buscarPostsApi() {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return await response.json();
}

export async function criarPostApi(novoPost) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoPost),
  });
  return await response.json();
}

export async function buscarMensagensApi(u1, u2) {
  try {
    const response = await fetch(`${API_BASE_URL}/mensagens?user1=${u1}&user2=${u2}`);
    if (!response.ok) throw new Error('Erro');
    return await response.json();
  } catch (e) {
    return [];
  }
}

export async function enviarMensagemApi(remetente, destinatario, texto) {
  const response = await fetch(`${API_BASE_URL}/mensagens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ remetente, destinatario, texto }),
  });
  return await response.json();
}
