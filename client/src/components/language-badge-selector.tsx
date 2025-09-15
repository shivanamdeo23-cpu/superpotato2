import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageBadgeSelector() {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-blue-100" />
        <span className="text-sm text-blue-100 font-medium">Available in:</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {languages.map((lang) => (
          <div key={lang.code} className="flex flex-col items-center">
            <Button
              onClick={() => setLanguage(lang.code)}
              variant={language === lang.code ? "default" : "outline"}
              size="sm"
              className={`
                px-3 py-1 text-xs font-medium lang-script transition-all
                ${language === lang.code 
                  ? 'bg-white text-blue-600 hover:bg-neutral-100' 
                  : 'bg-transparent border-blue-200 text-blue-100 hover:bg-white/20 hover:border-white'
                }
              `}
            >
              {lang.nativeName}
            </Button>
            <span className="text-xs text-blue-200 mt-1 opacity-75">
              {lang.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}