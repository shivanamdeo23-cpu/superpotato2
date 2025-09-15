import { useLanguage } from "@/hooks/use-language";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  compact?: boolean;
}

export default function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={`lang-script ${compact ? 'text-sm' : 'w-full'}`}>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="lang-script">
            {compact ? lang.code.toUpperCase() : lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
