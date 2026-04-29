export const translations = {
  en: {
    navbar: {
      home: "Home",
      pricing: "Pricing",
      about: "About",
      contact: "Contact",
      getStarted: "Get Started",
    },
    hero: {
      badge: "Now with GPT-5 support ✨",
      headline: "The Future of Smarter Automation",
      italicWord: "Smarter",
      subheadline: "Automate your busywork with intelligent agents that learn, adapt, and execute—so your team can focus on what matters most.",
      cta: "Book a demo",
    },
  },
  hi: {
    navbar: {
      home: "मुख्य पृष्ठ",
      pricing: "कीमतें",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      getStarted: "शुरू करें",
    },
    hero: {
      badge: "अब GPT-5 समर्थन के साथ ✨",
      headline: "होशियार स्वचालन का भविष्य",
      italicWord: "होशियार",
      subheadline: "बुद्धिमान एजेंटों के साथ अपने व्यस्त कार्य को स्वचालित करें जो सीखते हैं, अनुकूलित होते हैं और निष्पादित करते हैं—ताकि आपकी टीम सबसे महत्वपूर्ण चीज़ों पर ध्यान केंद्रित कर सके।",
      cta: "डेमो बुक करें",
    },
  },
};

export type Language = 'en' | 'hi';
export type TranslationKeys = typeof translations.en;
