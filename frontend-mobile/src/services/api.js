export const API_BASE_URL = 'https://improved-doodle-xrwp6jw9gv952p7xp.github.dev/api';

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
