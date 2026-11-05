export const API_BASE_URL = 'https://organic-palm-tree-qvq4rwq95qxjh444r-8080.app.github.dev/api';

export async function loginApi(usuario, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuario?.trim(), senha }),
  });
  if (!response.ok) throw new Error('Credenciais invalidas');
  return await response.json();
}

export async function registrarApi(usuario, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuario?.trim(), senha }),
  });
  if (!response.ok) throw new Error('Usuario ja existe ou dados invalidos');
  return await response.json();
}

export async function listarUsuariosApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/usuarios`);
    if (!response.ok) throw new Error('Erro ao listar usuarios');
    return await response.json();
  } catch (e) {
    return [
      { nomeUsuario: 'estudante.cc' },
      { nomeUsuario: 'ada.lovelace' }
    ];
  }
}

export async function buscarPostsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    return [];
  }
}

export async function criarPostApi(novoPost) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoPost),
  });
  if (!response.ok) throw new Error('Erro ao criar post');
  return await response.json();
}

export async function curtirPostApi(postId) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/curtir`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Erro ao curtir post');
  return await response.json();
}

export async function comentarPostApi(postId, autor, texto) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ autor, nomeUsuario: autor, usuario: autor, texto }),
  });
  if (!response.ok) throw new Error('Erro ao comentar no post');
  return await response.json();
}

export async function buscarMensagensApi(u1, u2) {
  try {
    const p1 = encodeURIComponent(u1 || '');
    const p2 = encodeURIComponent(u2 || '');
    const response = await fetch(`${API_BASE_URL}/mensagens?user1=${p1}&user2=${p2}`);
    if (!response.ok) return [];
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
  if (!response.ok) throw new Error('Erro ao enviar mensagem');
  return await response.json();
}
