/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sponsor, Supporter, Director } from "./types";
import gwm from "./assets/patrocinadores/btg.png";
import mag from "./assets/patrocinadores/mag.png";
import tecnofix from "./assets/patrocinadores/tecnofix.jpeg";
import dai from "./assets/patrocinadores/dai.png";
import tammy from "./assets/patrocinadores/tammy.jpeg";
import mira from "./assets/patrocinadores/mira.jpeg";
import saude from "./assets/patrocinadores/saude.jpeg";
import farma from "./assets/patrocinadores/farma.jpeg";
import geovane from "./assets/patrocinadores/geovane.jpeg";
import hecaplast from "./assets/patrocinadores/hecaplast.jpeg";
import indusplastic from "./assets/patrocinadores/indusplastic.png";
import interpisos from "./assets/patrocinadores/interpisos.png";
import llegat from "./assets/patrocinadores/llegat.jpeg";
import hks from "./assets/patrocinadores/hks.png";
import giba from "./assets/patrocinadores/giba.png";
import friends from "./assets/patrocinadores/friends.png";
import metaltec from "./assets/patrocinadores/metaltec.jpeg";
import sothink from "./assets/apoio/sothink.png";
import mt from "./assets/diretoria/1.jpg";
import ic from "./assets/diretoria/2.jpg";
import st from "./assets/diretoria/3.jpg";
import tk from "./assets/diretoria/4.jpg";
import rt from "./assets/diretoria/5.jpg";

// Adicione isso ao seu arquivo data.ts (ou onde você guarda SPONSORS e SUPPORTERS)

export const SPONSORS = [
  {
    id: "mag",
    name: "MAG",
    logoType: "text",
    logoText: mag,
    tagline: "",
    siteUrl: "",
    instagram: "",
    whatsapp: "",
    phone: "",
    description: "",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: "gwm",
    name: "GWM Investments | BTG Pactual",
    logoType: "text",
    logoText: gwm,
    tagline: "",
    siteUrl: "https://gwminvestments.com.br/",
    instagram: "gwm.investments",
    whatsapp: "",
    phone: "",
    description:
      "Do planejamento à realização, somos a ponte entre você e o seu futuro.",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: "tecnofix",
    name: "Tecnofix",
    logoType: "text",
    logoText: tecnofix,
    tagline: "",
    siteUrl: "",
    instagram: "",
    whatsapp: "",
    phone: "",
    description: "",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
];

export const SUPPORTERS = [
  {
    id: "hospital-saude-animal",
    name: "Hospital Saúde Animal",
    logoType: "text",
    logoText: saude,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "farma-ponte",
    name: "Farma Ponte",
    logoType: "text",
    logoText: farma,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "geovane-antunes",
    name: "Geovane Antunes - Consultoria Imobiliária",
    logoType: "text",
    logoText: geovane,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "hecaplast",
    name: "Hecaplast",
    logoType: "text",
    logoText: hecaplast,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "indusplastic",
    name: "Indusplastic",
    logoType: "text",
    logoText: indusplastic,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "mira",
    name: "Mira - Manutenção e Vistorias Imobiliárias",
    logoType: "text",
    logoText: mira,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "interpisos",
    name: "Interpisos",
    logoType: "text",
    logoText: interpisos,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "llegat",
    name: "L.LEGAT",
    logoType: "text",
    logoText: llegat,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "hks",
    name: "HKS Advogados",
    logoType: "text",
    logoText: hks,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "bar-do-giba",
    name: "Bar do Giba",
    logoType: "text",
    logoText: giba,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "friends-family",
    name: "Friends & Family",
    logoType: "text",
    logoText: friends,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "tammy",
    name: "Tammy - O Verdadeiro Pastel",
    logoType: "text",
    logoText: tammy,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "metaltec",
    name: "Metaltec",
    logoType: "text",
    logoText: metaltec,
    siteUrl: "",
    instagram: "",
  },
  {
    id: "dai",
    name: "Dai Alimentos",
    logoType: "text",
    logoText: dai,
    siteUrl: "",
    instagram: "daialimentos",
  },
];

export const DIRECTORS: Director[] = [
  {
    id: "milton",
    name: "Milton Tsubaki",
    role: "Diretor",
    initials: mt,
  },
  {
    id: "israel",
    name: "Israel Costa Vale",
    role: "Coordenador Social",
    initials: ic,
  },
  {
    id: "sergio",
    name: "Sergio Takeda",
    role: "Coordenador Técnico",
    initials: st,
  },
  {
    id: "tomoko",
    name: "Tomoko Kanaschiro",
    role: "Coordenadora de Comunicação",
    initials: tk,
  },
  {
    id: "raquel",
    name: "Raquel Takeda",
    role: "Coordenadora Financeira",
    initials: rt,
  },
];

export const tabelasMock = {
  categorias: [
    {
      id: "ouro_masc",
      nome: "Ouro Masculino",
      jogos: [
        {
          id: "JG.OM1",
          equipeA: "KOSMOS",
          equipeB: "M.CAMICADO",
          data: "17/JUL",
          hora: "15:30",
          fase: "Principal",
        },
        {
          id: "JG.OM2",
          equipeA: "COOPER",
          equipeB: "SOROCABA II",
          data: "17/JUL",
          hora: "15:30",
          fase: "Principal",
        },
        {
          id: "JG.OM3",
          equipeA: "SOROCABA I",
          equipeB: "KOSMOS",
          data: "18/JUL",
          hora: "07:00",
          fase: "Principal",
        },
      ],
    },
    {
      id: "prata_masc",
      nome: "Prata Masculino",
      jogos: [
        {
          id: "JG.PM1",
          equipeA: "M.CAMICADO I",
          equipeB: "COOPER LONGWAY",
          data: "17/JUL",
          hora: "07:00",
          fase: "Principal",
        },
        {
          id: "JG.PM2",
          equipeA: "SOROCABA",
          equipeB: "M.CAMICADO II",
          data: "17/JUL",
          hora: "07:00",
          fase: "Principal",
        },
      ],
    },
    {
      id: "ouro_fem",
      nome: "Ouro Feminino",
      jogos: [
        {
          id: "JG.OF1",
          equipeA: "SOROCABA",
          equipeB: "ACEAS",
          data: "17/JUL",
          hora: "11:00",
          fase: "Principal",
        },
        {
          id: "JG.OF2",
          equipeA: "M.CAMICADO I",
          equipeB: "COOPER II",
          data: "17/JUL",
          hora: "15:30",
          fase: "Principal",
        },
      ],
    },
  ],
};
