import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { FaTimes } from "react-icons/fa";
import { QuoteForm } from "@/components/forms/QuoteForm";

/* ─── Context ─────────────────────────────────────────────────── */

interface QuoteModalCtx {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<QuoteModalCtx>({
  open: () => {},
  close: () => {},
});

export function useQuoteModal() {
  return useContext(Ctx);
}

/* ─── Provider (wrap around the app) ──────────────────────────── */

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      {visible && <QuoteModal onClose={close} />}
    </Ctx.Provider>
  );
}

/* ─── Modal ───────────────────────────────────────────────────── */

function QuoteModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md animate-[modalIn_0.2s_ease] rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-heading"
          aria-label="Close quote form"
        >
          <FaTimes />
        </button>

        <QuoteForm />
      </div>
    </div>
  );
}
