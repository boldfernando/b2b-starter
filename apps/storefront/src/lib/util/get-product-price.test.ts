import { describe, expect, it } from "vitest"

import { getPricesForVariant } from "./get-product-price"

const normalizeSpaces = (value: string) => value.replace(/\s/g, " ")

describe("getPricesForVariant", () => {
  it("formats a BRL catalog price with the selected presentation locale", () => {
    const price = getPricesForVariant(
      {
        calculated_price: {
          calculated_amount: 1234.56,
          original_amount: 1234.56,
          currency_code: "brl",
          calculated_price: {
            price_list_type: "standard",
          },
        },
      },
      "en-US"
    )

    expect(normalizeSpaces(price?.calculated_price ?? "")).toBe("R$1,234.56")
  })
})
