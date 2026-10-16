export const API_BASE_URL = 'http://localhost:8080/api';

export async function buscarPostsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const dados = await response.json();
    return dados;
  } catch (erro) {
    console.error('Erro ao conectar com o servidor Java:', erro);
    return [];
  }
}
