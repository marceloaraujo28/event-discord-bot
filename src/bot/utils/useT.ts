import i18next from "i18next";

export function useT(language: string | null) {
  if (!language) {
    language = "pt-BR";
  }
  return (key: string, options = {}) => i18next.t(key, { lng: language, ...options });
}
