import { describe, expect, it } from "vitest"

import {
  defaultLocale,
  localeForCountry,
  resolveLocale,
  supportedLocales,
} from "./config"

describe("locale configuration", () => {
  it("supports Brazilian Portuguese and English with pt-BR as the default", () => {
    expect(supportedLocales).toEqual(["pt-BR", "en-US"])
    expect(defaultLocale).toBe("pt-BR")
  })

  it("maps the Brazilian market to pt-BR", () => {
    expect(localeForCountry("BR")).toBe("pt-BR")
  })

  it("prioritizes a supported locale cookie", () => {
    expect(
      resolveLocale({
        cookieLocale: "en-US",
        countryCode: "br",
        acceptLanguage: "pt-BR,pt;q=0.9",
      })
    ).toBe("en-US")
  })

  it("uses pt-BR for the Brazilian market", () => {
    expect(resolveLocale({ countryCode: "br" })).toBe("pt-BR")
  })

  it("keeps browser language independent from the Brazilian market", () => {
    expect(
      resolveLocale({ countryCode: "br", acceptLanguage: "en-US,en;q=0.9" })
    ).toBe("en-US")
  })

  it("negotiates generic Portuguese and English browser preferences", () => {
    expect(resolveLocale({ acceptLanguage: "pt-PT,pt;q=0.9,en;q=0.8" })).toBe(
      "pt-BR"
    )
    expect(resolveLocale({ acceptLanguage: "en-GB,en;q=0.9" })).toBe("en-US")
  })

  it("ignores unsupported cookie values and falls back safely", () => {
    expect(
      resolveLocale({ cookieLocale: "es-ES", acceptLanguage: "es-ES" })
    ).toBe("pt-BR")
  })
})
