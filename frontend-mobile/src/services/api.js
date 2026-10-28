export const API_BASE_URL = 'https://organic-palm-tree-qvq4rwq95qxjh444r-8080.app.github.dev/api';

const POSTS_INICIAIS = [
  {
    id: 2,
    nomeUsuario: 'estudante.cc',
    fotoPerfilUsuarioUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    imagemUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
    legenda: 'Configurando nosso projeto do bimestre com a equipe!',
    quantidadeCurtidas: 25,
    curtidoPeloUsuarioAtual: true,
    comentarios: [{ id: 2, nomeUsuario: 'ada.lovelace', texto: 'Ficou excelente a arquitetura!' }]
  },
  {
    id: 1,
    nomeUsuario: 'ada.lovelace',
    fotoPerfilUsuarioUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    imagemUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600',
    legenda: 'Comecando os estudos de Programacao Orientada a Objetos em Java!',
    quantidadeCurtidas: 12,
    curtidoPeloUsuarioAtual: false,
    comentarios: [{ id: 1, nomeUsuario: 'estudante.cc', texto: 'Muito bom!' }]
  }
];

export async function buscarPostsApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error('Falha ao buscar posts');
    return await response.json();
  } catch (error) {
    return POSTS_INICIAIS;
  }
}

export async function criarPostApi(novoPost) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPost),
    });
    if (!response.ok) throw new Error('Erro ao criar post');
    return await response.json();
  } catch (error) {
    return {
      id: Date.now(),
      nomeUsuario: novoPost.nomeUsuario || 'estudante.cc',
      fotoPerfilUsuarioUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      imagemUrl: novoPost.imagemUrl,
      legenda: novoPost.legenda,
      quantidadeCurtidas: 0,
      curtidoPeloUsuarioAtual: false,
      comentarios: []
    };
  }
}

export async function curtirPostApi(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/curtir`, { method: 'POST' });
    if (!response.ok) throw new Error('Erro ao curtir');
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function comentarPostApi(postId, texto) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeUsuario: 'estudante.cc', texto }),
    });
    if (!response.ok) throw new Error('Erro ao comentar');
    return await response.json();
  } catch (error) {
    return null;
  }
}
