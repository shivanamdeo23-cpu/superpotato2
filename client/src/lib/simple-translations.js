// Simple translation system using JSON files
class SimpleTranslations {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = ['en', 'hi'];
    
    // Initialize with browser language detection
    this.detectLanguage();
    this.loadTranslations();
  }

  // Detect user's preferred language
  detectLanguage() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      this.currentLanguage = browserLang;
    }
  }

  // Load translation files
  async loadTranslations() {
    try {
      // Load all supported language files
      for (const lang of this.supportedLanguages) {
        const response = await fetch(`/translations/${lang}.json`);
        if (response.ok) {
          this.translations[lang] = await response.json();
        }
      }
      
      // Apply translations to page
      this.translatePage();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  // Get translated text for a key
  t(key, fallback = '') {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    // Navigate through nested object
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English
        translation = this.translations['en'];
        for (const k of keys) {
          if (translation && translation[k]) {
            translation = translation[k];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return typeof translation === 'string' ? translation : (fallback || key);
  }

  // Switch language
  async setLanguage(language) {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
      localStorage.setItem('preferred-language', language);
      
      // Update page content
      this.translatePage();
      
      // Update language selector if it exists
      this.updateLanguageSelector();
    }
  }

  // Translate all elements with data-i18n attribute
  translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Handle different element types
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update document title if it has data-i18n
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n');
      document.title = this.t(key);
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLanguage;
  }

  // Update language selector UI
  updateLanguageSelector() {
    const languageButtons = document.querySelectorAll('[data-language]');
    
    languageButtons.forEach(button => {
      const lang = button.getAttribute('data-language');
      
      // Update active state
      if (lang === this.currentLanguage) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'true');
      } else {
        button.classList.remove('active');
        button.removeAttribute('aria-current');
      }
    });
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Get language name in native script
  getLanguageName(code) {
    const languageNames = {
      'en': 'English',
      'hi': 'हिंदी'
    };
    return languageNames[code] || code;
  }
}

// Create global instance
window.translations = new SimpleTranslations();

// Helper function for easy access
window.t = (key, fallback) => window.translations.t(key, fallback);

// Set up language switcher event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Language switcher buttons
  const languageButtons = document.querySelectorAll('[data-language]');
  languageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const language = button.getAttribute('data-language');
      window.translations.setLanguage(language);
    });
  });

  // Initial translation
  window.translations.translatePage();
});

export default SimpleTranslations;