import { useLanguage } from "@/hooks/use-language";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

export default function QuickLanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", flag: "🇺🇸", name: "English", label: "EN" },
    { code: "hi", flag: "🇮🇳", name: "हिन्दी", label: "HI" },
    { code: "bn", flag: "🇧🇩", name: "বাংলা", label: "BN" },
    { code: "pa", flag: "🇮🇳", name: "ਪੰਜਾਬੀ", label: "PA" },
    { code: "ta", flag: "🇮🇳", name: "தமிழ்", label: "TA" },
    { code: "te", flag: "🇮🇳", name: "తెలుగు", label: "TE" },
    { code: "ur", flag: "🇵🇰", name: "اردو", label: "UR" }
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto min-w-[70px] h-8 px-2 text-xs font-medium border-0 bg-transparent hover:bg-gray-100 transition-colors duration-200 rounded-lg">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currentLang.flag}</span>
          <span className="font-semibold text-gray-700">{currentLang.label}</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 shadow-xl rounded-lg p-1 min-w-[160px]">
        {languages.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-xs"
          >
            <span className="text-sm">{lang.flag}</span>
            <span className="font-medium text-gray-800">{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}