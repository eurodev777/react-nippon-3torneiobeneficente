import React, { useEffect, useMemo, useRef, useState } from "react";

type JogosModo = "fotos" | "sistema";

type Categoria = {
  id: number | string;

  nome: string;
};

type Torneio = {
  id: number | string;

  titulo: string;

  subtitulo?: string;

  status?: string;

  campeao_nome?: string;

  vice_nome?: string;

  terceiro_nome?: string;

  campeao_repescagem_nome?: string;
};

type Dupla = {
  id: number | string;

  nome?: string;

  equipe_nome?: string;

  equipe_base_nome?: string;

  cidade?: string;

  clube?: string;

  jogador1?: string;

  jogador2?: string;
};

type SetJogo = {
  id?: number | string;

  jogo_id?: number | string;

  numero_set?: number | string;

  pontos_dupla1?: number | string | null;

  pontos_dupla2?: number | string | null;
};

type PartidaConfronto3 = {
  id: number | string;
  numero_jogo?: number | string;
  dupla1_id?: number | string | null;
  dupla2_id?: number | string | null;
  dupla1_label?: string;
  dupla2_label?: string;
  dupla1_nome?: string;
  dupla2_nome?: string;
  dupla1_jogador1?: string;
  dupla1_jogador2?: string;
  dupla2_jogador1?: string;
  dupla2_jogador2?: string;
  placar1?: string | number | null;
  placar2?: string | number | null;
  vencedor_nome?: string;
  status?: string;
  observacao?: string;
  sets?: SetJogo[];
};

type ConfrontoTres = {
  id?: number | string;
  equipe1_nome?: string;
  equipe2_nome?: string;
  vencedor_equipe_nome?: string;
  partidas?: PartidaConfronto3[];
};

type Jogo = {
  id: number | string;

  tipo_chave?: "principal" | "repescagem" | "final" | string;

  coluna_chave?: number | string;

  fase?: string;

  codigo?: string;

  data_jogo?: string;

  ordem?: number | string;

  status?: string;

  dupla1_id?: number | string | null;

  dupla2_id?: number | string | null;

  dupla1_nome?: string;

  dupla2_nome?: string;

  dupla1_label?: string;

  dupla2_label?: string;

  dupla1_equipe_nome?: string;

  dupla2_equipe_nome?: string;

  dupla1_jogador1?: string;

  dupla1_jogador2?: string;

  dupla2_jogador1?: string;

  dupla2_jogador2?: string;

  placar1?: string | number | null;

  placar2?: string | number | null;

  vencedor_nome?: string;

  grupo_numero?: number | string | null;

  observacao?: string;

  confronto3?: ConfrontoTres;

  /** Identifica um sub-jogo retornado dentro de confronto3.partidas. */
  ehPartidaConfronto3?: boolean;

  sets?: SetJogo[];
};

type DetalhesChave = {
  torneio?: Torneio;

  duplas?: Dupla[];

  jogos?: Jogo[];

  sets?: SetJogo[];
};

type JogosPageProps = {
  onBack?: () => void;

  initialMode?: JogosModo;
};

type UnidadeVisual = {
  chave: string;
  jogo: Jogo;
  partidas: Jogo[];
  triplo: boolean;
};

type CardLayout = {
  unidade: UnidadeVisual;
  top: number;
  left: number;
};

type TitleLayout = {
  label: string;

  top: number;

  left: number;

  width: number;
};

const API_IMAGENS =
  "https://sothink.com.br/apibeneficiente3/api/v2/nippon/list-images";

const BASE_IMAGENS = "https://sothink.com.br/apibeneficiente3/";

const API_CHAVES =
  "https://sothink.com.br/apibeneficiente3/apichaves/api/jogos";

const CARD_W = 355;

const CARD_H = 184;

// A unidade visual de um confronto pode conter três partidas lado a lado.
const GAP_TRIO = 14;
const LARGURA_TRIO = CARD_W * 3 + GAP_TRIO * 2;
const ALTURA_UNIDADE = CARD_H + 54;

const GAP_COL = 36;

const GAP_SECAO = 44;

const BOARD_TOP = 72;

const GROUP_TITLE_H = 34;

const RESULT_W = 240;

const RESULT_GAP = 28;

function texto(valor: unknown): string {
  return String(valor ?? "").trim();
}

function normalizar(valor: unknown): string {
  return texto(valor).toLowerCase();
}

function idNumerico(valor: unknown): number {
  return Number(valor || 0);
}

function urlImagem(caminho: string): string {
  if (!caminho) return "";

  if (caminho.startsWith("http://") || caminho.startsWith("https://")) {
    return caminho;
  }

  return BASE_IMAGENS + caminho.replace(/^\/+/, "");
}

function pareceImagem(valor: string): boolean {
  const v = valor.trim();

  if (!v) return false;

  if (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(v)) {
    return true;
  }

  if (/\/(uploads|storage|images|imagens|galeria|chaves)\//i.test(v)) {
    return true;
  }

  return false;
}

function extrairImagensDaApi(payload: unknown): string[] {
  const imagens: string[] = [];

  const vistos = new Set<string>();

  const adicionar = (valor: unknown, forcar = false) => {
    if (typeof valor !== "string") return;

    const limpo = valor.trim();

    if (!limpo) return;

    if (!forcar && !pareceImagem(limpo)) return;

    if (vistos.has(limpo)) return;

    vistos.add(limpo);

    imagens.push(limpo);
  };

  const visitar = (valor: unknown) => {
    if (!valor) return;

    if (typeof valor === "string") {
      adicionar(valor);

      return;
    }

    if (Array.isArray(valor)) {
      valor.forEach(visitar);

      return;
    }

    if (typeof valor !== "object") return;

    const obj = valor as Record<string, unknown>;

    /*

     * Aceita todos os formatos comuns:

     * [{ image_1: "..." }]

     * [{ imagem: "..." }]

     * { data: [{ imagem: "..." }] }

     * { imagem: "..." }

     * { foto: "..." }

     * { url: "..." }

     */

    [
      "image_1",

      "image_2",

      "image_3",

      "image_4",

      "image_5",

      "image",

      "imagem",

      "foto",

      "file",

      "arquivo",

      "path",

      "caminho",

      "url",

      "src",
    ].forEach((key) => {
      if (key in obj) adicionar(obj[key], true);
    });

    [
      "data",

      "dados",

      "result",

      "results",

      "items",

      "lista",

      "imagens",

      "images",

      "fotos",

      "galeria",

      "chaves",
    ].forEach((key) => {
      if (key in obj) visitar(obj[key]);
    });

    Object.entries(obj).forEach(([key, value]) => {
      if (
        key.startsWith("image_") ||
        key.includes("imagem") ||
        key.includes("foto") ||
        key.includes("arquivo")
      ) {
        adicionar(value, true);
      }
    });
  };

  visitar(payload);

  return imagens;
}

function formatarData(data?: string): string {
  if (!data) return "";

  const d = new Date(String(data).replace(" ", "T"));

  if (Number.isNaN(d.getTime())) {
    return String(data);
  }

  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", {
      hour: "2-digit",

      minute: "2-digit",
    })
  );
}

async function apiChaves<T>(
  rota: string,

  params: Record<string, unknown> = {},
): Promise<T> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  query.set("action", rota);

  const url = `${API_CHAVES}?${query.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ${res.status} ao carregar dados`);
  }

  const json = await res.json();

  if (json?.sucesso === false) {
    throw new Error(json.erro || "Erro na API de chaves");
  }

  return json;
}

function ordemJogo(jogo: Jogo): number {
  return Number(jogo.ordem ?? 999);
}

function ordenarJogos(lista: Jogo[]): Jogo[] {
  return [...lista].sort((a, b) => {
    const oa = ordemJogo(a);

    const ob = ordemJogo(b);

    if (oa !== ob) return oa - ob;

    return Number(a.id || 0) - Number(b.id || 0);
  });
}

function colunaDoJogo(jogo: Jogo): number {
  const coluna = Number(jogo.coluna_chave || 1);

  if (!Number.isFinite(coluna)) {
    return 1;
  }

  return Math.max(1, Math.min(4, coluna || 1));
}

function maxColuna(jogos: Jogo[]): number {
  if (!jogos.length) return 1;

  return Math.max(1, ...jogos.map(colunaDoJogo));
}

function larguraColunas(qtd: number): number {
  return qtd * CARD_W + Math.max(0, qtd - 1) * GAP_COL;
}

function nomeClubeCidade(dupla?: Dupla): string {
  if (!dupla) return "";

  return (
    texto(dupla.equipe_nome) ||
    texto(dupla.equipe_base_nome) ||
    texto(dupla.cidade) ||
    texto(dupla.clube)
  );
}

function jogadoresDaDupla(dupla?: Dupla): string {
  if (!dupla) return "";

  return [texto(dupla.jogador1), texto(dupla.jogador2)]

    .filter(Boolean)

    .join(" / ");
}

function labelLivre(jogo: Jogo, lado: 1 | 2): string {
  return (
    texto(jogo[`dupla${lado}_label` as keyof Jogo]) ||
    texto(jogo[`dupla${lado}_nome` as keyof Jogo]) ||
    "A definir"
  );
}

function dadosLado(jogo: Jogo, lado: 1 | 2, duplas: Dupla[]) {
  const duplaId = idNumerico(jogo[`dupla${lado}_id` as keyof Jogo]);

  const dupla = duplas.find((d) => idNumerico(d.id) === duplaId);
  const rotulo = texto(jogo[`dupla${lado}_label` as keyof Jogo]);
  // A V34 permite rótulos provisórios mesmo quando já há ID de dupla.
  if (
    rotulo &&
    (/^(?:\d+[º°]|vencedor|perdedor|classificado|aguardando|a definir)/i.test(
      rotulo,
    ) ||
      !dupla)
  ) {
    return { clube: rotulo, jogadores: "", auxiliar: rotulo, livre: true };
  }

  if (dupla) {
    const clube = nomeClubeCidade(dupla) || texto(dupla.nome) || "A definir";

    const jogadores = jogadoresDaDupla(dupla);

    return {
      clube,

      jogadores,

      auxiliar: texto(dupla.nome),

      livre: false,
    };
  }

  const clubeLivre = texto(jogo[`dupla${lado}_equipe_nome` as keyof Jogo]);

  const jogador1 = texto(jogo[`dupla${lado}_jogador1` as keyof Jogo]);

  const jogador2 = texto(jogo[`dupla${lado}_jogador2` as keyof Jogo]);

  const jogadoresLivres = [jogador1, jogador2].filter(Boolean).join(" / ");

  return {
    clube: clubeLivre || labelLivre(jogo, lado),

    jogadores: jogadoresLivres,

    auxiliar: labelLivre(jogo, lado),

    livre: true,
  };
}

function idsPrincipais(jogos: Jogo[]): Set<number> {
  const ids = new Set<number>();

  jogos

    .filter((j) => j.tipo_chave === "principal")

    .forEach((j) => {
      if (j.dupla1_id) ids.add(idNumerico(j.dupla1_id));

      if (j.dupla2_id) ids.add(idNumerico(j.dupla2_id));
    });

  return ids;
}

function ehGrupoUnico(jogos: Jogo[], duplas: Dupla[]): boolean {
  const principal = jogos.filter((j) => j.tipo_chave === "principal");

  const textoGeral = normalizar(
    [
      ...principal.map((j) => j.fase),

      ...principal.map((j) => j.codigo),

      ...principal.map((j) => j.dupla1_label),

      ...principal.map((j) => j.dupla2_label),
    ].join(" "),
  );

  if (
    textoGeral.includes("grupo único") ||
    textoGeral.includes("grupo unico")
  ) {
    return true;
  }

  const ids = idsPrincipais(jogos);

  return principal.length === 6 && (duplas.length === 4 || ids.size === 4);
}

function ehSeisDuplasComGrupos(
  jogos: Jogo[],

  duplas: Dupla[],

  torneio?: Torneio,
): boolean {
  const principal = jogos.filter((j) => j.tipo_chave === "principal");

  if (principal.length < 6) return false;

  if (ehGrupoUnico(jogos, duplas)) return false;

  const ids = idsPrincipais(jogos);

  const textoGeral = normalizar(
    [
      torneio?.titulo,

      torneio?.subtitulo,

      ...principal.map((j) => j.fase),

      ...principal.map((j) => j.dupla1_label),

      ...principal.map((j) => j.dupla2_label),
    ].join(" "),
  );

  return (
    duplas.length === 6 ||
    ids.size === 6 ||
    textoGeral.includes("grupo 1") ||
    textoGeral.includes("grupo 2") ||
    textoGeral.includes("160 anos") ||
    textoGeral.includes('130 anos "b"') ||
    textoGeral.includes('140 anos "b"')
  );
}

function ehMataMataOito(jogos: Jogo[], duplas: Dupla[]): boolean {
  const principal = jogos.filter((j) => j.tipo_chave === "principal");

  const repescagem = jogos.filter((j) => j.tipo_chave === "repescagem");

  const finais = jogos.filter((j) => j.tipo_chave === "final");

  return (
    duplas.length >= 8 &&
    principal.length <= 4 &&
    (repescagem.length > 0 || finais.length > 0)
  );
}

function titulosDaChave(jogos: Jogo[], duplas: Dupla[], torneio?: Torneio) {
  if (ehGrupoUnico(jogos, duplas)) {
    return {
      esquerda: "3º Lugar",

      meio: "Grupo Único",

      direita: "Campeões",
    };
  }

  if (ehSeisDuplasComGrupos(jogos, duplas, torneio)) {
    return {
      esquerda: "Final Repescagem",

      meio: "Fase de Grupos",

      direita: "Final Principal",
    };
  }

  if (ehMataMataOito(jogos, duplas)) {
    return {
      esquerda: "Chave Repescagem",

      meio: "Primeira Fase",

      direita: "Chave Principal",
    };
  }

  return {
    esquerda: "Repescagem",

    meio: "Chave Principal",

    direita: "Final",
  };
}

function ultimoJogoFinalizadoDaUltimaColuna(lista: Jogo[]): Jogo | null {
  if (!lista.length) return null;

  const ultimaColuna = maxColuna(lista);

  const jogosUltimaColuna = ordenarJogos(
    lista.filter((jogo) => colunaDoJogo(jogo) === ultimaColuna),
  );

  const finalizados = jogosUltimaColuna.filter(
    (jogo) =>
      normalizar(jogo.status) === "finalizado" &&
      (texto(jogo.confronto3?.vencedor_equipe_nome) ||
        texto(jogo.vencedor_nome)),
  );

  return finalizados.length ? finalizados[finalizados.length - 1] : null;
}

function nomeLadoResultado(jogo: Jogo, lado: 1 | 2, duplas: Dupla[]): string {
  const nomeDireto =
    texto(
      lado === 1
        ? jogo.confronto3?.equipe1_nome
        : jogo.confronto3?.equipe2_nome,
    ) ||
    texto(jogo[`dupla${lado}_nome` as keyof Jogo]) ||
    texto(jogo[`dupla${lado}_label` as keyof Jogo]);

  if (nomeDireto) return nomeDireto;

  const duplaId = idNumerico(jogo[`dupla${lado}_id` as keyof Jogo]);

  const dupla = duplas.find((item) => idNumerico(item.id) === duplaId);

  if (!dupla) return "A definir";

  return (
    texto(dupla.nome) ||
    jogadoresDaDupla(dupla) ||
    nomeClubeCidade(dupla) ||
    "A definir"
  );
}

function ResultadoDestaque({
  titulo,

  nome,

  destaque = "principal",
}: {
  titulo: string;

  nome: string;

  destaque?: "principal" | "terceiro" | "repescagem";
}) {
  const visual =
    destaque === "terceiro"
      ? "border-amber-300 bg-amber-50 text-amber-900"
      : destaque === "repescagem"
        ? "border-stone-300 bg-[#dedbc6] text-stone-800"
        : "border-red-200 bg-[#f6dddd] text-red-950";

  return (
    <div
      className={`flex min-h-[82px] w-full flex-col items-center justify-center rounded-xl border px-4 py-3 text-center shadow-[0_8px_18px_rgba(41,37,36,0.08)] ${visual}`}
    >
      <span className="text-[11px] font-[950] uppercase tracking-[0.65px] opacity-80">
        {titulo}
      </span>

      <strong className="mt-1.5 block max-w-full break-words text-[14px] font-[950] uppercase leading-[1.15] text-gray-950">
        {texto(nome) || "A definir"}
      </strong>
    </div>
  );
}

function media(lista: number[]): number {
  if (!lista.length) return 0;

  return lista.reduce((total, valor) => total + valor, 0) / lista.length;
}

function distribuir(min: number, max: number, qtd: number): number[] {
  if (qtd <= 0) return [];

  if (qtd === 1) return [(min + max) / 2];

  const intervalo = (max - min) / Math.max(1, qtd - 1);

  return Array.from({ length: qtd }, (_, index) => min + index * intervalo);
}

function evitarSobreposicao(centros: number[], minGap: number): number[] {
  const saida = [...centros];

  for (let i = 1; i < saida.length; i++) {
    if (saida[i] - saida[i - 1] < minGap) {
      saida[i] = saida[i - 1] + minGap;
    }
  }

  return saida;
}

/**
 * Distribui as partidas de uma fase pela ALTURA INTEIRA da fase anterior.
 *
 * Na V35 o algoritmo pegava apenas os 2 primeiros jogos para cada semifinal.
 * Exemplo com 6 confrontos de grupos:
 *    ANTES: semifinal 1 = media(jogos 1 e 2)
 *           semifinal 2 = media(jogos 3 e 4)  <-- ambas ficam na parte alta
 *    AGORA: semifinal 1 = media(jogos 1, 2 e 3)
 *           semifinal 2 = media(jogos 4, 5 e 6)
 * Assim o centro das semifinais coincide com o centro da fase de grupos.
 */
function centrosAgrupados(
  centrosOriginais: number[],
  qtdDestino: number,
): number[] {
  if (qtdDestino <= 0) return [];
  const origem = [...centrosOriginais]
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (!origem.length) {
    return distribuir(
      ALTURA_UNIDADE / 2,
      (ALTURA_UNIDADE + 34) * qtdDestino,
      qtdDestino,
    );
  }
  if (qtdDestino === 1) return [media(origem)];
  if (origem.length >= qtdDestino) {
    return Array.from({ length: qtdDestino }, (_, indice) => {
      const inicio = Math.floor((indice * origem.length) / qtdDestino);
      const fim = Math.floor(((indice + 1) * origem.length) / qtdDestino);
      return media(origem.slice(inicio, fim));
    });
  }
  // Raro: mais partidas na próxima fase que na fase anterior.
  return distribuir(origem[0], origem[origem.length - 1], qtdDestino);
}

function centrosPrimeiraColuna(
  centrosPrincipal: number[],
  qtdDestino: number,
): number[] {
  return centrosAgrupados(centrosPrincipal, qtdDestino);
}

function centrosColunaSeguinte(
  centrosAnteriores: number[],
  qtdDestino: number,
): number[] {
  return centrosAgrupados(centrosAnteriores, qtdDestino);
}

/**
 * Detecta e organiza os 3 jogos do mesmo confronto:
 * 1) formato novo: confronto3.partidas aninhado ao jogo-pai;
 * 2) formato antigo: 3 jogos-chaves com codigo final .1, .2 e .3.
 * Jogos normais permanecem com um cartão isolado.
 */
function extrairSetsDaObservacao(observacao?: string): SetJogo[] {
  const bloco = String(observacao || "").match(
    /\[\[SETS_JSON\]\]([\s\S]*?)\[\[\/SETS_JSON\]\]/,
  );
  if (!bloco) return [];
  try {
    const dados = JSON.parse(bloco[1]);
    if (!Array.isArray(dados)) return [];
    return dados.slice(0, 5).map((item, indice) => ({
      numero_set: indice + 1,
      pontos_dupla1: item.p1 ?? item.pontos_dupla1 ?? null,
      pontos_dupla2: item.p2 ?? item.pontos_dupla2 ?? null,
    }));
  } catch {
    return [];
  }
}

function partidasDoConfronto(jogoPai: Jogo): Jogo[] {
  const confronto = jogoPai.confronto3;
  if (!confronto?.partidas?.length) return [];
  return [...confronto.partidas]
    .sort((a, b) => Number(a.numero_jogo || 0) - Number(b.numero_jogo || 0))
    .slice(0, 3)
    .map((partida, index) => ({
      ...jogoPai,
      ...partida,
      id: `c3-${jogoPai.id}-${partida.id}`,
      codigo: `${jogoPai.codigo || `CONFRONTO ${jogoPai.id}`}.${partida.numero_jogo || index + 1}`,
      dupla1_equipe_nome: confronto.equipe1_nome || jogoPai.dupla1_equipe_nome,
      dupla2_equipe_nome: confronto.equipe2_nome || jogoPai.dupla2_equipe_nome,
      // Rótulos livres da V34 também aparecem antes da definição dos classificados.
      dupla1_label: partida.dupla1_label || jogoPai.dupla1_label || undefined,
      dupla2_label: partida.dupla2_label || jogoPai.dupla2_label || undefined,
      status: partida.status || "pendente",
      sets: partida.sets?.length
        ? partida.sets
        : extrairSetsDaObservacao(partida.observacao),
      ehPartidaConfronto3: true,
      confronto3: undefined,
    }));
}

function chaveTriplaLegada(
  jogo: Jogo,
): { chave: string; indice: number } | null {
  const codigo = texto(jogo.codigo);
  const m = codigo.match(/^(.+)[._-]([123])$/i);
  if (!m) return null;
  return {
    chave: [
      texto(jogo.tipo_chave),
      colunaDoJogo(jogo),
      texto(jogo.grupo_numero),
      normalizar(jogo.fase),
      m[1].toUpperCase(),
    ].join("|"),
    indice: Number(m[2]),
  };
}

function unidadesVisuais(jogos: Jogo[]): UnidadeVisual[] {
  const ordenados = ordenarJogos(jogos);
  const candidatos = new Map<string, { indice: number; jogo: Jogo }[]>();
  for (const jogo of ordenados) {
    if (jogo.confronto3?.partidas?.length) continue;
    const info = chaveTriplaLegada(jogo);
    if (!info) continue;
    if (!candidatos.has(info.chave)) candidatos.set(info.chave, []);
    candidatos.get(info.chave)!.push({ indice: info.indice, jogo });
  }
  const triosLegados = new Map<string, Jogo[]>();
  for (const [chave, entradas] of candidatos) {
    if (entradas.length !== 3) continue;
    const numeros = new Set(entradas.map((x) => x.indice));
    if (![1, 2, 3].every((n) => numeros.has(n))) continue;
    triosLegados.set(
      chave,
      [...entradas].sort((a, b) => a.indice - b.indice).map((e) => e.jogo),
    );
  }
  const usados = new Set<string>();
  const saida: UnidadeVisual[] = [];
  for (const jogo of ordenados) {
    const id = String(jogo.id);
    if (usados.has(id)) continue;
    const partidasNovas = partidasDoConfronto(jogo);
    if (partidasNovas.length) {
      usados.add(id);
      saida.push({
        chave: `c3-${id}`,
        jogo,
        partidas: partidasNovas,
        triplo: true,
      });
      continue;
    }
    const codigo = chaveTriplaLegada(jogo);
    const antigas = codigo && triosLegados.get(codigo.chave);
    if (antigas) {
      antigas.forEach((p) => usados.add(String(p.id)));
      saida.push({
        chave: `antigo-${codigo!.chave}`,
        jogo: antigas[0],
        partidas: antigas,
        triplo: true,
      });
    } else {
      usados.add(id);
      saida.push({
        chave: `jogo-${id}`,
        jogo,
        partidas: [jogo],
        triplo: false,
      });
    }
  }
  return saida;
}

function larguraUnidade(unidade: UnidadeVisual): number {
  return unidade.triplo ? LARGURA_TRIO : CARD_W;
}

function maiorLargura(unidades: UnidadeVisual[]): number {
  return Math.max(CARD_W, ...unidades.map(larguraUnidade));
}

function larguraLaterais(unidades: UnidadeVisual[]): number {
  if (!unidades.length) return 0;
  const max = Math.max(...unidades.map((u) => colunaDoJogo(u.jogo)));
  return (
    Array.from({ length: max }, (_, i) =>
      maiorLargura(unidades.filter((u) => colunaDoJogo(u.jogo) === i + 1)),
    ).reduce((sum, n) => sum + n, 0) +
    GAP_COL * Math.max(0, max - 1)
  );
}

function calcularPrincipal(
  unidades: UnidadeVisual[],
  left: number,
  larguraPrincipal: number,
) {
  const cards: CardLayout[] = [];
  const titulos: TitleLayout[] = [];
  const centros: number[] = [];
  let top = 0;
  const adicionar = (unidade: UnidadeVisual) => {
    cards.push({
      unidade,
      top,
      left: left + (larguraPrincipal - larguraUnidade(unidade)) / 2,
    });
    centros.push(top + ALTURA_UNIDADE / 2);
    top += ALTURA_UNIDADE + 28;
  };
  if (!unidades.length)
    return { cards, titulos, centros, altura: ALTURA_UNIDADE + 40 };
  // Usa grupo_numero real do banco, sem assumir que só existem 2 grupos.
  const grupos = new Map<number, UnidadeVisual[]>();
  const outros: UnidadeVisual[] = [];
  for (const unidade of unidades) {
    const grupo = Number(unidade.jogo.grupo_numero || 0);
    if (grupo > 0) {
      if (!grupos.has(grupo)) grupos.set(grupo, []);
      grupos.get(grupo)!.push(unidade);
    } else outros.push(unidade);
  }
  for (const grupo of [...grupos.keys()].sort((a, b) => a - b)) {
    titulos.push({
      label: `Grupo ${grupo}`,
      top,
      left,
      width: larguraPrincipal,
    });
    top += GROUP_TITLE_H + 17;
    grupos.get(grupo)!.forEach(adicionar);
    top += 12;
  }
  outros.forEach(adicionar);
  return { cards, titulos, centros, altura: Math.max(420, top) };
}

function calcularLateral(
  unidades: UnidadeVisual[],
  principalCentros: number[],
  leftStart: number,
  lado: "repescagem" | "final",
) {
  const layouts: CardLayout[] = [];
  const centrosPorColuna = new Map<number, number[]>();
  if (!unidades.length) return { layouts, centrosPorColuna };
  const max = Math.max(...unidades.map((u) => colunaDoJogo(u.jogo)));
  const larguras = Array.from({ length: max }, (_, i) =>
    maiorLargura(unidades.filter((u) => colunaDoJogo(u.jogo) === i + 1)),
  );
  const largurasVisuais =
    lado === "repescagem" ? [...larguras].reverse() : larguras;
  const deslocamentoColuna = (coluna: number) => {
    const visual = lado === "repescagem" ? max - coluna : coluna - 1;
    return (
      largurasVisuais.slice(0, visual).reduce((n, w) => n + w, 0) +
      visual * GAP_COL
    );
  };
  for (let coluna = 1; coluna <= max; coluna++) {
    const lista = unidades.filter((u) => colunaDoJogo(u.jogo) === coluna);
    // Uma única final fica no mesmo eixo horizontal do pódio (campeão/vice),
    // que já utiliza a média dos centros da fase principal.
    const base =
      coluna > 1 && lista.length === 1 && principalCentros.length
        ? [media(principalCentros)]
        : coluna === 1
          ? centrosPrimeiraColuna(principalCentros, lista.length)
          : centrosColunaSeguinte(
              centrosPorColuna.get(coluna - 1) || [],
              lista.length,
            );
    const centros = evitarSobreposicao(base, ALTURA_UNIDADE + 28);
    centrosPorColuna.set(coluna, centros);
    const x = leftStart + deslocamentoColuna(coluna);
    for (let i = 0; i < lista.length; i++) {
      layouts.push({
        unidade: lista[i],
        left: x + (larguras[coluna - 1] - larguraUnidade(lista[i])) / 2,
        top: centros[i] - ALTURA_UNIDADE / 2,
      });
    }
  }
  return { layouts, centrosPorColuna };
}

function MatchCard({
  jogo,

  duplas,

  style,
}: {
  jogo: Jogo;

  duplas: Dupla[];

  style?: React.CSSProperties;
}) {
  const lado1 = dadosLado(jogo, 1, duplas);

  const lado2 = dadosLado(jogo, 2, duplas);

  // Começa usando os sets que já possam ter vindo no /detalhes,

  // mas o botão SETS SEMPRE aparece e também consegue buscar por jogo_id.

  const [sets, setSets] = useState<SetJogo[]>([]);

  const [mostrarSets, setMostrarSets] = useState(false);

  const [carregandoSets, setCarregandoSets] = useState(false);

  const [erroSets, setErroSets] = useState("");

  /*

 * Quando o jogo mudar ou quando /detalhes trouxer sets novos,

 * sincroniza automaticamente.

 */

  useEffect(() => {
    const listaInicial = [...(jogo.sets || [])].sort(
      (a, b) => Number(a.numero_set || 0) - Number(b.numero_set || 0),
    );

    setSets(listaInicial);
  }, [jogo.id, jogo.sets]);

  /*

 * Busca DIRETAMENTE no banco através da API.

 *

 * Não usa cache.

 * Toda vez que abrir SETS, consulta novamente:

 *

 * /listar?tabela=sets&jogo_id=ID

 */

  const carregarSets = async () => {
    if (carregandoSets) return;
    // Sub-partidas de confronto3 não têm ID em jogos_chaves: os sets vêm
    // da própria observação da partida. Não consultar /listar?jogo_id=c3-*.
    if (jogo.ehPartidaConfronto3) {
      setErroSets("");
      setSets(jogo.sets || []);
      return;
    }

    setCarregandoSets(true);

    setErroSets("");

    try {
      const resposta = await apiChaves<unknown>("listar", {
        tabela: "sets",

        jogo_id: jogo.id,
      });

      console.log("SETS DO JOGO", jogo.id, resposta);

      /*

     * O backend atual retorna array puro:

     *

     * [

     *   {

     *     id: 1,

     *     jogo_id: 10,

     *     numero_set: 1,

     *     pontos_dupla1: 6,

     *     pontos_dupla2: 4

     *   }

     * ]

     *

     * Mas deixamos compatível também com respostas

     * { sets: [...] }, { dados: [...] } ou { data: [...] }.

     */

      let lista: SetJogo[] = [];

      if (Array.isArray(resposta)) {
        lista = resposta as SetJogo[];
      } else if (resposta && typeof resposta === "object") {
        const obj = resposta as Record<string, unknown>;

        if (Array.isArray(obj.sets)) {
          lista = obj.sets as SetJogo[];
        } else if (Array.isArray(obj.dados)) {
          lista = obj.dados as SetJogo[];
        } else if (Array.isArray(obj.data)) {
          lista = obj.data as SetJogo[];
        }
      }

      lista = [...lista].sort(
        (a, b) => Number(a.numero_set || 0) - Number(b.numero_set || 0),
      );

      console.log("SETS NORMALIZADOS:", lista);

      setSets(lista);
    } catch (error) {
      console.error("ERRO AO CARREGAR SETS:", error);

      setErroSets(
        error instanceof Error
          ? error.message
          : "Erro ao carregar os sets deste jogo.",
      );
    } finally {
      setCarregandoSets(false);
    }
  };

  const abrirSets = () => {
    setMostrarSets(true);

    // SEMPRE busca os valores mais recentes do banco.

    void carregarSets();
  };

  const placarCalculado = useMemo(() => {
    let dupla1 = 0;

    let dupla2 = 0;

    let temSetPreenchido = false;

    sets.forEach((set) => {
      const valor1 = set.pontos_dupla1;

      const valor2 = set.pontos_dupla2;

      if (
        valor1 === null ||
        valor1 === undefined ||
        valor1 === "" ||
        valor2 === null ||
        valor2 === undefined ||
        valor2 === ""
      ) {
        return;
      }

      const p1 = Number(valor1);

      const p2 = Number(valor2);

      if (!Number.isFinite(p1) || !Number.isFinite(p2)) return;

      temSetPreenchido = true;

      if (p1 > p2) dupla1++;
      else if (p2 > p1) dupla2++;
    });

    return { dupla1, dupla2, temSetPreenchido };
  }, [sets]);

  const temPlacarApi =
    jogo.placar1 !== null &&
    jogo.placar1 !== undefined &&
    jogo.placar1 !== "" &&
    jogo.placar2 !== null &&
    jogo.placar2 !== undefined &&
    jogo.placar2 !== "";

  // Prioriza placar salvo na API. Se estiver vazio, calcula pelos sets carregados.

  const placar1 = temPlacarApi
    ? String(jogo.placar1)
    : placarCalculado.temSetPreenchido
      ? String(placarCalculado.dupla1)
      : "–";

  const placar2 = temPlacarApi
    ? String(jogo.placar2)
    : placarCalculado.temSetPreenchido
      ? String(placarCalculado.dupla2)
      : "–";

  const nomesBox = (lado: ReturnType<typeof dadosLado>) => {
    const jogadores = lado.jogadores

      .split("/")

      .map((nome) => nome.trim())

      .filter(Boolean);

    if (jogadores.length) return jogadores;

    return [lado.auxiliar || lado.clube || "A definir"];
  };

  const mostrarEquipe = (lado: ReturnType<typeof dadosLado>) =>
    Boolean(texto(lado.clube) && texto(lado.jogadores));

  return (
    <>
      <article
        className="absolute z-[5] overflow-hidden rounded-xl border border-stone-300 bg-white p-2.5 shadow-[0_8px_20px_rgba(41,37,36,0.08)]"
        style={style}
      >
        <div className="flex flex-col items-stretch gap-1.5">
          <div className="relative flex min-h-[52px] flex-col items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] py-2 pl-3.5 pr-12 text-center">
            <div className="flex w-full min-w-0 flex-col items-center justify-center gap-0.5">
              {mostrarEquipe(lado1) ? (
                <span className="mb-px block w-full truncate whitespace-nowrap text-[10px] font-[950] uppercase leading-[1.05] tracking-[0.55px] text-[#0f3f7a]">
                  {lado1.clube}
                </span>
              ) : null}

              {nomesBox(lado1).map((nome, index) => (
                <span
                  key={`${nome}-${index}`}
                  className="block w-full truncate whitespace-nowrap text-[13px] font-[950] uppercase leading-[1.12] tracking-[0.45px] text-gray-900"
                >
                  {nome}
                </span>
              ))}
            </div>

            <strong
              className={`absolute right-2 top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full text-base font-[950] leading-none text-white ${placar1 === "–" ? "bg-stone-400 shadow-none" : "bg-[#0f3f7a] shadow-[0_3px_9px_rgba(15,63,122,0.18)]"}`}
              title="Sets vencidos pela dupla"
            >
              {placar1}
            </strong>
          </div>

          <div className="flex min-h-[34px] flex-col items-center justify-center text-center">
            <div className="text-sm font-[950] leading-none text-gray-900">
              X
            </div>

            <div className="mt-0.5 flex items-center justify-center gap-[7px] overflow-hidden whitespace-nowrap text-[11px] font-[850] leading-none text-stone-600">
              <b className="font-[950] text-[#0f3f7a]">
                {jogo.codigo || "SEM CÓDIGO"}
              </b>

              {jogo.data_jogo ? (
                <span className="overflow-hidden text-ellipsis">
                  {formatarData(jogo.data_jogo)}
                </span>
              ) : null}

              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-full border-0 bg-[#0f3f7a] px-[9px] py-[5px] text-[10px] font-[950] tracking-[0.45px] text-white shadow-[0_3px_8px_rgba(15,63,122,0.18)] hover:brightness-110"
                onClick={abrirSets}
                onMouseEnter={abrirSets}
                aria-label={`Ver resultados dos sets do jogo ${jogo.codigo || jogo.id}`}
                title="Passe o mouse ou clique para ver os sets"
              >
                SETS
              </button>
            </div>
          </div>

          <div className="relative flex min-h-[52px] flex-col items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] py-2 pl-3.5 pr-12 text-center">
            <div className="flex w-full min-w-0 flex-col items-center justify-center gap-0.5">
              {mostrarEquipe(lado2) ? (
                <span className="mb-px block w-full truncate whitespace-nowrap text-[10px] font-[950] uppercase leading-[1.05] tracking-[0.55px] text-[#0f3f7a]">
                  {lado2.clube}
                </span>
              ) : null}

              {nomesBox(lado2).map((nome, index) => (
                <span
                  key={`${nome}-${index}`}
                  className="block w-full truncate whitespace-nowrap text-[13px] font-[950] uppercase leading-[1.12] tracking-[0.45px] text-gray-900"
                >
                  {nome}
                </span>
              ))}
            </div>

            <strong
              className={`absolute right-2 top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full text-base font-[950] leading-none text-white ${placar2 === "–" ? "bg-stone-400 shadow-none" : "bg-[#0f3f7a] shadow-[0_3px_9px_rgba(15,63,122,0.18)]"}`}
              title="Sets vencidos pela dupla"
            >
              {placar2}
            </strong>
          </div>
        </div>
      </article>

      {mostrarSets ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[rgba(17,24,39,0.42)] p-[18px] backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-label={`Sets do jogo ${jogo.codigo || jogo.id}`}
          onMouseDown={() => setMostrarSets(false)}
        >
          <div
            className="max-h-[min(640px,calc(100vh-36px))] w-[min(470px,100%)] overflow-auto rounded-[18px] border border-stone-200 bg-white shadow-[0_24px_70px_rgba(17,24,39,0.24)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 px-[18px] py-4">
              <div className="flex flex-col gap-[3px]">
                <span className="text-[10px] font-[950] tracking-[0.8px] text-stone-500">
                  RESULTADO POR SET
                </span>

                <strong className="text-[17px] font-[950] text-[#0f3f7a]">
                  {jogo.codigo || `Jogo ${jogo.id}`}
                </strong>
              </div>

              <button
                type="button"
                className="h-9 w-9 cursor-pointer rounded-full border-0 bg-stone-100 text-2xl leading-none text-stone-800"
                onClick={() => setMostrarSets(false)}
                aria-label="Fechar resultados dos sets"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-stone-200 bg-slate-50 px-[18px] py-4 text-left max-[760px]:grid-cols-1 max-[760px]:text-center">
              <div className="flex min-w-0 items-center gap-[9px] max-[760px]:justify-between">
                <span className="min-w-0 overflow-hidden text-ellipsis text-[11px] font-[900] uppercase leading-[1.2] text-stone-800">
                  {nomesBox(lado1).join(" / ")}
                </span>

                <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f3f7a] text-[17px] font-[950] text-white">
                  {placar1}
                </strong>
              </div>

              <b className="whitespace-nowrap text-[9px] font-[950] tracking-[0.5px] text-stone-500 max-[760px]:order-first">
                PLACAR TOTAL
              </b>

              <div className="flex min-w-0 flex-row-reverse items-center gap-[9px] text-right max-[760px]:flex-row max-[760px]:justify-between max-[760px]:text-left">
                <span className="min-w-0 overflow-hidden text-ellipsis text-[11px] font-[900] uppercase leading-[1.2] text-stone-800">
                  {nomesBox(lado2).join(" / ")}
                </span>

                <strong className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f3f7a] text-[17px] font-[950] text-white">
                  {placar2}
                </strong>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-[18px] pb-[18px] pt-4">
              {carregandoSets ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3.5 py-[18px] text-center text-xs font-[850] text-stone-600">
                  Carregando sets...
                </div>
              ) : erroSets ? (
                <div className="rounded-xl border border-dashed border-red-200 bg-red-50 px-3.5 py-[18px] text-center text-xs font-[850] text-red-700">
                  {erroSets}
                </div>
              ) : sets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3.5 py-[18px] text-center text-xs font-[850] text-stone-600">
                  Nenhum set lançado para este jogo.
                </div>
              ) : (
                sets.map((set, index) => (
                  <div
                    className="grid min-h-[46px] grid-cols-[1fr_44px_20px_44px] items-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-[7px] pl-3.5 pr-2.5"
                    key={String(
                      set.id ?? `${jogo.id}-${set.numero_set ?? index}`,
                    )}
                  >
                    <span className="text-xs font-[950] tracking-[0.4px] text-stone-600">
                      SET {set.numero_set || index + 1}
                    </span>

                    <strong className="flex h-8 items-center justify-center rounded-[9px] border border-stone-300 bg-white text-[15px] font-[950] text-gray-900">
                      {set.pontos_dupla1 ?? "-"}
                    </strong>

                    <i className="text-center not-italic font-[950] text-stone-400">
                      ×
                    </i>

                    <strong className="flex h-8 items-center justify-center rounded-[9px] border border-stone-300 bg-white text-[15px] font-[950] text-gray-900">
                      {set.pontos_dupla2 ?? "-"}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ChaveVisual({ detalhes }: { detalhes: DetalhesChave }) {
  const duplas = detalhes.duplas || [];

  const jogosOriginais = detalhes.jogos || [];

  const setsGerais = detalhes.sets || [];

  const torneio = detalhes.torneio;

  const boardScrollRef = useRef<HTMLDivElement | null>(null);

  const jogos = useMemo(() => {
    if (!setsGerais.length) return jogosOriginais;

    return jogosOriginais.map((jogo) => {
      if (jogo.sets?.length) return jogo;

      return {
        ...jogo,

        sets: setsGerais.filter(
          (set) => String(set.jogo_id) === String(jogo.id),
        ),
      };
    });
  }, [jogosOriginais, setsGerais]);

  const principal = useMemo(
    () => ordenarJogos(jogos.filter((j) => j.tipo_chave === "principal")),

    [jogos],
  );

  const repescagem = useMemo(
    () => ordenarJogos(jogos.filter((j) => j.tipo_chave === "repescagem")),

    [jogos],
  );

  const finais = useMemo(
    () => ordenarJogos(jogos.filter((j) => j.tipo_chave === "final")),

    [jogos],
  );

  const podio = useMemo(() => {
    const grupoUnico = ehGrupoUnico(jogos, duplas);

    /*

     * Grupo único, como a 120A, NÃO tem jogo de final.

     * Então campeão/vice/3º lugar devem vir somente do pódio definido no painel.

     * Antes o código pegava o último jogo finalizado da primeira fase e tratava

     * como se fosse final, por isso aparecia campeão e vice mesmo estando "A definir".

     */

    const listaFinal = grupoUnico ? [] : finais.length ? finais : principal;

    const ultimoFinal = ultimoJogoFinalizadoDaUltimaColuna(listaFinal);

    const ultimoRepescagem = grupoUnico
      ? null
      : ultimoJogoFinalizadoDaUltimaColuna(repescagem);

    let campeao = texto(torneio?.campeao_nome);

    let vice = texto(torneio?.vice_nome);

    if (!grupoUnico && !campeao && ultimoFinal) {
      campeao =
        texto(ultimoFinal.confronto3?.vencedor_equipe_nome) ||
        texto(ultimoFinal.vencedor_nome);

      const dupla1 = nomeLadoResultado(ultimoFinal, 1, duplas);

      const dupla2 = nomeLadoResultado(ultimoFinal, 2, duplas);

      vice = normalizar(campeao) === normalizar(dupla1) ? dupla2 : dupla1;
    }

    return {
      grupoUnico,

      campeao: campeao || "A definir",

      vice: vice || "A definir",

      terceiro: texto(torneio?.terceiro_nome) || "A definir",

      campeaoRepescagem:
        texto(torneio?.campeao_repescagem_nome) ||
        texto(ultimoRepescagem?.confronto3?.vencedor_equipe_nome) ||
        texto(ultimoRepescagem?.vencedor_nome) ||
        "A definir",
    };
  }, [jogos, duplas, torneio, finais, principal, repescagem]);

  const calculo = useMemo(() => {
    const principalUnits = unidadesVisuais(principal);
    const repUnits = unidadesVisuais(repescagem);
    const finalUnits = unidadesVisuais(finais);
    const repGamesWidth = larguraLaterais(repUnits);
    const finalGamesWidth = larguraLaterais(finalUnits);
    const larguraPrincipal = maiorLargura(principalUnits);
    const repGamesLeft = RESULT_W + (repGamesWidth ? RESULT_GAP : 0);
    const repWidth =
      RESULT_W + (repGamesWidth ? RESULT_GAP + repGamesWidth : 0);
    const mainLeft = repWidth + GAP_SECAO;
    const finalLeft = mainLeft + larguraPrincipal + GAP_SECAO;
    const finalWidth =
      finalGamesWidth + (finalGamesWidth ? RESULT_GAP : 0) + RESULT_W;
    const rightResultLeft =
      finalLeft + finalGamesWidth + (finalGamesWidth ? RESULT_GAP : 0);
    const totalWidth =
      repWidth + GAP_SECAO + larguraPrincipal + GAP_SECAO + finalWidth;
    const principalCalc = calcularPrincipal(
      principalUnits,
      mainLeft,
      larguraPrincipal,
    );
    const repCalc = calcularLateral(
      repUnits,
      principalCalc.centros,
      repGamesLeft,
      "repescagem",
    );
    const finalCalc = calcularLateral(
      finalUnits,
      principalCalc.centros,
      finalLeft,
      "final",
    );
    const todosCards = [
      ...principalCalc.cards,
      ...repCalc.layouts,
      ...finalCalc.layouts,
    ];
    const minTop = Math.min(
      0,
      ...todosCards.map((c) => c.top),
      ...principalCalc.titulos.map((t) => t.top),
    );
    const shift = minTop < 0 ? Math.abs(minTop) + 24 : 0;
    const cardsCorrigidos = todosCards.map((item) => ({
      ...item,
      top: item.top + shift + BOARD_TOP,
    }));
    const titulosCorrigidos = principalCalc.titulos.map((item) => ({
      ...item,
      top: item.top + shift + BOARD_TOP,
    }));
    const centroPrincipal = principalCalc.centros.length
      ? media(principalCalc.centros)
      : principalCalc.altura / 2;
    const resultadoCenterY = centroPrincipal + shift + BOARD_TOP;
    const maxBottom = Math.max(
      520,
      ...cardsCorrigidos.map((c) => c.top + ALTURA_UNIDADE),
      ...titulosCorrigidos.map((t) => t.top + GROUP_TITLE_H),
      resultadoCenterY + 100,
    );
    return {
      totalWidth,
      repWidth,
      mainLeft,
      finalLeft,
      larguraPrincipal,
      finalWidth,
      rightResultLeft,
      resultadoCenterY,
      cards: cardsCorrigidos,
      groupTitles: titulosCorrigidos,
      height: maxBottom + 42,
      titulos: titulosDaChave(jogos, duplas, torneio),
    };
  }, [repescagem, finais, principal, jogos, duplas, torneio]);

  useEffect(() => {
    const container = boardScrollRef.current;

    if (!container || !jogos.length) return;

    const centralizar = () => {
      const maxScroll = Math.max(
        0,

        container.scrollWidth - container.clientWidth,
      );

      container.scrollLeft = maxScroll / 2;
    };

    // Aguarda o DOM aplicar a largura calculada da chave antes de posicionar o scroll.

    const frame1 = requestAnimationFrame(() => {
      const frame2 = requestAnimationFrame(centralizar);

      (
        container as HTMLDivElement & { __jpCenterFrame?: number }
      ).__jpCenterFrame = frame2;
    });

    return () => {
      cancelAnimationFrame(frame1);

      const frame2 = (
        container as HTMLDivElement & { __jpCenterFrame?: number }
      ).__jpCenterFrame;

      if (frame2) cancelAnimationFrame(frame2);
    };
  }, [calculo.totalWidth, torneio?.id, jogos.length]);

  if (!jogos.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-stone-300 bg-white px-4 py-7 text-center font-[850] text-stone-500">
        Nenhuma chave encontrada para esta seleção.
      </div>
    );
  }

  return (
    <>
      <div className="mb-3 flex w-full justify-center px-3">
        <div
          className="pointer-events-none flex items-center justify-center gap-3 whitespace-nowrap rounded-full border border-orange-200 bg-orange-50 px-4 py-2.5 text-center text-xs font-[950] text-orange-800 shadow-[0_8px_20px_rgba(154,52,18,0.12)] max-[520px]:w-full max-[520px]:whitespace-normal"
          role="status"
          aria-live="polite"
        >
          <span className="shrink-0 text-xl font-black leading-none text-orange-700">
            ←
          </span>

          <span>Arraste para os lados para ver toda a chave</span>

          <span className="shrink-0 text-xl font-black leading-none text-orange-700">
            →
          </span>
        </div>
      </div>

      <div
        ref={boardScrollRef}
        className="overflow-x-auto overflow-y-hidden rounded-[20px] border border-stone-200 bg-white p-3.5 shadow-[0_10px_24px_rgba(41,37,36,0.06)] [-webkit-overflow-scrolling:touch]"
      >
        <div
          className="relative mx-auto"
          style={{
            width: calculo.totalWidth,

            minWidth: calculo.totalWidth,

            height: calculo.height,
          }}
        >
          <div
            className="absolute top-0 flex h-[42px] items-center justify-center rounded-lg bg-[#dedbc6] text-center text-[13px] font-[950] uppercase tracking-[0.35px] text-stone-800"
            style={{ left: 0, width: calculo.repWidth }}
          >
            {calculo.titulos.esquerda}
          </div>

          <div
            className="absolute top-0 flex h-[42px] items-center justify-center rounded-lg bg-[#dce7f3] text-center text-[13px] font-[950] uppercase tracking-[0.35px] text-[#0f3f7a]"
            style={{ left: calculo.mainLeft, width: calculo.larguraPrincipal }}
          >
            {calculo.titulos.meio}
          </div>

          <div
            className="absolute top-0 flex h-[42px] items-center justify-center rounded-lg bg-[#e7b8b8] text-center text-[13px] font-[950] uppercase tracking-[0.35px] text-red-900"
            style={{ left: calculo.finalLeft, width: calculo.finalWidth }}
          >
            {calculo.titulos.direita}
          </div>

          <div
            className="absolute z-[4] flex -translate-y-1/2 flex-col gap-3"
            style={{
              left: 0,

              top: calculo.resultadoCenterY,

              width: RESULT_W,
            }}
          >
            {podio.grupoUnico ? (
              <ResultadoDestaque
                titulo="3º Lugar"
                nome={podio.terceiro}
                destaque="terceiro"
              />
            ) : (
              <ResultadoDestaque
                titulo="Campeão Repescagem"
                nome={podio.campeaoRepescagem}
                destaque="repescagem"
              />
            )}
          </div>

          <div
            className="absolute z-[4] flex -translate-y-1/2 flex-col gap-3"
            style={{
              left: calculo.rightResultLeft,

              top: calculo.resultadoCenterY,

              width: RESULT_W,
            }}
          >
            <ResultadoDestaque titulo="Campeão" nome={podio.campeao} />

            <ResultadoDestaque titulo="Vice-campeão" nome={podio.vice} />
          </div>

          {calculo.groupTitles.map((titulo) => (
            <div
              key={`${titulo.label}-${titulo.top}`}
              className="absolute z-[2] flex items-center justify-center rounded-[7px] bg-[#0f3f7a] text-center text-[13px] font-[950] uppercase tracking-[0.5px] text-white"
              style={{
                left: titulo.left,

                top: titulo.top,

                width: titulo.width,
              }}
            >
              {titulo.label}
            </div>
          ))}

          {calculo.cards.map((item) =>
            item.unidade.triplo ? (
              <div
                key={item.unidade.chave}
                className="absolute"
                style={{
                  left: item.left,
                  top: item.top,
                  width: LARGURA_TRIO,
                  height: ALTURA_UNIDADE,
                }}
              >
                <div className="mb-1 text-center text-xs font-[950] uppercase tracking-wide text-[#0f3f7a]">
                  {item.unidade.jogo.fase || "Confronto"} ·{" "}
                  {item.unidade.jogo.codigo || "Confronto de equipes"}
                </div>
                <div className="flex items-start" style={{ gap: GAP_TRIO }}>
                  {item.unidade.partidas.map((partida, index) => (
                    <div
                      key={String(partida.id)}
                      style={{ width: CARD_W, flexShrink: 0 }}
                    >
                      <div className="mb-1 rounded-md bg-[#e8eef7] py-1 text-center text-[11px] font-[950] text-[#0f3f7a]">
                        DUPLA {index + 1}
                      </div>
                      <MatchCard
                        jogo={partida}
                        duplas={duplas}
                        style={{
                          position: "relative",
                          left: 0,
                          top: 0,
                          width: CARD_W,
                          height: CARD_H,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <MatchCard
                key={item.unidade.chave}
                jogo={item.unidade.partidas[0]}
                duplas={duplas}
                style={{
                  left: item.left,
                  top: item.top,
                  width: CARD_W,
                  height: CARD_H,
                }}
              />
            ),
          )}
        </div>
      </div>
    </>
  );
}

function VisualizadorSistemaChaves() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [torneios, setTorneios] = useState<Torneio[]>([]);

  const [categoriaId, setCategoriaId] = useState("");

  const [torneioId, setTorneioId] = useState("");

  const [detalhes, setDetalhes] = useState<DetalhesChave>({});

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      setLoading(true);

      setErro("");

      try {
        const data = await apiChaves<Categoria[]>("listar", {
          tabela: "categorias",
        });

        if (!ativo) return;

        setCategorias(data || []);

        setCategoriaId(data?.[0]?.id ? String(data[0].id) : "");
      } catch (error) {
        if (ativo)
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao carregar categorias",
          );
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!categoriaId) {
      setTorneios([]);

      setTorneioId("");

      return;
    }

    let ativo = true;

    async function carregarTorneios() {
      setLoading(true);

      setErro("");

      try {
        const data = await apiChaves<Torneio[]>("listar", {
          tabela: "torneios",

          categoria_id: categoriaId,
        });

        if (!ativo) return;

        setTorneios(data || []);

        setTorneioId(data?.[0]?.id ? String(data[0].id) : "");
      } catch (error) {
        if (ativo)
          setErro(
            error instanceof Error ? error.message : "Erro ao carregar chaves",
          );
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarTorneios();

    return () => {
      ativo = false;
    };
  }, [categoriaId]);

  useEffect(() => {
    if (!torneioId) {
      setDetalhes({});

      return;
    }

    let ativo = true;

    async function carregarDetalhes() {
      setLoading(true);

      setErro("");

      try {
        const data = await apiChaves<DetalhesChave>("detalhes", {
          torneio_id: torneioId,
        });

        if (!ativo) return;

        setDetalhes(data || {});
      } catch (error) {
        if (ativo)
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao carregar detalhes da chave",
          );
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarDetalhes();

    return () => {
      ativo = false;
    };
  }, [torneioId]);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 pb-7 pt-3.5">
      <div className="mb-2.5 grid grid-cols-2 gap-3 rounded-[18px] border border-stone-200 bg-white p-3 shadow-[0_8px_20px_rgba(41,37,36,0.05)] max-[760px]:grid-cols-1">
        <div>
          <label className="mb-[5px] block text-[11px] font-[950] uppercase text-stone-600">
            Categoria
          </label>

          <select
            className="min-h-[42px] w-full rounded-xl border border-stone-300 bg-white px-3 font-[850] text-stone-800 outline-none"
            value={categoriaId}
            onChange={(event) => setCategoriaId(event.target.value)}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-[5px] block text-[11px] font-[950] uppercase text-stone-600">
            Chave
          </label>

          <select
            className="min-h-[42px] w-full rounded-xl border border-stone-300 bg-white px-3 font-[850] text-stone-800 outline-none"
            value={torneioId}
            onChange={(event) => setTorneioId(event.target.value)}
          >
            {torneios.map((torneio) => (
              <option key={torneio.id} value={torneio.id}>
                {torneio.titulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="my-2.5 rounded-xl bg-blue-50 px-3 py-2.5 text-center text-[13px] font-[850] text-blue-900">
          Carregando...
        </div>
      ) : null}

      {erro ? (
        <div className="my-2.5 rounded-xl bg-red-50 px-3 py-2.5 text-center text-[13px] font-[850] text-red-700">
          {erro}
        </div>
      ) : null}

      <div className="my-2.5 text-center">
        <h2 className="m-0 text-[clamp(20px,3vw,28px)] font-[950] uppercase text-stone-900">
          {detalhes.torneio?.titulo ||
            torneios.find((t) => String(t.id) === torneioId)?.titulo ||
            "Chaves"}
        </h2>

        {detalhes.torneio?.subtitulo ? (
          <p className="mt-1 text-[13px] font-bold text-stone-500">
            {detalhes.torneio.subtitulo}
          </p>
        ) : null}
      </div>

      <ChaveVisual detalhes={detalhes} />
    </section>
  );
}

function VisualizadorFotosChaves() {
  const [imagens, setImagens] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarFotos() {
      setLoading(true);

      setErro("");

      try {
        const res = await fetch(API_IMAGENS, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Erro ${res.status} ao carregar imagens`);
        }

        const data = await res.json();

        const imagensEncontradas = extrairImagensDaApi(data);

        if (!ativo) return;

        setImagens(imagensEncontradas);
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error ? error.message : "Erro ao carregar imagens",
          );

          setImagens([]);
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarFotos();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-[980px] flex-col gap-[18px] px-4 pb-7 pt-3.5">
      {loading ? (
        <div className="my-2.5 rounded-xl bg-blue-50 px-3 py-2.5 text-center text-[13px] font-[850] text-blue-900">
          Carregando imagens...
        </div>
      ) : null}

      {erro ? (
        <div className="my-2.5 rounded-xl bg-red-50 px-3 py-2.5 text-center text-[13px] font-[850] text-red-700">
          {erro}
        </div>
      ) : null}

      {!loading && !erro && !imagens.length ? (
        <div className="rounded-[18px] border border-dashed border-stone-300 bg-white px-4 py-7 text-center font-[850] text-stone-500">
          Nenhuma imagem encontrada.
        </div>
      ) : null}

      {imagens.map((imagem, index) => (
        <a
          key={`${imagem}-${index}`}
          href={urlImagem(imagem)}
          target="_blank"
          rel="noreferrer"
          className="block w-full"
        >
          <img
            src={urlImagem(imagem)}
            alt={`Chave ${index + 1}`}
            loading="lazy"
            className="block w-full max-w-full rounded-2xl border border-stone-200 bg-white shadow-[0_10px_24px_rgba(41,37,36,0.06)]"
          />
        </a>
      ))}
    </section>
  );
}

export default function JogosPage({
  onBack,

  initialMode = "fotos",
}: JogosPageProps) {
  const [modo, setModo] = useState<JogosModo>(initialMode);

  useEffect(() => {
    setModo(initialMode);
  }, [initialMode]);

  return (
    <div className="min-h-[80vh] bg-[#fcfaf2] text-stone-800">
      <section className="mx-auto max-w-[1180px] px-4 pb-2 pt-5">
        <div className="mb-3 flex items-center justify-between gap-3 max-[760px]:flex-col max-[760px]:items-start">
          <div>
            <h1 className="m-0 text-[clamp(22px,4vw,34px)] font-[950] uppercase leading-none text-stone-900">
              Jogos
            </h1>

            <p className="mt-1 text-[13px] font-bold text-stone-500">
              Escolha como deseja visualizar as chaves.
            </p>
          </div>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="cursor-pointer whitespace-nowrap rounded-full border border-stone-300 bg-white px-3.5 py-[9px] text-[13px] font-[900] text-stone-700"
            >
              ← Voltar
            </button>
          ) : null}
        </div>

        <div className="grid max-w-[620px] grid-cols-2 gap-2.5 max-[760px]:max-w-none">
          <button
            type="button"
            onClick={() => setModo("fotos")}
            className={`cursor-pointer rounded-[14px] border px-3.5 py-3 text-[13px] font-[950] uppercase shadow-[0_8px_18px_rgba(41,37,36,0.06)] transition-colors ${modo === "fotos" ? "border-[#0f3f7a] bg-[#0f3f7a] text-white" : "border-stone-300 bg-white text-stone-700"}`}
          >
            Fotos das chaves
          </button>

          <button
            type="button"
            onClick={() => setModo("sistema")}
            className={`cursor-pointer rounded-[14px] border px-3.5 py-3 text-[13px] font-[950] uppercase shadow-[0_8px_18px_rgba(41,37,36,0.06)] transition-colors ${modo === "sistema" ? "border-[#0f3f7a] bg-[#0f3f7a] text-white" : "border-stone-300 bg-white text-stone-700"}`}
          >
            Chaves interativas
          </button>
        </div>
      </section>

      {modo === "fotos" ? (
        <VisualizadorFotosChaves />
      ) : (
        <VisualizadorSistemaChaves />
      )}
    </div>
  );
}
