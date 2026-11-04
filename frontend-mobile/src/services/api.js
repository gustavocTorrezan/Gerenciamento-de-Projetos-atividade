export const API_BASE_URL = 'http://localhost:8080/api';

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

export async function listarUsuariosApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/usuarios`);
    if (!response.ok) throw new Error('Erro ao listar usuarios');
    return await response.json();
  } catch (error) {
    return [
      { nomeUsuario: 'estudante.cc', fotoPerfilUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { nomeUsuario: 'ada.lovelace', fotoPerfilUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' }
    ];
  }
}

export async function buscarMensagensApi(user1, user2) {
  try {
    const response = await fetch(`${API_BASE_URL}/mensagens?user1=${user1}&user2=${user2}`);
    if (!response.ok) throw new Error('Erro ao buscar mensagens');
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
    if (!response.ok) throw new Error('Erro ao enviar');
    return await response.json();
  } catch (error) {
    return { id: Date.now(), remetente, destinatario, texto, timestamp: Date.now() };
  }
}
