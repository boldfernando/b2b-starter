import { beforeEach, describe, expect, it, vi } from "vitest"

const requestState = vi.hoisted(() => ({
  acceptLanguage: "en-US,en;q=0.9",
  countryCode: "dk",
  cookieLocale: undefined as string | undefined,
}))

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) =>
      name === "_medusa_locale" && requestState.cookieLocale
        ? { value: requestState.cookieLocale }
        : undefined,
  })),
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === "x-store-country-code") {
        return requestState.countryCode
      }

      return name === "accept-language" ? requestState.acceptLanguage : null
    },
  })),
}))

vi.mock("server-only", () => ({}))

import { getAuthHeaders, getRequestLocale } from "./cookies"

describe("request locale propagation", () => {
  beforeEach(() => {
    requestState.acceptLanguage = "en-US,en;q=0.9"
    requestState.countryCode = "dk"
    requestState.cookieLocale = undefined
  })

  it("uses the negotiated locale for the Store API before a locale cookie exists", async () => {
    await expect(getRequestLocale()).resolves.toBe("en-US")
    await expect(getAuthHeaders()).resolves.toMatchObject({
      "x-medusa-locale": "en-US",
    })
  })

  it("keeps an explicit locale cookie ahead of the regional default", async () => {
    requestState.countryCode = "br"
    requestState.cookieLocale = "en-US"

    await expect(getRequestLocale()).resolves.toBe("en-US")
  })
})
