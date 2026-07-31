"use client"

import { localeCookieName, supportedLocales } from "@/i18n/config"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations("Language")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const changeLocale = (nextLocale: string) => {
    document.cookie = `${localeCookieName}=${encodeURIComponent(
      nextLocale
    )}; Path=/; Max-Age=31536000; SameSite=Lax`

    startTransition(() => router.refresh())
  }

  return (
    <label className="hidden items-center gap-2 text-xs text-ui-fg-subtle medium:flex">
      <span className="sr-only">{t("label")}</span>
      <select
        aria-label={t("label")}
        className="rounded-full border border-ui-border-base bg-white px-3 py-1.5 text-sm text-ui-fg-base focus:border-ui-border-interactive focus:outline-none"
        disabled={isPending}
        onChange={(event) => changeLocale(event.target.value)}
        value={locale}
      >
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {supportedLocale === "pt-BR" ? t("portuguese") : t("english")}
          </option>
        ))}
      </select>
    </label>
  )
}
