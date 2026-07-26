'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * App-wide confirmations and notices.
 *
 * Replaces window.alert/window.confirm, which are unstyled, block the whole
 * page, and cannot say anything longer than one line. `confirm()` returns a
 * promise so calling code keeps reading top to bottom.
 */

export type Tone = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  description?: string;
  tone?: Tone;
  /** Milliseconds on screen. Errors stay until dismissed by default. */
  duration?: number;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` makes the confirm button destructive. */
  tone?: 'danger' | 'default';
}

interface FeedbackContextValue {
  toast: (options: ToastOptions) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

interface ActiveToast extends ToastOptions {
  id: number;
}

const TONE_STYLE: Record<Tone, { accent: string; icon: ReactNode }> = {
  success: {
    accent: 'var(--sage)',
    icon: <CheckCircle2 className="h-4 w-4 text-[color:var(--sage)]" />,
  },
  error: {
    accent: 'var(--destructive)',
    icon: <XCircle className="h-4 w-4 text-[color:var(--destructive)]" />,
  },
  warning: {
    accent: 'var(--brand)',
    icon: <AlertTriangle className="h-4 w-4 text-[color:var(--brand-deep)]" />,
  },
  info: {
    accent: 'var(--brand)',
    icon: <Info className="h-4 w-4 text-[color:var(--brand-deep)]" />,
  },
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmOptions | null>(null);
  const nextId = useRef(0);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      const tone = options.tone ?? 'info';
      // Errors persist — someone needs to read why something failed.
      const duration = options.duration ?? (tone === 'error' ? 0 : 5000);

      setToasts((current) => [...current, { ...options, tone, id }]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState(options);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setConfirmState(null);
  }, []);

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {/* Toast stack — bottom right on desktop, full width on mobile. */}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const style = TONE_STYLE[t.tone ?? 'info'];
          return (
            <div
              key={t.id}
              role={t.tone === 'error' ? 'alert' : 'status'}
              style={{ borderLeftColor: style.accent }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-[color:var(--hairline)] border-l-4 bg-[color:var(--surface)] p-4 shadow-brand motion-safe:animate-[rise-in_180ms_ease-out]"
            >
              <span className="mt-0.5 shrink-0">{style.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[color:var(--ink)]">{t.title}</p>
                {t.description ? (
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                    {t.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[color:var(--muted)] hover:text-[color:var(--ink)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={confirmState !== null} onOpenChange={(open) => !open && settle(false)}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{confirmState?.title}</DialogTitle>
            {confirmState?.description ? (
              <DialogDescription>{confirmState.description}</DialogDescription>
            ) : null}
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => settle(false)}
              className="rounded-full border border-[color:var(--hairline)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--ink)]"
            >
              {confirmState?.cancelLabel ?? 'Cancel'}
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => settle(true)}
              className={
                confirmState?.tone === 'danger'
                  ? 'rounded-full bg-[color:var(--destructive)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90'
                  : 'rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-deep)] hover:text-white'
              }
            >
              {confirmState?.confirmLabel ?? 'Confirm'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within a FeedbackProvider');
  return ctx;
}
