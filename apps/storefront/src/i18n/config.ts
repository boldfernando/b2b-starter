export const supportedLocales = ["pt-BR", "en-US"] as const

export type AppLocale = (typeof supportedLocales)[number]

export const defaultLocale: AppLocale = "pt-BR"
export const localeCookieName = "_medusa_locale"

const countryLocaleMap: Record<string, AppLocale> = {
  br: "pt-BR",
}

const languageLocaleMap: Record<string, AppLocale> = {
  pt: "pt-BR",
  en: "en-US",
}

export const isSupportedLocale = (locale?: string | null): locale is AppLocale =>
  supportedLocales.some(
    (supportedLocale) =>
      supportedLocale.toLowerCase() === locale?.trim().toLowerCase()
  )

const normalizeSupportedLocale = (locale: string): AppLocale | undefined =>
  supportedLocales.find(
    (supportedLocale) =>
      supportedLocale.toLowerCase() === locale.trim().toLowerCase()
  )

export const localeForCountry = (
  countryCode?: string | null
): AppLocale | undefined =>
  countryCode ? countryLocaleMap[countryCode.trim().toLowerCase()] : undefined

const localeFromAcceptLanguage = (
  acceptLanguage?: string | null
): AppLocale | undefined => {
  if (!acceptLanguage) {
    return undefined
  }

  const preferences = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [languageTag, ...parameters] = entry.trim().split(";")
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith("q=")
      )
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1

      return {
        index,
        languageTag,
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .filter(({ languageTag, quality }) => languageTag && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)

  for (const { languageTag } of preferences) {
    const exactLocale = normalizeSupportedLocale(languageTag)

    if (exactLocale) {
      return exactLocale
    }

    const baseLanguage = languageTag.split("-")[0]?.toLowerCase()
    const mappedLocale = languageLocaleMap[baseLanguage]

    if (mappedLocale) {
      return mappedLocale
    }
  }

  return undefined
}

type ResolveLocaleOptions = {
  cookieLocale?: string | null
  countryCode?: string | null
  acceptLanguage?: string | null
}

export const resolveLocale = ({
  cookieLocale,
  countryCode,
  acceptLanguage,
}: ResolveLocaleOptions): AppLocale =>
  (cookieLocale && normalizeSupportedLocale(cookieLocale)) ||
  localeFromAcceptLanguage(acceptLanguage) ||
  localeForCountry(countryCode) ||
  defaultLocale
