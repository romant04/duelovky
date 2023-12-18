import c_kral from "@/app/assets/prsi/prsi_karty/c_kral.png";
import e_kral from "@/app/assets/prsi/prsi_karty/e_kral.png";
import z_kral from "@/app/assets/prsi/prsi_karty/z_kral.png";
import k_kral from "@/app/assets/prsi/prsi_karty/k_kral.png";
import c_eso from "@/app/assets/prsi/prsi_karty/c_eso.png";
import e_eso from "@/app/assets/prsi/prsi_karty/e_eso.png";
import z_eso from "@/app/assets/prsi/prsi_karty/z_eso.png";
import k_eso from "@/app/assets/prsi/prsi_karty/k_eso.png";
import c_spodek from "@/app/assets/prsi/prsi_karty/c_spodek.png";
import e_spodek from "@/app/assets/prsi/prsi_karty/e_spodek.png";
import z_spodek from "@/app/assets/prsi/prsi_karty/z_spodek.png";
import k_spodek from "@/app/assets/prsi/prsi_karty/k_spodek.png";
import c_svrsek from "@/app/assets/prsi/prsi_karty/c_svrsek.png";
import e_svrsek from "@/app/assets/prsi/prsi_karty/e_svrsek.png";
import z_svrsek from "@/app/assets/prsi/prsi_karty/z_svrsek.png";
import k_svrsek from "@/app/assets/prsi/prsi_karty/k_svrsek.png";
import c_desitka from "@/app/assets/prsi/prsi_karty/c_desitka.png";
import e_desitka from "@/app/assets/prsi/prsi_karty/e_desitka.png";
import z_desitka from "@/app/assets/prsi/prsi_karty/z_desitka.png";
import k_desitka from "@/app/assets/prsi/prsi_karty/k_desitka.png";
import c_devitka from "@/app/assets/prsi/prsi_karty/c_devitka.png";
import e_devitka from "@/app/assets/prsi/prsi_karty/e_devitka.png";
import z_devitka from "@/app/assets/prsi/prsi_karty/z_devitka.png";
import k_devitka from "@/app/assets/prsi/prsi_karty/k_devitka.png";
import c_osma from "@/app/assets/prsi/prsi_karty/c_osma.png";
import e_osma from "@/app/assets/prsi/prsi_karty/e_osma.png";
import z_osma from "@/app/assets/prsi/prsi_karty/z_osma.png";
import k_osma from "@/app/assets/prsi/prsi_karty/k_osma.png";
import c_sedma from "@/app/assets/prsi/prsi_karty/c_sedma.png";
import e_sedma from "@/app/assets/prsi/prsi_karty/e_sedma.png";
import z_sedma from "@/app/assets/prsi/prsi_karty/z_sedma.png";
import k_sedma from "@/app/assets/prsi/prsi_karty/k_sedma.png";
import { StaticImageData } from "next/image";

export interface Card {
  name: StaticImageData;
  color: string;
  value: string;
}

export const CARDS: Card[] = [
  { name: c_kral, color: "c", value: "kral" },
  { name: e_kral, color: "e", value: "kral" },
  { name: z_kral, color: "z", value: "kral" },
  { name: k_kral, color: "k", value: "kral" },
  { name: c_eso, color: "c", value: "eso" },
  { name: e_eso, color: "e", value: "eso" },
  { name: z_eso, color: "z", value: "eso" },
  { name: k_eso, color: "k", value: "eso" },
  { name: c_spodek, color: "c", value: "spodek" },
  { name: e_spodek, color: "e", value: "spodek" },
  { name: z_spodek, color: "z", value: "spodek" },
  { name: k_spodek, color: "k", value: "spodek" },
  { name: c_svrsek, color: "c", value: "svrsek" },
  { name: e_svrsek, color: "e", value: "svrsek" },
  { name: z_svrsek, color: "z", value: "svrsek" },
  { name: k_svrsek, color: "k", value: "svrsek" },
  { name: c_desitka, color: "c", value: "desitka" },
  { name: e_desitka, color: "e", value: "desitka" },
  { name: z_desitka, color: "z", value: "desitka" },
  { name: k_desitka, color: "k", value: "desitka" },
  { name: c_devitka, color: "c", value: "devitka" },
  { name: e_devitka, color: "e", value: "devitka" },
  { name: z_devitka, color: "z", value: "devitka" },
  { name: k_devitka, color: "k", value: "devitka" },
  { name: c_osma, color: "c", value: "osma" },
  { name: e_osma, color: "e", value: "osma" },
  { name: z_osma, color: "z", value: "osma" },
  { name: k_osma, color: "k", value: "osma" },
  { name: c_sedma, color: "c", value: "sedma" },
  { name: e_sedma, color: "e", value: "sedma" },
  { name: z_sedma, color: "z", value: "semda" },
  { name: k_sedma, color: "k", value: "sedma" },
];

export enum COLORS {
  "c" = "c",
  "e" = "e",
  "k" = "k",
  "z" = "z",
}

export enum VALUES {
  "sedma" = "sedma",
  "osma" = "osma",
  "devitka" = "devitka",
  "desitka" = "desitka",
  "spodek" = "spodek",
  "svrsek" = "svrsek",
  "kral" = "kral",
  "eso" = "eso",
}
