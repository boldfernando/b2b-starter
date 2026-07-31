export type Messages = Record<string, unknown>

const isMessages = (value: unknown): value is Messages =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export const mergeMessages = (
  fallbackMessages: Messages,
  localizedMessages: Messages
): Messages => {
  const messages: Messages = { ...fallbackMessages }

  for (const [key, localizedValue] of Object.entries(localizedMessages)) {
    const fallbackValue = fallbackMessages[key]

    messages[key] =
      isMessages(fallbackValue) && isMessages(localizedValue)
        ? mergeMessages(fallbackValue, localizedValue)
        : localizedValue
  }

  return messages
}
