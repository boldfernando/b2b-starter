"use server"

import { localeCookieName, resolveLocale } from "@/i18n/config"
import "server-only"

import { cookies as nextCookies, headers as nextHeaders } from "next/headers"

export const getRequestLocale = async () => {
  const [cookies, headers] = await Promise.all([nextCookies(), nextHeaders()])

  return resolveLocale({
    cookieLocale: cookies.get(localeCookieName)?.value,
    countryCode: headers.get("x-store-country-code"),
    acceptLanguage: headers.get("accept-language"),
  })
}

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const cookies = await nextCookies()
    const token = cookies.get("_medusa_jwt")?.value
    const locale = await getRequestLocale()
    const headers = { "x-medusa-locale": locale }

    if (token) {
      return { ...headers, authorization: `Bearer ${token}` }
    }

    return headers
  } catch (error) {
    return {}
  }
}

export const getCacheTag = async (tag: string): Promise<string> => {
  try {
    const cookies = await nextCookies()
    const cacheId = cookies.get("_medusa_cache_id")?.value

    if (!cacheId) {
      return ""
    }

    const locale = await getRequestLocale()

    return `${tag}-${locale}-${cacheId}`
  } catch (error) {
    return ""
  }
}

export const getCacheOptions = async (
  tag: string
): Promise<{ tags: string[] } | {}> => {
  if (typeof window !== "undefined") {
    return {}
  }

  const cacheTag = await getCacheTag(tag)

  if (!cacheTag) {
    return {}
  }

  return { tags: [`${cacheTag}`] }
}

export const setAuthToken = async (token: string) => {
  const cookies = await nextCookies()

  cookies.set("_medusa_jwt", token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeAuthToken = async () => {
  const cookies = await nextCookies()

  cookies.delete("_medusa_jwt")
}

export const getCartId = async () => {
  const cookies = await nextCookies()

  return cookies.get("_medusa_cart_id")?.value
}

export const setCartId = async (cartId: string) => {
  const cookies = await nextCookies()

  cookies.set("_medusa_cart_id", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartId = async () => {
  const cookies = await nextCookies()

  cookies.set("_medusa_cart_id", "", {
    maxAge: -1,
  })
}
