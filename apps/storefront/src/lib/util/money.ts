import { defaultLocale } from "@/i18n/config"
import { isEmpty } from "@/lib/util/isEmpty"

export type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) => {
  const resolvedLocale = locale ?? defaultLocale

  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(resolvedLocale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}
