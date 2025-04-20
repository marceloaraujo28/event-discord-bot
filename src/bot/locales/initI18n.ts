import i18next from "i18next";

import enUS from "./en-US/translation";
import ptBR from "./pt-BR/translation";

export async function initI18n() {
  await i18next.init({
    lng: "pt-BR", // idioma padrão só pra fallback
    fallbackLng: "en",
    resources: {
      en: { translation: enUS },
      "pt-BR": { translation: ptBR },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}
