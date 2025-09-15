import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LanguageSelector from "./language-selector";

interface MobileHeaderProps {
  onMenuClick: () => void;
  title: string;
}

export default function MobileHeader({ onMenuClick, title }: MobileHeaderProps) {
  return (
    <div className="lg:hidden bg-white border-b border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-neutral-100"
          >
            <Menu className="w-6 h-6 text-neutral-600" />
          </Button>
          <h1 className="text-lg font-semibold text-neutral-800">{title}</h1>
        </div>
        <div className="w-20">
          <LanguageSelector compact />
        </div>
      </div>
    </div>
  );
}
