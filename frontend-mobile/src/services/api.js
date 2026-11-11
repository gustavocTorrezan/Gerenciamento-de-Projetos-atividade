function resolverBaseUrl() {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host.includes('.app.github.dev')) {
      const backendHost = host.replace(/-(8081|19006|19000|3000|5173)\.app\.github\.dev/, '-8080.app.github.dev');
      return `https://${backendHost}/api`;
    }
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
  }
  return 'https://organic-palm-tree-qvq4rwq95qxjh444r-8080.app.github.dev/api';
}

export const API_BASE_URL = resolverBaseUrl();

const STORIES_FALLBACK = [
  {
    id: 1,
    nomeUsuario: 'estudante.cc',
    avatarUrl: 'https://ui-avatars.com/api/?background=E1306C&color=fff&name=EC',
    imagemUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    legenda: 'Codando a nova sprint do InstaCC! 🚀'
  },
  {
    id: 2,
    nomeUsuario: 'ada.lovelace',
    avatarUrl: 'https://ui-avatars.com/api/?background=833AB4&color=fff&name=AL',
    imagemUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    legenda: 'Revisando algoritmos e estruturas de dados ☕'
  },
  {
    id: 3,
    nomeUsuario: 'alan.turing',
    avatarUrl: 'https://ui-avatars.com/api/?background=F77737&color=fff&name=AT',
    imagemUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    legenda: 'Testando criptografia no back-end Java 🔐'
  }
];

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

export async function buscarPostsPaginadosApi(pagina = 1, limite = 3) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/paginado?pagina=${pagina}&limite=${limite}`);
    if (!response.ok) return await buscarPostsApi();
    return await response.json();
  } catch (e) {
    return [];
  }
}

export async function buscarStoriesApi() {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`);
    if (!response.ok) return STORIES_FALLBACK;
    const dados = await response.json();
    return Array.isArray(dados) && dados.length > 0 ? dados : STORIES_FALLBACK;
  } catch (e) {
    return STORIES_FALLBACK;
  }
}

export async function criarStoryApi(nomeUsuario, imagemUrl, legenda = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeUsuario, imagemUrl, legenda }),
    });
    if (!response.ok) throw new Error('Fallback local');
    return await response.json();
  } catch (e) {
    return {
      id: Date.now(),
      nomeUsuario,
      avatarUrl: `https://ui-avatars.com/api/?background=E1306C&color=fff&name=${encodeURIComponent(nomeUsuario)}`,
      imagemUrl,
      legenda
    };
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
  try {
    const idOriginal = String(postId).split('-page-')[0];
    const response = await fetch(`${API_BASE_URL}/posts/${idOriginal}/curtir`, {
      method: 'POST',
    });
    if (!response.ok) return null;
    const texto = await response.text();
    return texto ? JSON.parse(texto) : null;
  } catch (e) {
    return null;
  }
}

export async function comentarPostApi(postId, autor, texto) {
  try {
    const idOriginal = String(postId).split('-page-')[0];
    const response = await fetch(`${API_BASE_URL}/posts/${idOriginal}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, nomeUsuario: autor, usuario: autor, texto }),
    });
    if (!response.ok) return null;
    const body = await response.text();
    return body ? JSON.parse(body) : null;
  } catch (e) {
    return null;
  }
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
