"use client";

import { useEffect } from "react";
import { TbCheck, TbX } from "react-icons/tb";
import { FaFilePdf } from "react-icons/fa6";
import type { Lang } from "../data/cv";

type Props = {
  open: boolean;
  lang: Lang;
  onCancel: () => void;
  onConfirm: () => void;
};

const COPY = {
  title: {
    en: "Your PDF uses the Notion layout",
    pt: "Seu PDF usa o layout do Notion",
  },
  lede: {
    en: "It's the version built to live on paper and inboxes:",
    pt: "É a versão pensada pra papel e caixa de entrada:",
  },
  reasons: {
    en: [
      "Formal, recruiter-friendly tone, the closest to a traditional CV.",
      "Standard A4/Letter margins, clean page breaks, no clipped content.",
      "Compact and two pages at most: faster to skim, easier to attach.",
      "Black text on white, low ink, prints well even in grayscale.",
      "Plain, ATS-friendly typography that any parser can read.",
    ],
    pt: [
      "Tom formal, amigável pra RH, o mais próximo de um CV tradicional.",
      "Margens A4/Carta padrão, quebras de página limpas, nada cortado.",
      "Compacto, no máximo duas páginas: lê rápido, anexa fácil.",
      "Texto preto no branco, pouca tinta, imprime bem em escala de cinza.",
      "Tipografia sóbria, amigável a ATS, qualquer parser consegue ler.",
    ],
  },
  outro: {
    en: "The site keeps the look you're on — only the PDF switches to Notion.",
    pt: "O site continua no visual em que você está — só o PDF vai no Notion.",
  },
  cancel: { en: "Cancel", pt: "Cancelar" },
  confirm: { en: "Generate PDF", pt: "Gerar PDF" },
};

export default function PdfNoticeDialog({
  open,
  lang,
  onCancel,
  onConfirm,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      else if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={COPY.title[lang]}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white text-zinc-900 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.55)]">
        <header className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e23334]/10 text-[#e23334]">
              <FaFilePdf size={18} />
            </span>
            <h2 className="font-sans text-[17px] font-bold tracking-tight">
              {COPY.title[lang]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={COPY.cancel[lang]}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            <TbX size={18} />
          </button>
        </header>

        <div className="px-6 py-4 text-[13.5px] leading-relaxed text-zinc-700">
          <p>{COPY.lede[lang]}</p>
          <ul className="mt-2.5 flex flex-col gap-1.5">
            {COPY.reasons[lang].map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="mt-[3px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <TbCheck size={10} strokeWidth={3} />
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] italic text-zinc-500">
            {COPY.outro[lang]}
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-black/10 bg-zinc-50 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-zinc-700 transition hover:bg-zinc-200"
          >
            {COPY.cancel[lang]}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#e23334] px-4 py-1.5 text-[12.5px] font-semibold text-white shadow-sm transition hover:bg-[#c21f20]"
          >
            <FaFilePdf size={13} />
            <span>{COPY.confirm[lang]}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
