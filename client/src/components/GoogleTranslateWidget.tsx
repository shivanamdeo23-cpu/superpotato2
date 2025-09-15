import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, X } from "lucide-react";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (options: any, element: string) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslateWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Translate script is already loaded
    if (window.google?.translate) {
      setIsLoaded(true);
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;

    // Define the callback function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,bn,pa,ta,te,ur,en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
        setIsLoaded(true);
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  const toggleWidget = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleWidget}
          className="bg-background shadow-md border border-gray-300 hover:bg-blue-50 text-xs px-3 py-2 h-auto"
          title="Google Translate - Complete Page Translation"
        >
          <Globe className="w-3 h-3 mr-1.5" />
          Translate
        </Button>
        
        {/* Quick Hindi Button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement) {
              selectElement.value = 'hi';
              selectElement.dispatchEvent(new Event('change'));
            } else {
              setIsVisible(true);
            }
          }}
          className="bg-green-600 hover:bg-green-700 shadow-md text-white text-xs px-3 py-2 h-auto"
          title="Quick translate to Hindi"
        >
          हिन्दी
        </Button>
      </div>

      {/* Translation Widget */}
      {isVisible && (
        <Card className="fixed bottom-20 right-4 z-50 w-72 shadow-lg border border-gray-200">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-green-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Globe className="w-3 h-3" />
                  Page Translation
                </CardTitle>
                <CardDescription className="text-xs">
                  Translate all text instantly
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-5 w-5 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            {isLoaded ? (
              <div>
                <div id="google_translate_element"></div>
                
                {/* Quick Action Buttons */}
                <div className="flex gap-1.5 mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                      if (selectElement) {
                        selectElement.value = 'hi';
                        selectElement.dispatchEvent(new Event('change'));
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto"
                  >
                    हिन्दी
                  </Button>
                  <Button
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                      if (selectElement) {
                        selectElement.value = 'en';
                        selectElement.dispatchEvent(new Event('change'));
                      }
                    }}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    English
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 bg-blue-50 p-2 rounded text-center">
                  Translates all page content instantly
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center p-3">
                <div className="text-xs text-muted-foreground">Loading...</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* CSS Overrides for Google Translate Widget */}
      <style>{`
        /* Hide Google Translate banner */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        /* Style the translate element */
        #google_translate_element .goog-te-gadget {
          font-family: inherit;
        }
        
        #google_translate_element .goog-te-gadget-simple {
          background-color: transparent;
          border: 1px solid hsl(var(--border));
          border-radius: 6px;
          padding: 6px;
          font-size: 13px;
        }
        
        #google_translate_element .goog-te-gadget-simple .goog-te-menu-value {
          color: hsl(var(--foreground));
        }
        
        #google_translate_element .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          color: hsl(var(--muted-foreground));
        }
        
        /* Fix body margin when Google Translate is active */
        body {
          top: 0 !important;
        }
        
        /* Hide Google branding */
        .goog-te-gadget-simple .goog-te-menu-value span:last-child {
          display: none;
        }
        
        .goog-logo-link {
          display: none !important;
        }
        
        .goog-te-gadget {
          color: transparent !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          margin: 0;
        }
      `}</style>
    </>
  );
}