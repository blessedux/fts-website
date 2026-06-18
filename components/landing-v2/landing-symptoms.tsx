"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { SYMPTOMS } from "@/lib/landing-v2/constants"

const SYMPTOMS_PORTRAIT = {
  src: "/imgs/bio_pic.webp",
  width: 1010,
  height: 1510,
} as const

function ScrollFadeIn({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`lv2-scroll-fade ${visible ? "lv2-scroll-fade--visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export function LandingSymptomsPanel() {
  const [showForm, setShowForm] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  })

  const formRef = useRef<HTMLFormElement>(null)

  // Implement click-away (click outside) handler to close the form
  useEffect(() => {
    if (!showForm) return

    const handleClickOutside = (event: MouseEvent) => {
      const ctaButton = document.getElementById("symptoms-cta-btn")
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        ctaButton &&
        !ctaButton.contains(event.target as Node)
      ) {
        setShowForm(false)
        setFormSubmitted(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setFormData({ name: "", email: "", subject: "", body: "" })

    // Automatically transition back to normal symptoms list after showing success message
    setTimeout(() => {
      setShowForm(false)
      setFormSubmitted(false)
    }, 4000)
  }

  return (
    <div id="sintomas" className="lv2-symptoms-panel mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:gap-16 md:px-10">
      <ScrollFadeIn className="flex justify-center md:justify-start">
        <div
          data-lv2-symptoms-portrait
          className="relative aspect-[1010/1510] w-full max-w-[280px] overflow-hidden border border-[var(--lv2-taupe)]/30 md:max-w-[320px]"
        >
          <Image
            src={SYMPTOMS_PORTRAIT.src}
            alt="Retrato editorial — la mirada hacia lo interior"
            width={SYMPTOMS_PORTRAIT.width}
            height={SYMPTOMS_PORTRAIT.height}
            className="h-full w-full object-cover object-center grayscale-[15%] contrast-[1.05]"
            sizes="(max-width: 768px) 80vw, 320px"
            priority={false}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--lv2-void)]/70 via-transparent to-[var(--lv2-void)]/25"
            aria-hidden
          />
        </div>
      </ScrollFadeIn>

      <div className="lv2-symptoms-text">
        <ScrollFadeIn>
          <p className="lv2-section-label mb-4">Los síntomas son mensajes</p>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <h2 className="lv2-display text-3xl text-[#f4efe4] md:text-4xl">
            Lo visible señala lo profundo
          </h2>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <div className="lv2-gold-line my-8 max-w-[120px]" />
        </ScrollFadeIn>

        {showForm ? (
          <ScrollFadeIn>
            {formSubmitted ? (
              <div className="lv2-body text-base text-[#f4efe4]/90 py-8 flex flex-col items-center justify-center text-center bg-[var(--lv2-espresso)] border border-[var(--lv2-taupe)]/20 p-6 rounded">
                <div className="text-[var(--lv2-taupe)] text-4xl mb-3">✓</div>
                <p className="font-semibold">¡Mensaje enviado con éxito!</p>
                <p className="text-sm mt-2 text-[var(--lv2-ivory-muted)]">Te responderé a la brevedad.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-[var(--lv2-espresso)] border border-[var(--lv2-taupe)]/20 p-6 rounded">
                <div>
                  <label className="lv2-form-label" htmlFor="symptoms-name">Nombre</label>
                  <input
                    id="symptoms-name"
                    type="text"
                    required
                    className="lv2-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lv2-form-label" htmlFor="symptoms-email">Email</label>
                  <input
                    id="symptoms-email"
                    type="email"
                    required
                    className="lv2-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lv2-form-label" htmlFor="symptoms-subject">Asunto</label>
                  <input
                    id="symptoms-subject"
                    type="text"
                    required
                    className="lv2-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lv2-form-label" htmlFor="symptoms-body">Mensaje</label>
                  <textarea
                    id="symptoms-body"
                    required
                    rows={3}
                    className="lv2-input resize-none"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />
                </div>
                <button type="submit" className="lv2-btn-gold w-full text-xs tracking-wider py-3 mt-2">
                  Enviar mensaje
                </button>
              </form>
            )}
          </ScrollFadeIn>
        ) : (
          <>
            <ul className="space-y-4">
              {SYMPTOMS.map((line) => (
                <ScrollFadeIn key={line}>
                  <li className="lv2-body text-lg text-[#f4efe4]/90">{line}</li>
                </ScrollFadeIn>
              ))}
            </ul>

            <ScrollFadeIn>
              <p className="lv2-symptoms-closing mt-10 text-[var(--lv2-ivory)]">
                Muchas veces no son el{" "}
                <strong className="font-semibold text-[var(--lv2-ivory)]">problema</strong>.
                <br />
                <span className="lv2-symptoms-closing-line">
                  Son la manifestation visible de algo más{" "}
                  <em className="lv2-symptoms-closing-accent">profundo</em>.
                </span>
              </p>
            </ScrollFadeIn>

            <ScrollFadeIn>
              <button
                id="symptoms-cta-btn"
                type="button"
                className="lv2-btn-outline mt-10 text-xs tracking-[0.15em] uppercase"
                onClick={() => setShowForm(true)}
              >
                Hacer una consulta
              </button>
            </ScrollFadeIn>
          </>
        )}
      </div>
    </div>
  )
}

/** @deprecated Use HeroVideoRevealBlock on the landing page */
export function LandingSymptoms() {
  return <LandingSymptomsPanel />
}
