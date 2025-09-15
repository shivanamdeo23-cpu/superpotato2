import { Button } from "@/components/ui/button";
import { useSimpleTranslations } from "@/hooks/use-simple-translations";

export function SimpleLanguageSwitcher() {
  const { language, setLanguage, t } = useSimpleTranslations();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="text-sm"
        >
          {lang.nativeName}
        </Button>
      ))}
    </div>
  );
}

// Example component showing how to use simple translations
export function SimpleTranslationExample() {
  const { t, loading } = useSimpleTranslations();

  if (loading) {
    return <div>Loading translations...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{t('hero.title', 'Early Detection Saves Lives')}</h1>
      <p className="text-lg text-muted-foreground">{t('hero.subtitle', 'Comprehensive bone health resources designed specifically for Asian women')}</p>
      
      <div className="flex gap-4">
        <Button>{t('hero.riskAssessment', 'Take Risk Assessment')}</Button>
        <Button variant="outline">{t('hero.findDoctor', 'Find a Doctor')}</Button>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">{t('alert.title', 'Important Health Notice')}</h3>
        <p className="text-yellow-700 mt-2">{t('alert.description', 'Asian women are at higher risk for osteoporosis...')}</p>
      </div>
    </div>
  );
}