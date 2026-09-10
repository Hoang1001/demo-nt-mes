import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { LanguageToggle, chipLabel, useI18n } from './i18n'
import type { Translations } from './i18n/translations'

export type CaptureChip = {
  code: string
  label: string
  example: string
}

export type CaptureSlide = {
  file: string
  code: string
  name: string
  short: string
  chips: CaptureChip[]
}

type Props = {
  onClose: () => void
  eyebrow: string
  title: [string, string]
  accent: string
  subtitlePrefix: string
  slides: CaptureSlide[]
  statsRight?: string
  hint?: string
}

function asset(file: string) {
  return `${import.meta.env.BASE_URL}${file}`
}

/** Localize chip labels (and known VI→EN example strings) for the active language. */
export function localizeSlides(slides: CaptureSlide[], t: Translations): CaptureSlide[] {
  return slides.map(s => ({
    ...s,
    chips: s.chips.map(c => ({
      ...c,
      label: chipLabel(t, c.code),
      example: t.examples[c.example] ?? c.example,
    })),
  }))
}

export default function CaptureGalleryModal({
  onClose,
  eyebrow,
  title,
  accent,
  subtitlePrefix,
  slides,
  statsRight,
  hint,
}: Props) {
  const { t } = useI18n()
  const [idx, setIdx] = useState(0)
  const slide = slides[idx]
  const resolvedHint = hint ?? t.common.galleryHint
  const rootStyle = {
    '--gallery-accent': accent,
    position: 'fixed',
    inset: 0,
    zIndex: 220,
    background: '#0c1c2e',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 48px 20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  } as CSSProperties

  const go = (dir: number) => {
    setIdx(i => (i + dir + slides.length) % slides.length)
  }

  useEffect(() => {
    slides.forEach(s => {
      const img = new Image()
      img.src = asset(s.file)
    })
  }, [slides])

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose()
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
        ev.preventDefault()
        go(1)
      }
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
        ev.preventDefault()
        go(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, slides.length])

  return (
    <div style={rootStyle}>
      <div style={{
        flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '14px',
      }}>
        <div>
          <div style={{
            fontSize: '10px', color: '#7aadde', letterSpacing: '4px',
            fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '6px',
          }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1.5px', lineHeight: 1 }}>
              {title[0]}
            </span>
            <span style={{ fontSize: '36px', fontWeight: 800, color: accent, letterSpacing: '-1.5px', lineHeight: 1 }}>
              {title[1]}
            </span>
          </div>
          <div style={{ fontSize: '15px', color: '#7aadde', marginTop: '6px', lineHeight: 1.45 }}>
            {subtitlePrefix} — {slide.code} · {slide.name}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <LanguageToggle compact />
          <button onClick={onClose} className="back-btn">{t.common.back}</button>
        </div>
      </div>

      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '12px',
      }}>
        {slide.chips.map((lv, i) => (
          <div key={lv.code} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && (
              <span style={{ color: accent + '88', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>→</span>
            )}
            <div style={{
              border: `1px solid ${accent}55`,
              background: '#0e1a28',
              borderRadius: 7,
              padding: '6px 10px',
            }}>
              <div style={{
                color: accent, fontSize: 11, fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.4px',
              }}>
                {lv.code}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                {lv.label} · {lv.example}
              </div>
            </div>
          </div>
        ))}
        <div style={{
          marginLeft: 'auto',
          color: '#7aadde',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.3px',
        }}>
          {idx + 1} / {slides.length}{statsRight ? ` · ${statsRight}` : ''}
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a3048', flexShrink: 0, marginBottom: '12px' }} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          border: '1px solid #1e3a5f',
          borderRadius: 10,
          background: '#111f30',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => go(1)}
      >
        <img
          src={asset(slide.file)}
          alt={`${slide.code} — ${slide.name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              aria-label={t.common.prevSlide}
              onClick={e => { e.stopPropagation(); go(-1) }}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              aria-label={t.common.nextSlide}
              onClick={e => { e.stopPropagation(); go(1) }}
            >
              ›
            </button>
          </>
        )}
      </div>

      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        flexWrap: 'wrap',
      }}>
        {slides.map((s, i) => (
          <button
            key={s.file}
            type="button"
            className={`gallery-tab${i === idx ? ' is-active' : ''}`}
            onClick={() => setIdx(i)}
          >
            {s.short}
          </button>
        ))}
        <div style={{
          marginLeft: 'auto',
          color: '#7aadde',
          fontSize: 11,
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.3px',
        }}>
          {resolvedHint}
        </div>
      </div>
    </div>
  )
}
