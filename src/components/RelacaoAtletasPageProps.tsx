import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  Loader2,
  AlertCircle,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

interface RelacaoAtletasPageProps {
  onBack: () => void;
}

type Atleta = {
  id: number;
  atleta_id?: number;
  id_atleta?: number;
  equipe_id?: number;
  nome: string;
};

type Equipe = {
  id: number;
  equipe_id?: number;
  id_equipe?: number;
  categoria_id?: number;
  nome: string;
  atletas: Atleta[];
};

type Categoria = {
  id: number;
  categoria_id?: number;
  id_categoria?: number;
  titulo: string;
  equipes: Equipe[];
};

type RespostaAPI = {
  categorias: Categoria[];
};

type CategoriaSelecionada = number | "todos";

type ResultadoBusca = {
  atleta: Atleta;
  equipe: Equipe;
  categoria: Categoria;
};

const API_URL = "https://sothink.com.br/apibeneficiente3/api/v2/nippon";
const EQUIPES_POR_PAGINA = 12; // 6 colunas x 2 linhas no desktop.

function normalizarBusca(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function pegarIdade(titulo: string): number | null {
  const match = titulo.match(/\b(120|130|140|150|160)\b/);
  return match ? Number(match[1]) : null;
}

function pegarLetra(titulo: string): string | null {
  const match = titulo.match(/["']?([A-G])["']?\s*$/i);
  return match ? match[1].toUpperCase() : null;
}

function ordemCategoria(categoria: Categoria) {
  const idade = pegarIdade(categoria.titulo) ?? 999;
  const letra = pegarLetra(categoria.titulo);
  return { idade, letra: letra ? letra.charCodeAt(0) : 999 };
}

function ordenarCategorias(categorias: Categoria[]) {
  return [...categorias].sort((a, b) => {
    const ordemA = ordemCategoria(a);
    const ordemB = ordemCategoria(b);
    if (ordemA.idade !== ordemB.idade) return ordemA.idade - ordemB.idade;
    return ordemA.letra - ordemB.letra;
  });
}

function totalAtletas(categoria: Categoria) {
  return (categoria.equipes || []).reduce(
    (total, equipe) => total + (equipe.atletas?.length || 0),
    0,
  );
}

// Cada categoria ocupa uma linha inteira. As equipes, dentro dela,
// formam até 6 colunas x 2 linhas por página em telas grandes.
function TabelaCategoria({ categoria }: { categoria: Categoria }) {
  const [pagina, setPagina] = useState(1);
  const equipes = categoria.equipes || [];
  const totalPaginas = Math.max(
    1,
    Math.ceil(equipes.length / EQUIPES_POR_PAGINA),
  );
  const paginaAtual = Math.min(pagina, totalPaginas);
  const indiceInicial = (paginaAtual - 1) * EQUIPES_POR_PAGINA;
  const equipesVisiveis = equipes.slice(
    indiceInicial,
    indiceInicial + EQUIPES_POR_PAGINA,
  );

  useEffect(() => {
    setPagina(1);
  }, [categoria.id]);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cabeçalho centralizado, independente da quantidade de categorias. */}
      <header className="flex flex-col items-center justify-center gap-2 border-b border-gray-100 bg-gray-50/60 px-4 py-5 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c93b2b]/10 text-[#c93b2b]">
          <Users className="h-5 w-5" />
        </div>
        <h2 className="max-w-full break-words text-lg font-extrabold uppercase text-black md:text-xl">
          {categoria.titulo}
        </h2>
        <p className="text-xs font-semibold text-gray-500">
          {equipes.length} {equipes.length === 1 ? "equipe" : "equipes"} ·{" "}
          {totalAtletas(categoria)} atletas cadastrados
        </p>
      </header>

      <div className="w-full p-3 sm:p-4 xl:p-5">
        {equipes.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {equipesVisiveis.map((equipe, equipeIndex) => (
              <article
                key={
                  equipe.id || `${categoria.id}-${indiceInicial + equipeIndex}`
                }
                className="flex min-w-0 min-h-[155px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-center transition hover:border-[#c93b2b]/40 hover:shadow-md"
              >
                <div className="flex flex-col items-center justify-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c93b2b]/10 text-[11px] font-extrabold text-[#c93b2b]">
                    {indiceInicial + equipeIndex + 1}
                  </span>
                  <h3 className="w-full break-words text-xs font-extrabold uppercase leading-snug text-black">
                    {equipe.nome}
                  </h3>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3">
                  {equipe.atletas?.length ? (
                    equipe.atletas.map((atleta, atletaIndex) => (
                      <p
                        key={atleta.id || `${equipe.id}-${atletaIndex}`}
                        className="w-full break-words text-[11px] font-medium leading-snug text-gray-700 sm:text-xs"
                      >
                        {atleta.nome}
                      </p>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Sem atletas</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-gray-500">
            Nenhuma equipe cadastrada nesta categoria.
          </p>
        )}
      </div>

      {totalPaginas > 1 && (
        <nav
          className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 px-4 py-4"
          aria-label={`Paginação das equipes de ${categoria.titulo}`}
        >
          <button
            type="button"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>
          <span className="text-xs font-semibold text-gray-600">
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </section>
  );
}

export default function RelacaoAtletasPage({
  onBack,
}: RelacaoAtletasPageProps) {
  const [categoriaAtual, setCategoriaAtual] =
    useState<CategoriaSelecionada>("todos");
  const [categoriasBanco, setCategoriasBanco] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  // Carrega os dados exatamente da mesma API da versão anterior.
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setErro(null);
        const response = await fetch(`${API_URL}/listar?tabela=completo`, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
        const json: RespostaAPI = await response.json();
        if (!json || !Array.isArray(json.categorias)) {
          throw new Error("Formato inválido recebido da API.");
        }
        setCategoriasBanco(json.categorias);
      } catch (error) {
        console.error("Erro carregando relação de atletas:", error);
        setErro("Não foi possível carregar a relação de atletas.");
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const categorias = useMemo(
    () => ordenarCategorias(categoriasBanco),
    [categoriasBanco],
  );

  const categoriasExibidas = useMemo(() => {
    if (categoriaAtual === "todos") return categorias;
    return categorias.filter((categoria) => categoria.id === categoriaAtual);
  }, [categoriaAtual, categorias]);

  // A busca continua global, sem depender da categoria selecionada.
  const termoBusca = normalizarBusca(busca);
  const resultadosBusca = useMemo<ResultadoBusca[]>(() => {
    if (!termoBusca) return [];
    const resultados: ResultadoBusca[] = [];
    categorias.forEach((categoria) => {
      categoria.equipes?.forEach((equipe) => {
        equipe.atletas?.forEach((atleta) => {
          if (normalizarBusca(atleta.nome || "").includes(termoBusca)) {
            resultados.push({ atleta, equipe, categoria });
          }
        });
      });
    });
    return resultados.sort((a, b) =>
      a.atleta.nome.localeCompare(b.atleta.nome, "pt-BR", {
        sensitivity: "base",
      }),
    );
  }, [categorias, termoBusca]);

  return (
    <div className="min-h-screen w-full bg-white px-3 py-6 sm:px-5 md:px-6 md:py-10 xl:px-8">
      {/* Sem max-w: a categoria preenche a largura disponível da página. */}
      <div className="mx-auto w-full max-w-none">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center font-semibold text-[#c93b2b] transition hover:opacity-80"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar para a Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          <div className="mx-auto mb-6 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Procure um atleta pelo nome..."
                autoComplete="off"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 text-sm font-semibold text-black shadow-sm outline-none transition placeholder:font-medium placeholder:text-gray-400 focus:border-[#c93b2b] focus:ring-4 focus:ring-[#c93b2b]/10"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] font-medium text-gray-400">
              A busca procura em todas as categorias e equipes.
            </p>
          </div>

          <nav
            className="mb-8 flex flex-wrap items-center justify-center gap-2"
            aria-label="Categorias"
          >
            <button
              type="button"
              onClick={() => setCategoriaAtual("todos")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                categoriaAtual === "todos"
                  ? "bg-[#c93b2b] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                type="button"
                onClick={() => setCategoriaAtual(categoria.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  categoriaAtual === categoria.id
                    ? "bg-[#c93b2b] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoria.titulo}
              </button>
            ))}
          </nav>

          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#c93b2b]" />
              <p className="text-sm font-medium text-gray-500">
                Carregando atletas...
              </p>
            </div>
          )}

          {!loading && erro && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
              <p className="text-sm font-semibold text-red-600">{erro}</p>
            </div>
          )}

          {!loading && !erro && (
            <>
              {termoBusca ? (
                <div>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-black">
                        Resultado da busca
                      </p>
                      <p className="text-xs font-medium text-gray-400">
                        {resultadosBusca.length === 1
                          ? "1 atleta encontrado"
                          : `${resultadosBusca.length} atletas encontrados`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBusca("")}
                      className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
                    >
                      Limpar busca
                    </button>
                  </div>
                  {resultadosBusca.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {resultadosBusca.map(
                        ({ atleta, equipe, categoria }, index) => (
                          <article
                            key={`${categoria.id}-${equipe.id}-${atleta.id}-${index}`}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="border-b border-gray-100 px-4 py-4">
                              <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c93b2b]/10 text-[#c93b2b]">
                                  <Users className="h-4 w-4" />
                                </span>
                                <div className="min-w-0">
                                  <h3 className="text-[14px] font-extrabold leading-tight text-black">
                                    {atleta.nome}
                                  </h3>
                                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                    Atleta
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3 px-4 py-4">
                              <div>
                                <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                  Equipe
                                </span>
                                <strong className="mt-0.5 block text-[12px] font-bold uppercase leading-tight text-black">
                                  {equipe.nome}
                                </strong>
                              </div>
                              <div>
                                <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">
                                  Categoria
                                </span>
                                <strong className="mt-0.5 block text-[11px] font-bold uppercase leading-tight text-[#c93b2b]">
                                  {categoria.titulo}
                                </strong>
                              </div>
                            </div>
                          </article>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-16 text-center">
                      <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                      <p className="text-sm font-bold text-gray-600">
                        Nenhum atleta encontrado.
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-400">
                        Tente digitar outro nome.
                      </p>
                    </div>
                  )}
                </div>
              ) : categoriasExibidas.length > 0 ? (
                // Corrige o problema da categoria isolada, antes espremida
                // em uma das quatro colunas do grid de categorias.
                <div className="flex w-full flex-col items-stretch gap-8">
                  {categoriasExibidas.map((categoria) => (
                    <TabelaCategoria key={categoria.id} categoria={categoria} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  Nenhuma categoria encontrada.
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
