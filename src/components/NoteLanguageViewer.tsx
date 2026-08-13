import { useEffect, useState } from "react";
import { Languages, Loader2, X } from "lucide-react";
import { PdfViewer } from "@/components/PdfViewer";
import {
  noteLanguages,
  pdfPathForLanguage,
  signedPdfUrl,
  type Note,
  type ReadableLanguage,
} from "@/lib/notes-store";
import { cn } from "@/lib/utils";

const LABEL: Record<ReadableLanguage, string> = {
  hinglish: "Hinglish",
  english: "English",
};

/**
 * Note details modal with an inline PDF viewer and a language switcher that
 * flips between the Hinglish and English versions of the same chapter.
 */
export function NoteLanguageViewer({
  note,
  allNotes,
  initialLanguage,
  onClose,
}: {
  note: Note;
  allNotes: Note[];
  initialLanguage: ReadableLanguage;
  onClose: () => void;
}) {
  const available = noteLanguages(note, allNotes);
  const [lang, setLang] = useState<ReadableLanguage>(
    available.includes(initialLanguage) ? initialLanguage : (available[0] ?? "hinglish"),
  );
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setUrl(null);
    void (async () => {
      const path = pdfPathForLanguage(note, lang, allNotes);
      if (!path) {
        if (active) setStatus("missing");
        return;
      }
      const signed = await signedPdfUrl(path);
      if (!active) return;
      setUrl(signed);
      setStatus(signed ? "ready" : "missing");
    })();
    return () => {
      active = false;
    };
  }, [note, lang, allNotes]);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-black/90 backdrop-blur-sm">
      <div className="flex items-start gap-3 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{note.title}</p>
          <p className="truncate text-[11px] text-white/60">{note.subject || "Note pack"}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close note"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <Languages className="h-3.5 w-3.5 text-accent-amber" />
        <div className="flex gap-1 rounded-full bg-white/10 p-1">
          {(["hinglish", "english"] as const).map((l) => {
            const enabled = available.includes(l);
            return (
              <button
                key={l}
                type="button"
                disabled={!enabled}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest transition",
                  lang === l ? "bg-accent-amber text-accent-amber-foreground" : "text-white/70",
                  !enabled && "opacity-40",
                )}
              >
                {LABEL[l]}
              </button>
            );
          })}
        </div>
        {!available.includes("english") && (
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            English coming soon
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        {status === "loading" && (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-white/60" />
          </div>
        )}
        {status === "missing" && (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/60">
            The {LABEL[lang]} version of this chapter hasn&apos;t been uploaded yet.
          </div>
        )}
        {status === "ready" && url && (
          <PdfViewer src={url} name={`${note.title} (${LABEL[lang]})`} className="w-full" />
        )}
      </div>
    </div>
  );
}
