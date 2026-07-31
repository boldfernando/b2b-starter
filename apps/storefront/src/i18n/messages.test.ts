import { describe, expect, it } from "vitest"

import english from "../../messages/en-US.json"
import portuguese from "../../messages/pt-BR.json"
import { mergeMessages } from "./messages"

const messageKeys = (value: Record<string, unknown>, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key

    return typeof child === "object" && child !== null
      ? messageKeys(child as Record<string, unknown>, path)
      : [path]
  })

describe("translation catalogs", () => {
  it("keeps en-US and pt-BR message keys in sync", () => {
    expect(messageKeys(portuguese).sort()).toEqual(messageKeys(english).sort())
  })

  it("contains no empty Brazilian Portuguese messages", () => {
    const values = JSON.stringify(portuguese)

    expect(values).not.toContain('""')
  })

  it("falls back to English for missing nested Portuguese messages", () => {
    expect(
      mergeMessages(
        {
          Checkout: {
            title: "Checkout",
            payment: "Payment",
          },
        },
        {
          Checkout: {
            title: "Finalizar compra",
          },
        }
      )
    ).toEqual({
      Checkout: {
        title: "Finalizar compra",
        payment: "Payment",
      },
    })
  })
})
