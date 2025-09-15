import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "./use-language";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { language } = useLanguage();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: ["/api/resources/search", { q: debouncedQuery, language }],
    enabled: debouncedQuery.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching: isSearching && debouncedQuery.length > 2,
  };
}
