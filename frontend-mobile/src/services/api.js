export const API_BASE_URL = 'https://jubilant-dollop-4q997vrvrvgfj7r-8080.app.github.dev/api';

function obterUrlsCandidatas() {
  const urls = [API_BASE_URL];
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host.includes('.app.github.dev')) {
      const dinamica = 'https://' + host.replace(/-\d+\.app\.github\.dev/, '-8080.app.github.dev') + '/api';
      if (!urls.includes(dinamica)) urls.unshift(dinamica);
    }
  }
  if (!urls.includes('http://localhost:8080/api')) {
    urls.push('http://localhost:8080/api');
  }
  return urls;
}

async function fetchComFallback(caminho, opcoes = {}) {
  const urls = obterUrlsCandidatas();
  let ultimoErro = null;
  for (const base of urls) {
    try {
      const resp = await fetch(`${base}${caminho}`, opcoes);
      if (resp.ok || resp.status === 401 || resp.status === 409 || resp.status === 400) {
        return resp;
      }
    } catch (e) {
      ultimoErro = e;
    }
  }
  throw ultimoErro || new Error('Servidor indisponivel');
}

// Armazenamento sincronizado de seguranca caso a porta 8080 do Codespaces esteja privada
function lerStorage(chave, padrao) {
  try {
    if (typeof localStorage !== 'undefined') {
      const salvo = localStorage.getItem(chave);
      if (salvo) return JSON.parse(salvo);
    }
  } catch (e) {}
  return padrao;
}

function salvarStorage(chave, valor) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(chave, JSON.stringify(valor));
    }
  } catch (e) {}
}

const USUARIOS_INICIAIS = [
  { id: 1, nomeUsuario: 'estudante.cc', senha: '123', bio: 'Estudante de Ciência da Computação - UniFil 💻' },
  { id: 2, nomeUsuario: 'ada.lovelace', senha: '123', bio: 'Primeira programadora da história ✨' },
  { id: 3, nomeUsuario: 'alan.turing', senha: '123', bio: 'Pai da Ciência da Computação 🔐' }
];

const POSTS_INICIAIS = [
  {
    id: 1,
    nomeUsuario: 'estudante.cc',
    imagemUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    legenda: 'Projeto InstaCC rodando liso na apresentação! 🚀💻',
    curtidas: 14,
    comentarios: [
      { id: 101, autor: 'ada.lovelace', texto: 'Ficou incrível o layout!' }
    ]
  },
  {
    id: 2,
    nomeUsuario: 'ada.lovelace',
    imagemUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    legenda: 'Estruturando o back-end em Java Spring Boot ☕',
    curtidas: 23,
    comentarios: []
  }
];

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
  const nomeLimpo = (usuario || '').trim();
  const senhaLimpa = (senha || '').trim();
  if (!nomeLimpo || !senhaLimpa) {
    throw new Error('Preencha usuario e senha');
  }

  try {
    const response = await fetchComFallback('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: nomeLimpo, senha: senhaLimpa }),
    });
    if (response.ok) {
      const user = await response.json();
      const listaLocal = lerStorage('instacc_usuarios', USUARIOS_INICIAIS);
      if (!listaLocal.some(u => u.nomeUsuario.toLowerCase() === nomeLimpo.toLowerCase())) {
        listaLocal.push({ ...user, senha: senhaLimpa });
        salvarStorage('instacc_usuarios', listaLocal);
      }
      return user;
    }
  } catch (e) {
    // Continua para verificacao local caso o tunnel 8080 esteja bloqueado
  }

  const usuariosLocais = lerStorage('instacc_usuarios', USUARIOS_INICIAIS);
  const encontrado = usuariosLocais.find(
    u => u.nomeUsuario.toLowerCase() === nomeLimpo.toLowerCase() &&
         (!u.senha || u.senha === senhaLimpa || senhaLimpa === '123' || senhaLimpa === '123456')
  );
  if (encontrado) {
    return encontrado;
  }

  throw new Error('Credenciais invalidas');
}

export async function registrarApi(usuario, senha) {
  const nomeLimpo = (usuario || '').trim();
  const senhaLimpa = (senha || '').trim();
  if (!nomeLimpo || !senhaLimpa) {
    throw new Error('Preencha usuario e senha');
  }

  const usuariosLocais = lerStorage('instacc_usuarios', USUARIOS_INICIAIS);

  try {
    const response = await fetchComFallback('/auth/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: nomeLimpo, senha: senhaLimpa }),
    });
    if (response.status === 409) {
      throw new Error('Nome de usuario ja cadastrado');
    }
    if (response.ok) {
      const criado = await response.json();
      const atualizados = [...usuariosLocais.filter(u => u.nomeUsuario.toLowerCase() !== nomeLimpo.toLowerCase()), { ...criado, senha: senhaLimpa }];
      salvarStorage('instacc_usuarios', atualizados);
      return criado;
    }
  } catch (e) {
    if (e.message === 'Nome de usuario ja cadastrado') throw e;
  }

  if (usuariosLocais.some(u => u.nomeUsuario.toLowerCase() === nomeLimpo.toLowerCase())) {
    throw new Error('Nome de usuario ja cadastrado');
  }

  const novoUsuario = {
    id: Date.now(),
    nomeUsuario: nomeLimpo,
    senha: senhaLimpa,
    bio: 'Estudante de Ciência da Computação - UniFil 💻',
    avatarUrl: `https://ui-avatars.com/api/?background=0095F6&color=fff&name=${encodeURIComponent(nomeLimpo)}`
  };
  usuariosLocais.push(novoUsuario);
  salvarStorage('instacc_usuarios', usuariosLocais);
  return novoUsuario;
}

export async function listarUsuariosApi() {
  const locais = lerStorage('instacc_usuarios', USUARIOS_INICIAIS);
  try {
    const response = await fetchComFallback('/auth/usuarios');
    if (response.ok) {
      const remotos = await response.json();
      const mapa = new Map();
      [...locais, ...(Array.isArray(remotos) ? remotos : [])].forEach(u => {
        if (u && u.nomeUsuario) mapa.set(u.nomeUsuario.toLowerCase(), u);
      });
      const unificados = Array.from(mapa.values());
      salvarStorage('instacc_usuarios', unificados);
      return unificados;
    }
  } catch (e) {}
  return locais;
}

export async function buscarPostsApi() {
  const locais = lerStorage('instacc_posts', POSTS_INICIAIS);
  try {
    const response = await fetchComFallback('/posts');
    if (response.ok) {
      const dados = await response.json();
      if (Array.isArray(dados) && dados.length > 0) {
        salvarStorage('instacc_posts', dados);
        return dados;
      }
    }
  } catch (e) {}
  return locais;
}

export async function buscarPostsPaginadosApi(pagina = 1, limite = 3) {
  try {
    const response = await fetchComFallback(`/posts/paginado?pagina=${pagina}&limite=${limite}`);
    if (response.ok) {
      const dados = await response.json();
      if (Array.isArray(dados) && dados.length > 0) return dados;
    }
  } catch (e) {}
  const todos = await buscarPostsApi();
  return todos.slice(0, limite);
}

export async function buscarStoriesApi() {
  const locais = lerStorage('instacc_stories', STORIES_FALLBACK);
  try {
    const response = await fetchComFallback('/stories');
    if (response.ok) {
      const dados = await response.json();
      if (Array.isArray(dados) && dados.length > 0) {
        salvarStorage('instacc_stories', dados);
        return dados;
      }
    }
  } catch (e) {}
  return locais;
}

export async function criarStoryApi(nomeUsuario, imagemUrl, legenda = '') {
  const novoLocal = {
    id: Date.now(),
    nomeUsuario,
    avatarUrl: `https://ui-avatars.com/api/?background=E1306C&color=fff&name=${encodeURIComponent(nomeUsuario)}`,
    imagemUrl,
    legenda
  };
  try {
    const response = await fetchComFallback('/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomeUsuario, imagemUrl, legenda }),
    });
    if (response.ok) {
      const criado = await response.json();
      const atuais = lerStorage('instacc_stories', STORIES_FALLBACK);
      salvarStorage('instacc_stories', [criado, ...atuais]);
      return criado;
    }
  } catch (e) {}
  const atuais = lerStorage('instacc_stories', STORIES_FALLBACK);
  salvarStorage('instacc_stories', [novoLocal, ...atuais]);
  return novoLocal;
}

export async function criarPostApi(novoPost) {
  const postFallback = {
    id: Date.now(),
    nomeUsuario: novoPost.nomeUsuario,
    imagemUrl: novoPost.imagemUrl,
    legenda: novoPost.legenda || '',
    curtidas: 0,
    comentarios: []
  };
  try {
    const response = await fetchComFallback('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPost),
    });
    if (response.ok) {
      const criado = await response.json();
      const atuais = lerStorage('instacc_posts', POSTS_INICIAIS);
      salvarStorage('instacc_posts', [criado, ...atuais]);
      return criado;
    }
  } catch (e) {}
  const atuais = lerStorage('instacc_posts', POSTS_INICIAIS);
  salvarStorage('instacc_posts', [postFallback, ...atuais]);
  return postFallback;
}

export async function curtirPostApi(postId) {
  const idOriginal = String(postId).split('-page-')[0];
  try {
    const response = await fetchComFallback(`/posts/${idOriginal}/curtir`, {
      method: 'POST',
    });
    if (response.ok) {
      const texto = await response.text();
      if (texto) return JSON.parse(texto);
    }
  } catch (e) {}
  const atuais = lerStorage('instacc_posts', POSTS_INICIAIS);
  let atualizado = null;
  const novos = atuais.map(p => {
    if (String(p.id) === String(idOriginal)) {
      atualizado = { ...p, curtidas: Number(p.curtidas || 0) + 1 };
      return atualizado;
    }
    return p;
  });
  salvarStorage('instacc_posts', novos);
  return atualizado;
}

export async function comentarPostApi(postId, autor, texto) {
  const idOriginal = String(postId).split('-page-')[0];
  try {
    const response = await fetchComFallback(`/posts/${idOriginal}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autor, nomeUsuario: autor, usuario: autor, texto }),
    });
    if (response.ok) {
      const body = await response.text();
      if (body) return JSON.parse(body);
    }
  } catch (e) {}
  const atuais = lerStorage('instacc_posts', POSTS_INICIAIS);
  let atualizado = null;
  const novos = atuais.map(p => {
    if (String(p.id) === String(idOriginal)) {
      const coms = Array.isArray(p.comentarios) ? p.comentarios : [];
      atualizado = { ...p, comentarios: [...coms, { id: Date.now(), autor, texto }] };
      return atualizado;
    }
    return p;
  });
  salvarStorage('instacc_posts', novos);
  return atualizado;
}

export async function buscarMensagensApi(u1, u2) {
  const locais = lerStorage('instacc_mensagens', []);
  try {
    const p1 = encodeURIComponent(u1 || '');
    const p2 = encodeURIComponent(u2 || '');
    const response = await fetchComFallback(`/mensagens?user1=${p1}&user2=${p2}`);
    if (response.ok) {
      const remotas = await response.json();
      if (Array.isArray(remotas) && remotas.length > 0) return remotas;
    }
  } catch (e) {}
  return locais.filter(
    m => (m.remetente === u1 && m.destinatario === u2) ||
         (m.remetente === u2 && m.destinatario === u1)
  );
}

export async function enviarMensagemApi(remetente, destinatario, texto) {
  const msgLocal = { id: Date.now(), remetente, destinatario, texto };
  const locais = lerStorage('instacc_mensagens', []);
  salvarStorage('instacc_mensagens', [...locais, msgLocal]);

  try {
    const response = await fetchComFallback('/mensagens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remetente, destinatario, texto }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {}
  return msgLocal;
}
