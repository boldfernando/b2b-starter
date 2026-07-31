import { listRegions } from "@/lib/data/regions"
import LoginTemplate from "@/modules/account/templates/login-template"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Account")

  return {
    title: t("signIn"),
    description: t("loginHeadline"),
  }
}

export default async function Login() {
  const regions = await listRegions()

  return <LoginTemplate regions={regions} />
}
