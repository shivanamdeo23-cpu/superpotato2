import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import Home from "@/pages/home";
import Resources from "@/pages/resources";
import Assessment from "@/pages/assessment";
import Contact from "@/pages/contact";
import Feedback from "@/pages/feedback";
import About from "@/pages/about";
import AdminDashboard from "@/pages/AdminDashboard";
import TranslationKeyForm from "@/pages/TranslationKeyForm";
import TranslationImport from "@/pages/TranslationImport";
import SimpleTranslationsDemo from "@/pages/simple-translations-demo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resources" component={Resources} />
      <Route path="/assessment" component={Assessment} />
      <Route path="/contact" component={Contact} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/about" component={About} />
      
      {/* Demo Routes */}
      <Route path="/demo/simple-translations" component={SimpleTranslationsDemo} />
      
      {/* Admin Routes */}
      <Route path="/admin/translations" component={AdminDashboard} />
      <Route path="/admin/translations/keys/:id" component={TranslationKeyForm} />
      <Route path="/admin/translations/import" component={TranslationImport} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
