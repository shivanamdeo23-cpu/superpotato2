import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Globe, ChevronDown } from "lucide-react";

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  {
    code: 'hi',
    name: 'Hindi',
    flag: '🇮🇳',
    nativeName: 'हिन्दी'
  }
];

export default function FlagLanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-10 px-3 gap-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-all duration-200 shadow-sm"
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="font-medium text-sm">{currentLanguage.nativeName}</span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background/95 backdrop-blur-xl border-border/50 shadow-lg"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'en' | 'hi')}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
              language === lang.code 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted/50'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex-1">
              <div className="font-medium text-sm">{lang.nativeName}</div>
              <div className="text-xs text-muted-foreground">{lang.name}</div>
            </div>
            {language === lang.code && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {t("language.current", "Current")}
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}