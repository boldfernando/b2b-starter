const seededVariantSkus = new Set([
  "256-BLUE",
  "512-RED",
  "WEBCAM-BLACK",
  "WEBCAM-WHITE",
  "PHONE-256-PURPLE",
  "PHONE-256-RED",
  "ACME-MONITOR-WHITE",
  "ACME-MONITOR-BLACK",
  "HEADPHONE-BLACK",
  "HEADPHONE-WHITE",
  "KEYBOARD-BLACK",
  "KEYBOARD-WHITE",
  "MOUSE-BLACK",
  "MOUSE-WHITE",
  "SPEAKER-BLACK",
  "SPEAKER-WHITE",
])

type ExistingPrice = {
  id?: string
  amount: number
  currency_code: string
}

type SeededVariant = {
  id: string
  product_id?: string | null
  sku?: string | null
  prices?: ExistingPrice[] | null
}

type VariantPriceUpdate = {
  variant_id: string
  product_id: string
  prices: ExistingPrice[]
}

/**
 * Creates additive BRL price payloads for this seed's own variants only.
 * Existing price IDs stay in the payload because Medusa's price workflow
 * replaces a price set when its complete state is not supplied.
 */
export const buildBrlVariantPrices = (
  variants: SeededVariant[]
): VariantPriceUpdate[] =>
  variants.flatMap((variant) => {
    if (
      !variant.product_id ||
      !variant.sku ||
      !seededVariantSkus.has(variant.sku)
    ) {
      return []
    }

    const prices = variant.prices ?? []

    if (prices.some((price) => price.currency_code === "brl")) {
      return []
    }

    const sourcePrice = prices.find((price) => price.currency_code === "usd")

    if (!sourcePrice) {
      return []
    }

    return [
      {
        variant_id: variant.id,
        product_id: variant.product_id,
        prices: [
          ...prices,
          {
            amount: sourcePrice.amount,
            currency_code: "brl",
          },
        ],
      },
    ]
  })
