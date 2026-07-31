import { describe, expect, it } from "vitest"

import { convertToLocale } from "./money"

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ")

describe("convertToLocale", () => {
  it("uses the presentation default instead of inferring locale from currency", () => {
    expect(
      normalizeSpaces(
        convertToLocale({ amount: 1234.56, currency_code: "usd" })
      )
    ).toBe("US$ 1.234,56")
  })

  it("formats BRL with the explicitly selected English locale", () => {
    expect(
      normalizeSpaces(
        convertToLocale({
          amount: 1234.56,
          currency_code: "brl",
          locale: "en-US",
        })
      )
    ).toBe("R$1,234.56")
  })
})
