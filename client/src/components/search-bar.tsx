import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { Resource } from "@shared/schema";

interface SearchBarProps {
  resources?: Resource[];
}

export default function SearchBar({ resources = [] }: SearchBarProps) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Resource[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      setIsSearching(true);
      const filtered = resources.filter((resource: Resource) => {
        const title = typeof resource.title === 'object' && resource.title && 'en' in resource.title ? (resource.title as any).en : String(resource.title);
        const description = typeof resource.description === 'object' && resource.description && 'en' in resource.description ? (resource.description as any).en : String(resource.description);
        return title?.toLowerCase().includes(value.toLowerCase()) || 
               description?.toLowerCase().includes(value.toLowerCase());
      });
      setResults(filtered);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [value, resources]);
  
  const { t, loading } = useLanguage();
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShowResults(value.length > 0 && (results.length > 0 || !isSearching));
  }, [value, results, isSearching]);

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder={loading ? "Loading..." : t("search.placeholder", "Search resources...")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          disabled={loading}
        />
        {isSearching ? (
          <Loader2 className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 animate-spin" />
        ) : (
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
        )}
      </div>

      {showResults && value.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-neutral-500 mb-2 px-2">
                {t("search.results", `${results.length} results found`)}
              </p>
              {results.map((result) => (
                <Button
                  key={result.id}
                  variant="ghost"
                  className="w-full justify-start p-2 text-sm hover:bg-neutral-50 rounded-md"
                  onClick={() => {
                    // Handle result click
                    console.log("Selected resource:", result);
                  }}
                >
                  <div className="text-left">
                    <p className="font-medium text-neutral-800 truncate">
                      {typeof result.title === 'object' && result.title && 'en' in result.title ? (result.title as any).en : String(result.title)}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {typeof result.description === 'object' && result.description && 'en' in result.description ? (result.description as any).en : String(result.description)}
                    </p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-neutral-500 text-sm">
              {t("search.noResults", "No results found")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
