import { buildBrlVariantPrices } from "../brl-variant-prices";

describe("buildBrlVariantPrices", () => {
  it("adds BRL only to seeded variants while preserving existing price identities", () => {
    expect(
      buildBrlVariantPrices([
        {
          id: "variant_seeded",
          product_id: "product_seeded",
          sku: "256-BLUE",
          prices: [
            { id: "price_eur", amount: 1299, currency_code: "eur" },
            { id: "price_usd", amount: 1299, currency_code: "usd" },
          ],
        },
        {
          id: "variant_unrelated",
          product_id: "product_unrelated",
          sku: "UNRELATED-SKU",
          prices: [
            { id: "price_unrelated_usd", amount: 55, currency_code: "usd" },
          ],
        },
      ])
    ).toEqual([
      {
        variant_id: "variant_seeded",
        product_id: "product_seeded",
        prices: [
          { id: "price_eur", amount: 1299, currency_code: "eur" },
          { id: "price_usd", amount: 1299, currency_code: "usd" },
          { amount: 1299, currency_code: "brl" },
        ],
      },
    ]);
  });

  it("does not update variants that already have a BRL price", () => {
    expect(
      buildBrlVariantPrices([
        {
          id: "variant_seeded",
          product_id: "product_seeded",
          sku: "256-BLUE",
          prices: [
            { id: "price_usd", amount: 1299, currency_code: "usd" },
            { id: "price_brl", amount: 1299, currency_code: "brl" },
          ],
        },
      ])
    ).toEqual([]);
  });
});
