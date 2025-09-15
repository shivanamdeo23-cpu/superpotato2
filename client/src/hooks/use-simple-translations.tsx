import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

interface SimpleTranslation {
  [key: string]: string | SimpleTranslation;
}

interface SimpleTranslationsContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  translations: { [lang: string]: SimpleTranslation };
  loading: boolean;
}

const SimpleTranslationsContext = createContext<SimpleTranslationsContextType | undefined>(undefined);

export function SimpleTranslationsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<{ [lang: string]: SimpleTranslation }>({});
  const [loading, setLoading] = useState(true);

  const supportedLanguages = ['en', 'hi'];

  // Load translations from JSON files
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationData: { [lang: string]: SimpleTranslation } = {};
        
        // Load each language file
        for (const lang of supportedLanguages) {
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

    // Initialize language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: string) => {
    if (supportedLanguages.includes(newLanguage)) {
      setLanguageState(newLanguage);
      localStorage.setItem('preferred-language', newLanguage);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    // Navigate through nested object
    for (const k of keys) {
      if (translation && typeof translation === 'object' && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English
        translation = translations['en'];
        for (const k of keys) {
          if (translation && typeof translation === 'object' && translation[k]) {
            translation = translation[k];
          } else {
            return fallback || key;
          }
        }
        return typeof translation === 'string' ? translation : (fallback || key);
      }
    }
    
    return typeof translation === 'string' ? translation : (fallback || key);
  };

  return (
    <SimpleTranslationsContext.Provider value={{
      language,
      setLanguage,
      t,
      translations,
      loading
    }}>
      {children}
    </SimpleTranslationsContext.Provider>
  );
}

export function useSimpleTranslations() {
  const context = useContext(SimpleTranslationsContext);
  if (context === undefined) {
    throw new Error('useSimpleTranslations must be used within a SimpleTranslationsProvider');
  }
  return context;
}