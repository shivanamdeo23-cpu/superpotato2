import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback?: string) => string;
  languages: Language[];
  loading: boolean;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");
  const [translations, setTranslations] = useState<{ [lang: string]: any }>({});
  const [loading, setLoading] = useState(true);

  // Load translations from JSON files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationData: { [lang: string]: any } = {};
        
        // Load each language file
        for (const lang of languages.map(l => l.code)) {
          try {
            const response = await fetch(`/translations/${lang}.json`);
            if (response.ok) {
              translationData[lang] = await response.json();
            }
          } catch (error) {
            console.warn(`Failed to load ${lang} translations:`, error);
          }
        }
        
        setTranslations(translationData);
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage && languages.find(l => l.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0];
      const supportedLang = languages.find(l => l.code === browserLang);
      if (supportedLang) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (newLanguage: string) => {
    setLanguageState(newLanguage);
    localStorage.setItem("preferred-language", newLanguage);
  };

  const t = (key: string, fallback?: string): string => {
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, segment) => current?.[segment], obj);
    };

    const languageTranslations = translations[language];
    if (languageTranslations) {
      const value = getNestedValue(languageTranslations, key);
      if (value) return value;
    }
    
    // Fallback to English
    const englishTranslations = translations.en;
    if (englishTranslations) {
      const value = getNestedValue(englishTranslations, key);
      if (value) return value;
    }
    
    return fallback || key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    languages,
    loading
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}