import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dictionaries, type Lang, type Translations } from './translations'

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Translations
}

const I18nContext = createContext<I18nContextValue | null>(null)

const STORAGE_KEY = 'mf-lang'

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'vi' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'vi'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n()
  const btn = (code: Lang, label: string) => {
    const active = lang === code
    return (
      <button
        type="button"
        onClick={() => setLang(code)}
        aria-pressed={active}
        style={{
          border: 'none',
          background: active ? '#0ea5e9' : 'transparent',
          color: active ? '#0c1c2e' : '#7aadde',
          fontSize: compact ? 11 : 12,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.5px',
          padding: compact ? '4px 8px' : '5px 10px',
          borderRadius: 5,
          cursor: 'pointer',
          lineHeight: 1,
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: 3,
        borderRadius: 8,
        border: '1px solid #3b6ea5',
        background: '#0e2540',
        flexShrink: 0,
      }}
    >
      {btn('vi', 'VI')}
      {btn('en', 'EN')}
    </div>
  )
}

export function chipLabel(t: Translations, code: string): string {
  return t.chips[code] ?? code
}
