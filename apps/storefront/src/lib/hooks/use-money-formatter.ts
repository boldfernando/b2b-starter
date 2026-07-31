import { convertToLocale, ConvertToLocaleParams } from "@/lib/util/money"
import { useLocale } from "next-intl"

type LocalizedMoneyParams = Omit<ConvertToLocaleParams, "locale">

export const useMoneyFormatter = () => {
  const locale = useLocale()

  return (params: LocalizedMoneyParams) =>
    convertToLocale({
      ...params,
      locale,
    })
}
