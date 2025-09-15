import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage, languages } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 px-3 bg-white/80 backdrop-blur-sm border-white/60 shadow-sm hover:bg-white/90 transition-all duration-200"
        >
          <Globe className="h-4 w-4 mr-2 text-blue-600" />
          <span className="font-medium text-gray-900">
            {language === 'en' ? 'EN' : 'हिं'}
          </span>
          <ChevronDown className="h-3 w-3 ml-1 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-white/95 backdrop-blur-sm border-white/60 shadow-lg"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer transition-colors ${
              language === lang.code 
                ? 'bg-blue-50 text-blue-700 font-medium' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="flex-1">
              {lang.nativeName}
            </span>
            {language === lang.code && (
              <span className="text-blue-600 text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}