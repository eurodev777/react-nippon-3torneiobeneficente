import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock3,
  Coffee,
  Gavel,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import mapa from "../assets/mapa-nippon.jpg"
type Category = "todos" | "geral" | "jogos" | "regulamento";
type SectionCategory = Exclude<Category, "todos">;

type Rule = {
  title: string;
  text?: string;
  points?: string[];
  note?: string;
};

type RuleSection = {
  id: string;
  title: string;
  category: SectionCategory;
  icon: LucideIcon;
  rules?: Rule[];
  special?: "bracket" | "schedule" | "map";
  searchText?: string;
};

interface RegulamentoPageProps {
  onBack: () => void;
}


const sections: RuleSection[] = [
  {
    id: "geral",
    title: "Informações Gerais",
    category: "geral",
    icon: Landmark,
    rules: [
      {
        title: "Evento",
        text: "3º Torneio Beneficente de Tênis — Grupo Decisium & Nippon Sorocaba.",
      },
      {
        title: "Local",
        text: "Nippon Sorocaba (União Cultural Esportiva Nipo Brasileira de Sorocaba), antiga Estrada de Araçoiaba da Serra, 211 — Araçoiaba da Serra.",
      },
      { title: "Data e início", text: "Sábado, 07 de novembro de 2026, a partir das 8h." },
      { title: "Formato do torneio", text: "Competição por equipes, com jogos em duplas." },
    ],
  },
  {
    id: "equipes",
    title: "Composição das Equipes",
    category: "geral",
    icon: Users,
    rules: [
      {
        title: "12 equipes / 72 jogadores",
        text: "O torneio terá 12 equipes, cada uma formada por 3 duplas (6 jogadores).",
      },
      {
        title: "Distribuição por sorteio",
        text: "A distribuição dos jogadores será realizada por sorteio, sob responsabilidade da Comissão Organizadora.",
      },
      {
        title: "Duplas fixas",
        text: "A Comissão Organizadora definirá previamente as 3 duplas de cada equipe. As formações permanecerão fixas durante todo o torneio, exceto na final.",
        note: "Somente na final os capitães das equipes finalistas poderão definir a formação das 3 duplas.",
      },
    ],
  },
  {
    id: "classificacao",
    title: "Fase de Grupos e Classificação",
    category: "regulamento",
    icon: Trophy,
    rules: [
      {
        title: "Divisão dos grupos",
        text: "As 12 equipes serão sorteadas em uma chave única, dividida em 4 grupos com 3 equipes em cada.",
        points: [
          "Grupo 1: Equipes 1, 2 e 3",
          "Grupo 2: Equipes 4, 5 e 6",
          "Grupo 3: Equipes 7, 8 e 9",
          "Grupo 4: Equipes 10, 11 e 12",
        ],
      },
      {
        title: "Round-robin",
        text: "Dentro de cada grupo, todas as equipes se enfrentam. A equipe em 1º lugar avança para a semifinal da Chave Principal; a equipe em 2º lugar avança para a semifinal da Repescagem.",
      },
      {
        title: "Desempate na fase de grupos",
        text: "Critérios aplicados na seguinte ordem:",
        points: [
          "1. Confronto direto",
          "2. Saldo de vitórias da equipe",
          "3. Saldo de games",
          "4. Sorteio",
        ],
      },
    ],
  },
  {
    id: "confrontos",
    title: "Formato dos Confrontos",
    category: "jogos",
    icon: Swords,
    rules: [
      {
        title: "Três jogos por confronto",
        text: "Cada confronto entre duas equipes será disputado por suas três duplas:",
        points: [
          "Dupla 1 da Equipe A × Dupla 1 da Equipe B",
          "Dupla 2 da Equipe A × Dupla 2 da Equipe B",
          "Dupla 3 da Equipe A × Dupla 3 da Equipe B",
        ],
      },
      {
        title: "Jogos simultâneos",
        text: "As três duplas jogarão simultaneamente, em quadras distintas.",
      },
      {
        title: "Terceiro jogo obrigatório",
        text: "Mesmo que o confronto esteja definido por 2 × 0, o terceiro jogo deverá ser concluído obrigatoriamente.",
      },
      {
        title: "Exceção na final",
        text: "Na disputa da final, os capitães das equipes finalistas poderão redefinir a formação das 3 duplas.",
      },
    ],
  },
  {
    id: "partidas",
    title: "Regras das Partidas",
    category: "jogos",
    icon: Clock3,
    rules: [
      {
        title: "Set único — PRO SET",
        text: "Todos os jogos serão disputados em um único set até 8 games (PRO SET).",
      },
      {
        title: "Tie-break em 7 × 7",
        text: "Em caso de empate em 7 × 7 games, será disputado um tie-break. Vence a dupla que alcançar pelo menos 7 pontos, com diferença mínima de 2 pontos.",
      },
      {
        title: "Sistema No-Ad (sem vantagem)",
        text: "Em 40–40, o game será definido no ponto seguinte. A dupla recebedora escolherá quem receberá o saque.",
      },
      {
        title: "No-Ad em confrontos entre duplas mistas",
        text: "Quando ambas as duplas forem mistas, se o sacador for homem deverá sacar para o homem adversário; se a sacadora for mulher deverá sacar para a mulher adversária.",
      },
      {
        title: "Aquecimento",
        text: "As duplas terão 5 minutos de aquecimento, contados a partir do anúncio da chamada do jogo.",
      },
      {
        title: "Chegada antecipada",
        text: "Solicita-se que os participantes cheguem pelo menos 30 minutos antes dos jogos programados.",
      },
    ],
  },
  {
    id: "chaveamento",
    title: "Chave Principal e Repescagem",
    category: "jogos",
    icon: Trophy,
    special: "bracket",
    searchText:
      "Semifinal principal repescagem primeiro colocado segundo colocado grupo 1 grupo 2 grupo 3 grupo 4 jogos 13 14 15 16 17 18 campeao vice campeao final 14 15 16 horas",
  },
  {
    id: "horarios",
    title: "Horários dos Jogos e Quadras",
    category: "jogos",
    icon: CalendarDays,
    special: "schedule",
    searchText: "Tabela de jogos quadras Q1 Q2 Q3 Q4 Q5 Q6 manhã tarde",
  },
  {
    id: "premiacao",
    title: "Premiação e Alimentação",
    category: "geral",
    icon: Coffee,
    rules: [
      {
        title: "Premiação",
        points: [
          "Troféus para a Equipe Campeã",
          "Troféus para a Equipe Vice-Campeã",
          "Medalhas para a Equipe Campeã da Repescagem",
        ],
      },
      {
        title: "Café da manhã",
        text: "Será servido café da manhã aos tenistas participantes e convidados.",
      },
      { title: "Almoço", text: "Haverá venda de almoço no local." },
    ],
  },
  {
    id: "arbitragem",
    title: "Arbitragem",
    category: "regulamento",
    icon: Gavel,
    rules: [
      { title: "Árbitros", text: "Julio Alves / Sergio Takeda." },
    ],
  },
  {
    id: "comissao",
    title: "Comissão Organizadora",
    category: "regulamento",
    icon: ShieldCheck,
    rules: [
      {
        title: "Alterações na competição",
        text: "A Comissão Organizadora poderá alterar o chaveamento, o sistema de jogos e os horários em caso de mudanças no número de equipes participantes ou atrasos por qualquer motivo.",
      },
      {
        title: "Contusão e substituição",
        text: "Em caso de contusão durante o torneio, o capitão poderá consultar a Comissão Organizadora, que analisará e definirá um possível substituto ou substituta.",
      },
      {
        title: "Dúvidas e penalidades",
        text: "Dúvidas sobre aplicação e interpretação do regulamento, inclusive penalidades, serão resolvidas pela Comissão Técnica e Disciplinar. Sua decisão será soberana e definitiva.",
      },
      {
        title: "Casos omissos",
        text: "Os casos não previstos neste regulamento serão resolvidos pela Comissão Organizadora.",
      },
      {
        title: "Comprovação de identidade",
        text: "A qualquer momento, a Comissão poderá solicitar RG ou outro documento que comprove a identidade conforme a inscrição prévia.",
      },
    ],
  },
  {
    id: "mapa",
    title: "Mapa do Local",
    category: "geral",
    icon: MapPin,
    special: "map",
    searchText:
      "Nippon Sorocaba UCENS Sede Campestre II antiga Estrada de Araçoiaba da Serra 211 bairro Ipanema do meio Araçoiaba da Serra mapa localização",
  },
];

type ScheduleRow = {
  time: string;
  left: string;
  right: string;
  leftGame: string;
  rightGame: string;
};

// Q1, Q2, Q3 recebem as duplas 1, 2 e 3 do confronto à esquerda.
// Q4, Q5, Q6 recebem as duplas 1, 2 e 3 do confronto à direita.
const scheduleRows: ScheduleRow[] = [
  { time: "08:00", left: "Equipe 1 × Equipe 2", right: "Equipe 4 × Equipe 5", leftGame: "JG. 1", rightGame: "JG. 2" },
  { time: "09:00", left: "Equipe 7 × Equipe 8", right: "Equipe 10 × Equipe 11", leftGame: "JG. 3", rightGame: "JG. 4" },
  { time: "10:00", left: "Equipe 2 × Equipe 3", right: "Equipe 5 × Equipe 6", leftGame: "JG. 5", rightGame: "JG. 6" },
  { time: "11:00", left: "Equipe 8 × Equipe 9", right: "Equipe 11 × Equipe 12", leftGame: "JG. 7", rightGame: "JG. 8" },
  { time: "12:00", left: "Equipe 1 × Equipe 3", right: "Equipe 4 × Equipe 6", leftGame: "JG. 9", rightGame: "JG. 10" },
  { time: "13:00", left: "Equipe 7 × Equipe 9", right: "Equipe 10 × Equipe 12", leftGame: "JG. 11", rightGame: "JG. 12" },
  { time: "14:00", left: "2º Grupo 1 × 2º Grupo 2", right: "2º Grupo 3 × 2º Grupo 4", leftGame: "JG. 13 · Repescagem", rightGame: "JG. 14 · Repescagem" },
  { time: "15:00", left: "1º Grupo 1 × 1º Grupo 2", right: "1º Grupo 3 × 1º Grupo 4", leftGame: "JG. 15 · Principal", rightGame: "JG. 16 · Principal" },
  { time: "16:00", left: "Final Principal", right: "Final da Repescagem", leftGame: "JG. 18", rightGame: "JG. 17" },
];

const filters: { label: string; value: Category }[] = [
  { label: "Todos", value: "todos" },
  { label: "Geral", value: "geral" },
  { label: "Jogos", value: "jogos" },
  { label: "Regulamento", value: "regulamento" },
];

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function ruleSearchText(rule: Rule): string {
  return [rule.title, rule.text, ...(rule.points ?? []), rule.note]
    .filter(Boolean)
    .join(" ");
}

function Schedule({ rows }: { rows: ScheduleRow[] }) {
  return (
    <div className="p-4 sm:p-6">
      <p className="mb-4 text-sm leading-relaxed text-stone-600">
        Cada confronto ocupa três quadras simultaneamente. As duplas 1, 2 e 3
        jogam, respectivamente, nas quadras indicadas abaixo.
      </p>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.time} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="bg-[#01213E] px-4 py-2 text-sm font-bold text-white">{row.time}</div>
            <div className="grid gap-3 p-4 text-sm">
              <div>
                <span className="text-[11px] font-bold uppercase text-sky-700">Quadras 1, 2 e 3 · {row.leftGame}</span>
                <p className="mt-1 font-semibold text-stone-800">{row.left}</p>
                <p className="text-xs text-stone-500">Duplas 1, 2 e 3</p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <span className="text-[11px] font-bold uppercase text-amber-700">Quadras 4, 5 e 6 · {row.rightGame}</span>
                <p className="mt-1 font-semibold text-stone-800">{row.right}</p>
                <p className="text-xs text-stone-500">Duplas 1, 2 e 3</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto rounded-xl border border-stone-200 md:block">
        <table className="w-full min-w-[840px] border-collapse text-left text-xs">
          <thead className="bg-stone-100 text-stone-700">
            <tr>
              <th className="px-3 py-4 font-extrabold">Horário</th>
              {[1, 2, 3, 4, 5, 6].map((court) => (
                <th key={court} className="px-3 py-4 font-extrabold">Q{court}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.time} className={rowIndex % 2 ? "bg-stone-50" : "bg-white"}>
                <td className="whitespace-nowrap border-t border-stone-100 px-3 py-4 font-extrabold text-[#01213E]">
                  {row.time}
                </td>
                {[1, 2, 3, 4, 5, 6].map((court) => (
                  <td key={court} className="border-t border-stone-100 px-3 py-3 align-top">
                    <span className={`mb-1 block text-[10px] font-bold ${court <= 3 ? "text-sky-700" : "text-amber-700"}`}>
                      {court <= 3 ? row.leftGame : row.rightGame}
                    </span>
                    <span className="block font-semibold text-stone-700">
                      {court <= 3 ? row.left : row.right}
                    </span>
                    <span className="mt-1 block text-[11px] text-stone-500">
                      Dupla {((court - 1) % 3) + 1}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Bracket() {
  const brackets = [
    {
      name: "Chave Principal",
      subtitle: "Primeiros colocados de cada grupo",
      bg: "bg-sky-50",
      border: "border-sky-200",
      title: "text-sky-900",
      matches: [
        { number: "JG. 15 · 15:00", pairing: "1º Grupo 1 × 1º Grupo 2" },
        { number: "JG. 16 · 15:00", pairing: "1º Grupo 3 × 1º Grupo 4" },
        { number: "JG. 18 · 16:00", pairing: "Vencedor JG. 15 × Vencedor JG. 16", final: true },
      ],
      result: "Campeão e Vice-Campeão",
    },
    {
      name: "Repescagem",
      subtitle: "Segundos colocados de cada grupo",
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "text-amber-900",
      matches: [
        { number: "JG. 13 · 14:00", pairing: "2º Grupo 1 × 2º Grupo 2" },
        { number: "JG. 14 · 14:00", pairing: "2º Grupo 3 × 2º Grupo 4" },
        { number: "JG. 17 · 16:00", pairing: "Vencedor JG. 13 × Vencedor JG. 14", final: true },
      ],
      result: "Campeão da Repescagem",
    },
  ];

  return (
    <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
      {brackets.map((bracket) => (
        <div key={bracket.name} className={`rounded-xl border p-4 ${bracket.bg} ${bracket.border}`}>
          <h3 className={`font-bold ${bracket.title}`}>{bracket.name}</h3>
          <p className="mb-5 mt-1 text-xs text-stone-600">{bracket.subtitle}</p>
          <div className="space-y-3">
            {bracket.matches.map((match) => (
              <div key={match.number} className="rounded-lg border border-white bg-white/90 p-3 shadow-sm">
                <span className={`text-[11px] font-bold ${bracket.title}`}>{match.number}</span>
                <p className="mt-1 text-sm font-semibold text-stone-800">{match.pairing}</p>
                {"final" in match && match.final && (
                  <span className="mt-1 inline-block text-[11px] font-bold uppercase text-stone-500">Final</span>
                )}
              </div>
            ))}
          </div>
          <div className={`mt-4 flex items-center gap-2 border-t pt-4 text-sm font-extrabold ${bracket.border} ${bracket.title}`}>
            <Trophy className="h-4 w-4" /> {bracket.result}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RegulamentoPage({ onBack }: RegulamentoPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("todos");
  const [activeSection, setActiveSection] = useState("geral");
  const search = normalizeSearch(searchTerm);

  const matchingScheduleRows = useMemo(() => {
    if (!search) return scheduleRows;
    return scheduleRows.filter((row) =>
      normalizeSearch(Object.values(row).join(" ")).includes(search)
    );
  }, [search]);

  const visibleSections = useMemo(() => {
    return sections.flatMap((section) => {
      if (activeCategory !== "todos" && section.category !== activeCategory) {
        return [];
      }

      const headingMatches = !search || normalizeSearch(section.title).includes(search);
      const rules = (section.rules ?? []).filter(
        (rule) => headingMatches || normalizeSearch(ruleSearchText(rule)).includes(search)
      );
      const specialMatches = !!section.special && (
        headingMatches ||
        normalizeSearch(section.searchText ?? "").includes(search) ||
        (section.special === "schedule" && matchingScheduleRows.length > 0)
      );

      if (!rules.length && !specialMatches) return [];
      return [{ ...section, rules, showSpecial: specialMatches }];
    });
  }, [activeCategory, search, matchingScheduleRows]);

  const navigateTo = (section: RuleSection) => {
    setSearchTerm("");
    setActiveCategory("todos");
    setActiveSection(section.id);
    requestAnimationFrame(() => {
      document.getElementById(`section-${section.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div id="regulamento-page-container" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3 sm:items-center">
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:border-[#01213E]/30 hover:text-[#01213E]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#01213E]">
              3º Torneio Beneficente de Tênis
            </span>
            <h1 className="mt-1 font-serif text-2xl font-black uppercase leading-tight text-stone-900 sm:text-3xl">
              Regulamento Oficial
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-stone-500">
              Grupo Decisium & Nippon Sorocaba
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700">
          <CalendarDays className="h-4 w-4 text-[#01213E]" /> 07 de novembro de 2026 · 8h
        </div>
      </div>

      {/* Resumo rápido */}
      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { title: "12 equipes", detail: "6 jogadores por equipe", icon: Users },
          { title: "4 grupos", detail: "3 equipes por grupo", icon: ClipboardList },
          { title: "PRO SET", detail: "Set único até 8 games", icon: Swords },
          { title: "6 quadras", detail: "Jogos simultâneos", icon: Clock3 },
        ].map(({ title, detail, icon: Icon }) => (
          <div key={title} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <Icon className="mb-2 h-5 w-5 text-[#01213E]" />
            <p className="text-sm font-black text-stone-900">{title}</p>
            <p className="mt-1 text-xs text-stone-500">{detail}</p>
          </div>
        ))}
      </div>

      {/* Busca e filtros */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Pesquisar: PRO SET, No-Ad, horários, equipes..."
            className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-10 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-[#01213E] focus:ring-1 focus:ring-[#01213E]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:col-span-6 md:pb-0">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              onClick={() => setActiveCategory(filter.value)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${
                activeCategory === filter.value
                  ? "bg-[#01213E] text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Índice lateral */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-1">
            <span className="mb-3 block px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Índice de Seções
            </span>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => navigateTo(section)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-3 text-left text-xs font-bold transition ${
                    activeSection === section.id
                      ? "bg-[#01213E]/10 text-[#01213E]"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" /> {section.title}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
                </button>
              );
            })}
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-900">Comissão Técnica e Disciplinar</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-800">
                Dúvidas, penalidades e casos não previstos são tratados pelas comissões responsáveis.
              </p>
            </div>
          </div>
        </aside>

        {/* Conteúdo do regulamento */}
        <main className="space-y-8 lg:col-span-3">
          {visibleSections.map((section) => {
            const Icon = section.icon;
            const rowsToShow = !search || normalizeSearch(section.title).includes(search) || normalizeSearch(section.searchText ?? "").includes(search)
              ? scheduleRows
              : matchingScheduleRows;

            return (
              <motion.section
                key={section.id}
                id={`section-${section.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 border-b border-stone-100 bg-stone-50 px-5 py-4 sm:px-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#01213E]/10 text-[#01213E]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="font-serif text-base font-black uppercase tracking-wide text-stone-900 sm:text-lg">
                    {section.title}
                  </h2>
                </div>

                {!!section.rules?.length && (
                  <div className="divide-y divide-stone-100">
                    {section.rules.map((rule) => (
                      <article key={rule.title} className="p-5 transition hover:bg-stone-50/50 sm:p-6">
                        <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#01213E]">
                          {rule.title}
                        </h3>
                        {rule.text && (
                          <p className="mt-2 text-sm font-medium leading-relaxed text-stone-600">
                            {rule.text}
                          </p>
                        )}
                        {!!rule.points?.length && (
                          <ul className="mt-3 space-y-2 pl-5 text-sm font-medium leading-relaxed text-stone-600">
                            {rule.points.map((point) => (
                              <li key={point} className="list-disc">{point}</li>
                            ))}
                          </ul>
                        )}
                        {rule.note && (
                          <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs font-semibold leading-relaxed text-amber-900">
                            {rule.note}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
                {section.showSpecial && section.special === "bracket" && <Bracket />}
                {section.showSpecial && section.special === "schedule" && <Schedule rows={rowsToShow} />}
                {section.showSpecial && section.special === "map" && (
                  <div className="p-5 sm:p-6">
                    <p className="mb-4 text-sm font-medium leading-relaxed text-stone-600">
                      Nippon Sorocaba — UCENS, Sede Campestre II. Antiga Estrada de Araçoiaba da Serra, 211 — Araçoiaba da Serra.
                    </p>
                    <img
                      src={mapa}
                      alt="Mapa de acesso ao Nippon Sorocaba, Sede Campestre II, extraído do regulamento oficial"
                      loading="lazy"
                      className="w-full rounded-xl border border-stone-200 bg-white object-contain"
                    />
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Antiga+Estrada+de+Aracoiaba+da+Serra+211+Aracoiaba+da+Serra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#01213E] underline underline-offset-4 hover:no-underline"
                    >
                      <MapPin className="h-4 w-4" /> Buscar endereço no Google Maps
                    </a>
                  </div>
                )}
              </motion.section>
            );
          })}

          {visibleSections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-stone-400" />
              <p className="mt-3 font-serif text-lg font-bold text-stone-700">Nenhuma regra encontrada</p>
              <p className="mt-1 text-sm text-stone-500">Tente pesquisar por “PRO SET”, “No-Ad”, “equipes” ou “repescagem”.</p>
              <button
                type="button"
                onClick={() => { setSearchTerm(""); setActiveCategory("todos"); }}
                className="mt-5 text-sm font-bold text-[#01213E] underline"
              >
                Limpar busca e filtros
              </button>
            </div>
          )}
          <p className="text-center text-xs font-semibold text-stone-500">
            Grupo Decisium / Nippon Sorocaba — Comissão Organizadora
          </p>
        </main>
      </div>

      <div className="mt-12 flex justify-center border-t border-stone-200 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-full bg-[#01213E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para a página principal
        </button>
      </div>
    </div>
  );
}
