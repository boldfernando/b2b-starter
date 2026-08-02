const storefrontUrl = new URL(
  process.env.STOREFRONT_URL ?? "http://localhost:8000"
)

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const request = async (pathname, headers = {}) => {
  const response = await fetch(new URL(pathname, storefrontUrl), {
    headers,
    redirect: "manual",
  })

  return {
    body: await response.text(),
    headers: response.headers,
    status: response.status,
  }
}

const assertHtmlLocale = (body, locale) => {
  assert(
    new RegExp(`<html[^>]*\\blang=["']${locale}["']`, "i").test(body),
    `Expected <html lang="${locale}">`
  )
}

const run = async () => {
  const initial = await request("/", {
    "accept-language": "en-US,en;q=0.9",
  })

  assert(initial.status === 307, `Expected / to redirect; got ${initial.status}`)
  assert(
    initial.headers.get("location") === "/br",
    `Expected the Brazilian market route /br; got ${initial.headers.get("location")}`
  )
  assert(
    /_medusa_locale=en-US/.test(initial.headers.get("set-cookie") ?? ""),
    "Expected Accept-Language to persist en-US without changing the /br market"
  )

  const ptBR = await request("/br", {
    cookie: "_medusa_cache_id=e2e; _medusa_locale=pt-BR",
  })
  assert(ptBR.status === 200, `Expected pt-BR /br response; got ${ptBR.status}`)
  assertHtmlLocale(ptBR.body, "pt-BR")
  assert(
    ptBR.body.includes("Comércio digital para equipes B2B modernas"),
    "Expected Brazilian Portuguese UI content"
  )
  assert(
    /R\$\s*[\d.]+,\d{2}/.test(ptBR.body),
    "Expected a BRL price with Brazilian punctuation"
  )

  const enUS = await request("/br", {
    cookie: "_medusa_cache_id=e2e; _medusa_locale=en-US",
  })
  assert(enUS.status === 200, `Expected en-US /br response; got ${enUS.status}`)
  assertHtmlLocale(enUS.body, "en-US")
  assert(
    enUS.body.includes("Commerce built for modern B2B teams"),
    "Expected English UI content while remaining in the Brazilian market"
  )
  assert(
    /R\$\s*[\d,]+\.\d{2}/.test(enUS.body),
    "Expected the same BRL currency with English punctuation"
  )

  console.log(
    "PASS locale/regional E2E: /br market, pt-BR and en-US presentation, and BRL formatting"
  )
}

run().catch((error) => {
  console.error(`FAIL locale/regional E2E: ${error.message}`)
  process.exitCode = 1
})
