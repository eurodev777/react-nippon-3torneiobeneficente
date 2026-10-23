/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { DIRECTORS } from "../data";
import { Users, Mail, Phone, CalendarRange } from "lucide-react";
import { motion } from "motion/react";

export default function Diretoria() {
  // We can render professional representative headshot layouts with styled Japanese/sports backgrounds
  const getAvatarStyle = (initials: string) => {
    switch (initials) {
      case "MT":
        return "from-amber-500 to-amber-700 text-amber-50";
      case "IC":
        return "from-blue-500 to-blue-700 text-blue-50";
      case "ST":
        return "from-emerald-500 to-emerald-700 text-emerald-50";
      case "TK":
        return "from-rose-500 to-rose-700 text-rose-50";
      case "RT":
        return "from-violet-500 to-violet-700 text-violet-50";
      default:
        return "from-stone-500 to-stone-700 text-stone-50";
    }
  };

  return (
    <section
      id="diretoria"
      className="relative bg-gradient-to-r from-[#01213E] to-[#074A78] text-white py-16 border-t border-b border-gold/10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center mb-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.25em]">
            Conselho & Liderança
          </h2>
          <h3 className="mt-2 font-serif text-3xl font-extrabold md:text-4xl tracking-tight leading-none">
            Diretoria do Departamento de Tênis 2026
          </h3>
          <p className="mt-3 text-sm text-stone-200 max-w-xl mx-auto leading-relaxed">
            A comissão responsável pela organização, coordenação técnica e
            garantia de fair play ao longo de todo o 5º Encontro das Divas.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {DIRECTORS.map((director, index) => {
            const avatarColor = getAvatarStyle(director.initials);
            return (
              <motion.div
                key={director.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -4,
                  borderColor: "#b38e41",
                  boxShadow: "0 10px 20px -10px rgba(179, 142, 65, 0.12)",
                }}
                className="flex flex-col items-center p-5 rounded-2xl bg-transparent backdrop-blur-xs text-center transition-all"
              >
                {/* Custom Styled Avatar Card representing the headshot */}
                <div className="relative mb-4 h-40 w-28 overflow-hidden shadow-xs">
                  <div
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${avatarColor}`}
                  >
                    <img
                      src={director.initials}
                      className="object-cover h-full w-full"
                    />
                    {/* Tiny subtle circular Japanese design element */}
                    <div className="absolute right-1 bottom-1 h-5 w-5 rounded-full border border-white/20 flex items-center justify-center">
                      <span className="text-[6px] font-bold opacity-60">
                        印
                      </span>
                    </div>
                  </div>
                  {/* Glass shimmer effect */}
                  <div className="absolute inset-0 bg-linear-gradient(from-top-left-to-bottom-right, rgba(255,255,255,0.15), transparent)" />
                </div>

                {/* Director Name */}
                <h4 className="font-sans text-sm font-bold text-white">
                  {director.name}
                </h4>

                {/* Director Role */}
                <p className="mt-1 lg:text-xs text-[10px] font-semibold text-white tracking-wide uppercase">
                  {director.role}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-4xl mx-auto space-y-8">
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
              <br />O Torneio Beneficente de Tênis do Grupo Decisium chega à sua
              terceira edição, com o apoio do Nippon Sorocaba, reunindo pessoas
              que compartilham a paixão pelo esporte e a vontade de ajudar. É a
              união de atletas, patrocinadores e apoiadores que dá sentido a
              esse encontro.
            </p>

            <p>
              Mais do que jogar tênis, queremos fortalecer uma corrente de
              solidariedade. Um evento feito por pessoas, para pessoas, em que a
              convivência e a contribuição de cada um ajudam centenas de
              pessoas. Neste ano, graças a vocês, essa união apoiará a
              Instituição Batuíra e a Vila dos Velhinhos.
            </p>
            <p className="text-center text-white text-base font-bold block">
              Juntas por essa causa
            </p>
            <p>
              Nesta edição, o rosa ganha um significado ainda mais especial. O
              5º Encontro das Divas abraça também a conscientização do Outubro
              Rosa, unindo nossas atletas em torno de uma mensagem de cuidado,
              prevenção e valorização da saúde da mulher. Porque quando entramos
              em quadra juntas, podemos fazer muito mais do que disputar pontos.
              Esporte. Amizade. Família. Juntas por essa causa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
