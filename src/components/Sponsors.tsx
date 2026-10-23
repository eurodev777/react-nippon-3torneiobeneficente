
import React from "react";
import { SPONSORS, SUPPORTERS } from "../data";
import SponsorCard from "./SponsorCard";
import SupporterCard from "./SupporterCard";
import { ShieldCheck } from "lucide-react";

export default function Sponsors({ onSelectItem }) {
  // 3 patrocinadores master:
  // 0 = MAG
  // 1 = GWM + BTG (UMA ÚNICA LOGO)
  // 2 = TECNOFIX
  const [mag, masterCentral, tecnofix] = SPONSORS;

  const masterCard =
    "flex min-w-0 items-center justify-center " +
    "overflow-hidden rounded-2xl border-[3px] " +
    "border-[#01213E] bg-white shadow-xl " +
    "transition-all duration-300 hover:-translate-y-1 " +
    "[&>*]:!w-full [&>*]:!max-w-none";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#01213E] via-[#07558E] to-[#01213E] py-10 md:py-14">

      {/* EFEITOS DE FUNDO */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1150px] px-3 sm:px-6 lg:px-8">

        {/* ===================================== */}
        {/* PATROCINADORES MASTER - 3 LOGOS */}
        {/* ===================================== */}

        <div id="patrocinio" className="scroll-mt-20">

          {/* TÍTULO */}
          <div className="relative z-10 flex justify-center">
            <span className="rounded-full bg-[#01213E] px-8 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg sm:text-sm">
              PATROCINADOR MASTER
            </span>
          </div>

          {/* DESKTOP */}
          <div className="mt-3 hidden grid-cols-[1fr_3.2fr_1fr] items-center gap-5 md:grid lg:gap-8">

            {/* MAG - ESQUERDA */}
            {mag && (
              <div className={`${masterCard} aspect-[1.35/1]`}>
                <SponsorCard
                  sponsor={mag}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}

            {/* GWM + BTG - CENTRO - UMA LOGO */}
            {masterCentral && (
              <div className={`${masterCard} min-h-[150px] px-5 py-4 lg:min-h-[170px]`}>
                <SponsorCard
                  sponsor={masterCentral}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}

            {/* TECNOFIX - DIREITA */}
            {tecnofix && (
              <div className={`${masterCard} aspect-[1.35/1]`}>
                <SponsorCard
                  sponsor={tecnofix}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}
          </div>

          {/* MOBILE */}
          <div className="mt-4 grid grid-cols-2 items-center gap-3 md:hidden">

            {/* LOGO CENTRAL PRIMEIRO NO MOBILE */}
            {masterCentral && (
              <div className={`${masterCard} col-span-2 min-h-[115px] p-4`}>
                <SponsorCard
                  sponsor={masterCentral}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}

            {/* MAG */}
            {mag && (
              <div className={`${masterCard} aspect-[1.4/1]`}>
                <SponsorCard
                  sponsor={mag}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}

            {/* TECNOFIX */}
            {tecnofix && (
              <div className={`${masterCard} aspect-[1.4/1]`}>
                <SponsorCard
                  sponsor={tecnofix}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ===================================== */}
        {/* APOIADORES - 14 LOGOS */}
        {/* 7 COLUNAS / 2 LINHAS NO DESKTOP */}
        {/* ===================================== */}

        <div id="apoio" className="mt-6 scroll-mt-20 md:mt-7">

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7 lg:gap-3">

            {SUPPORTERS.map((supporter) => (
              <div
                key={supporter.id}
                className="
                  relative
                  aspect-[1.6/1]
                  min-w-0
                  overflow-hidden
                  rounded-xl
                  border-2
                  border-[#01213E]
                  bg-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:shadow-2xl
                  [&>*]:!w-full
                  [&>*]:!h-full
                  [&>*]:!max-w-none
                  [&>*]:!min-h-0
                "
              >
                <SupporterCard
                  supporter={supporter}
                  onClick={(s) => onSelectItem(s)}
                />
              </div>
            ))}

          </div>
        </div>

        {/* ===================================== */}
        {/* COMPROMISSO COM O ATLETA */}
        {/* ===================================== */}

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-sm md:mt-16 md:flex-row md:text-left">

          <div className="flex items-center gap-3">

            <ShieldCheck className="h-6 w-6 shrink-0 text-[#D7B16B]" />

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Compromisso com o Atleta
              </h4>

              <p className="mt-1 text-xs leading-snug text-white/70">
                Todos os patrocinadores são verificados e garantem atendimento prioritário aos competidores do Intercolonial.
              </p>
            </div>
          </div>

          <span className="whitespace-nowrap rounded-full bg-[#D7B16B]/15 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#E8C887]">
            Parceria Oficial 2026
          </span>

        </div>

      </div>
    </section>
  );
}
