import { ArrowRight, MapPin } from "lucide-react";
import logo from "../assets/nippon-sorocaba.png";
import nippon from "../assets/centenarias.png";
import insta from "../assets/instagram.png";
import local from "../assets/drone.jpg";
import home from "../assets/home.jpeg";

interface HeroSectionProps {
  aerialImagePath: string;
}

export default function HeroSection(_props: HeroSectionProps) {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-r from-[#01213E] to-[#074A78] py-8 md:py-16"
    >
      {/* Decorative background flowers */}

      <div className="absolute left-4 top-20 opacity-5 pointer-events-none md:left-20">
        <svg
          className="h-40 w-40 text-gold"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 0 C55 20 75 20 100 20 C80 25 80 45 100 50 C80 55 80 75 100 80 C75 80 55 100 50 100 C45 80 25 80 0 80 C20 75 20 55 0 50 C20 45 20 25 0 20 C25 20 45 20 50 0 Z" />
        </svg>
      </div>

      <div className="absolute right-4 bottom-20 opacity-5 pointer-events-none md:right-20">
        <svg
          className="h-48 w-48 text-gold"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 0 C55 20 75 20 100 20 C80 25 80 45 100 50 C80 55 80 75 100 80 C75 80 55 100 50 100 C45 80 25 80 0 80 C20 75 20 55 0 50 C20 45 20 25 0 20 C25 20 45 20 50 0 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho: logos, idealizadores e Instagram */}
        <div className="flex min-h-[470px] flex-col justify-between gap-10 border-b border-gold/10 pb-10">
          {/* Logos e informações do evento */}
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="Nippon Sorocaba Tênis"
                className="max-h-40 w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center">
              <img
                src={nippon}
                alt="3º Torneio Beneficente Grupo Decisium"
                className="max-h-40 w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex flex-col items-center text-center text-white">
              <h2 className="text-sm font-black leading-snug tracking-tight md:text-base">
                Sábado, 07 de Novembro, a partir das 08:00
              </h2>
              <p className="mt-1 font-sans text-xs font-bold uppercase tracking-widest">
                UCENS / Nippon Sorocaba
              </p>
              <p className="mt-0.5 font-sans text-[11px] font-semibold tracking-wider">
                Unidade Campo II
              </p>
            </div>
          </div>

          <div className="mt-16 text-center max-w-4xl mx-auto space-y-8 text-white">
            {/* Quote block */}
            <div className="relative py-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gold/30" />
              <h3 className="text-lg md:text-2xl">
                3º Torneio Beneficente de Tênis do Grupo Decisium
              </h3>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gold/30" />
            </div>

            {/* Beautiful welcome prose */}
            <div className="space-y-6 text-sm leading-relaxed font-medium text-justify md:text-center md:px-6">
              <p>
                <strong className="">
                  Um dia para jogar, encontrar amigos e fazer o bem.
                </strong>
                <br />O Torneio Beneficente de Tênis do Grupo Decisium chega à
                sua terceira edição, com o apoio do Nippon Sorocaba, reunindo
                pessoas que compartilham a paixão pelo esporte e a vontade de
                ajudar. É a união de atletas, patrocinadores e apoiadores que dá
                sentido a esse encontro.
              </p>

              <p>
                Mais do que jogar tênis, queremos fortalecer uma corrente de
                solidariedade. Um evento feito por pessoas, para pessoas, em que
                a convivência e a contribuição de cada um ajudam centenas de
                pessoas. Neste ano, graças a vocês, essa união apoiará a
                Instituição Batuíra e a Vila dos Velhinhos.
              </p>
            </div>
          </div>

          {/* Foto normal, RETANGULAR, sem moldura ou recorte; legenda EMBAIXO */}
          <figure className="mx-auto flex w-full flex-col items-center px-3">
            <img
              src={home}
              alt="Adriano Ribeiro e Camila Ribeiro"
              className="block h-auto w-full max-w-[180px] rounded-none object-contain"
              style={{ borderRadius: 0, height: "auto", objectFit: "contain" }}
            />
            <figcaption className="mt-3 w-full text-center text-sm font-semibold leading-relaxed text-white md:text-base">
              Idealizadores: Adriano Ribeiro e Camila Ribeiro - Grupo Decisium
            </figcaption>
          </figure>

          {/* Instagram */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <img width="24" height="24" src={insta} alt="Instagram" />
            <a
              href="https://www.instagram.com/nipponsorocabatenis"
              className="font-bold text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @nipponsorocabatenis
            </a>
          </div>
        </div>

        {/* Info Blocks Row with maps */}

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Location Block (6 cols) */}

          <div className="md:col-span-6 space-y-6">
            <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gold" />

              <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c93b2b]/10 text-[#c93b2b]">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-stone-400">
                    Sede / Local
                  </h3>

                  <p className="mt-1 font-sans text-base font-extrabold text-stone-900 leading-snug">
                    Sede Campestre II - Nippon Sorocaba
                  </p>

                  <p className="text-xs text-stone-500 font-medium leading-relaxed mt-0.5">
                    União Cultural e Esportiva Nipo Brasileira de Sorocaba
                  </p>

                  <div className="mt-4 border-t border-stone-100 pt-3">
                    <p className="font-mono text-xs text-[#c93b2b] font-bold">
                      Antiga Estrada de Araçoiaba da Serra, 211
                    </p>

                    <p className="font-sans text-xs text-stone-500 font-semibold mt-0.5">
                      Araçoiaba da Serra - SP
                    </p>

                    <span className="text-[10px] text-stone-400 block mt-1 italic">
                      *(Também conhecida como Estrada da Cooperativa, 211)
                    </span>
                  </div>

                  <div className="mt-4">
                    <a
                      href="https://maps.google.com/?q=Nippon+Sorocaba+Sede+Campestre+Araçoiaba+da+Serra"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-bold text-gold-dark hover:text-gold transition group/btn"
                    >
                      <span>Como chegar no Google Maps</span>

                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Details List */}

            {/* <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl border border-stone-200 bg-white/70 p-4">

                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">Formato</span>

                <span className="text-xs font-extrabold text-stone-800 block mt-0.5">Equipes (Masc / Fem)</span>

                <span className="text-[10px] text-stone-500 block mt-0.5">Sem limite de idade</span>

              </div>

              <div className="rounded-xl border border-stone-200 bg-white/70 p-4">

                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">Infraestrutura</span>

                <span className="text-xs font-extrabold text-stone-800 block mt-0.5">8 Quadras de Saibro</span>

                <span className="text-[10px] text-stone-500 block mt-0.5">Disponibilizadas no local</span>

              </div>

              <div className="rounded-xl border border-stone-200 bg-white/70 p-4">

                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">Bola Oficial</span>

                <span className="text-xs font-extrabold text-stone-800 block mt-0.5">Dunlop Australian Open</span>

                <span className="text-[10px] text-stone-500 block mt-0.5">Qualidade premium</span>

              </div>

              <div className="rounded-xl border border-stone-200 bg-white/70 p-4">

                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block">Inscrição</span>

                <span className="text-xs font-extrabold text-[#c93b2b] block mt-0.5">R$ 300,00 por Atleta</span>

                <span className="text-[10px] text-stone-500 block mt-0.5">Inclui Almoço</span>

              </div>

            </div> */}
          </div>

          {/* Aerial Photo Block (6 cols) */}

          <div className="md:col-span-6 flex justify-center">
            <div className="relative rounded-2xl border-4 border-white bg-white p-2 shadow-lg rotate-1 max-w-md w-full">
              <img
                src={local}
                alt="Sede Campestre II Nippon Sorocaba"
                referrerPolicy="no-referrer"
                className="rounded-xl object-cover w-full h-72 md:h-80 shadow-inner"
              />

              <div className="p-3 text-center">
                <span className="font-serif italic text-xs font-bold text-stone-500">
                  Vista Aérea da Sede Campestre II — Nippon Sorocaba
                </span>
              </div>

              {/* Corner tape decorations for polaroid feel */}

              <div className="absolute -top-4 -left-4 w-12 h-6 bg-white/45 backdrop-blur-xs shadow-xs -rotate-12 border-t border-b border-stone-200/50 hidden md:block" />

              <div className="absolute -bottom-4 -right-4 w-12 h-6 bg-white/45 backdrop-blur-xs shadow-xs -rotate-12 border-t border-b border-stone-200/50 hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
