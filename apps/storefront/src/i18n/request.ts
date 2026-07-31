import { cookies, headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import {
  AppLocale,
  localeCookieName,
  resolveLocale,
  supportedLocales,
} from "./config"
import { mergeMessages } from "./messages"

const messageLoaders: Record<
  AppLocale,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  "pt-BR": () => import("../../messages/pt-BR.json"),
  "en-US": () => import("../../messages/en-US.json"),
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const requestHeaders = await headers()
  const countryCode = requestHeaders.get("x-store-country-code")
  const locale = resolveLocale({
    cookieLocale: cookieStore.get(localeCookieName)?.value,
    countryCode,
    acceptLanguage: requestHeaders.get("accept-language"),
  })
  const fallbackMessages = (await messageLoaders["en-US"]()).default
  const messages =
    locale === "en-US"
      ? fallbackMessages
      : mergeMessages(fallbackMessages, (await messageLoaders[locale]()).default)

  return {
    locale,
    messages,
    timeZone: "America/Sao_Paulo",
    formats: {
      dateTime: {
        short: {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 2,
        },
      },
    },
  }
})

export { supportedLocales }
