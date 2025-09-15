import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

import { useSearch } from "@/hooks/use-search";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/hooks/use-language";
import type { Resource, HealthcareProvider } from "@shared/schema";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import SearchBar from "@/components/search-bar";
import LanguageToggle from "@/components/language-toggle";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Heart, 
  CheckCircle, 
  Clock, 
  Users, 
  Calendar, 
  BookOpen, 
  AlertTriangle, 
  Hospital, 
  Shield, 
  Download, 
  Dumbbell, 
  Target, 
  Star, 
  TrendingUp, 
  Bone, 
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Globe,
  PlayCircle,
  Info,
  Apple,
  Stethoscope,
  FileText,
  ClipboardCheck,
  MessageSquare,
  User,
  Mail
} from "lucide-react";

export default function Home() {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const { t, loading } = useLanguage();

  const [activeSection, setActiveSection] = useState("prevention");
  const [activeTab, setActiveTab] = useState("strongher");

  const { data: contentSections = [] } = useQuery({
    queryKey: ["/api/content-sections"],
  });

  const { data: resources = [] } = useQuery<Resource[]>({
    queryKey: ["/api/resources"],
  });

  const { data: healthcareProviders = [] } = useQuery<HealthcareProvider[]>({
    queryKey: ["/api/healthcare-providers", "en"],
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      
      {/* Search Bar with Language Toggle */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <SearchBar resources={resources} />
          </div>
          <div className="ml-4">
            <LanguageToggle />
          </div>
        </div>
      </div>


      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        

        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center animate-slide-up">
            <div className="flex justify-center mb-6">
              <Badge className="gradient-primary text-primary-foreground px-4 py-2 text-sm font-medium animate-pulse-slow">
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : t("hero.badge", "Fracture-Free Futures for Women")}
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-gradient">{loading ? "Loading..." : t("hero.brand", "StrongHer")}</span>
              <br />
              <span className="text-foreground/80">{loading ? "Loading..." : t("hero.focus", "Bone Health")}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              {loading ? "Loading..." : t("hero.subtitle", "Comprehensive bone health resources designed specifically for women")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="gradient-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
                onClick={() => window.open("https://theros.org.uk/risk-checker/?campaign=77a866ee-c708-ed11-82e5-0022481b5a28", "_blank")}
              >
                <Zap className="w-5 h-5 mr-2" />
                {loading ? "Loading..." : t("hero.riskAssessment", "Take Risk Assessment")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-2"
                onClick={() => setLocation("/about")}
              >
                <Info className="w-5 h-5 mr-2" />
                {loading ? "Loading..." : t("hero.learnMore", "Learn More")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Evidence Section - PROMINENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <FileText className="w-8 h-8 text-blue-600" />
              {loading ? "Loading..." : t("evidence.title", "Clinical Research Evidence")}
            </CardTitle>
            <CardDescription className="text-lg text-blue-700">
              {loading ? "Loading..." : t("evidence.subtitle", "Scientific evidence supporting osteoporosis risk in women")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/70 rounded-lg p-6 border border-blue-100">
              <p className="text-foreground leading-relaxed text-lg mb-4">
                {loading ? "Loading..." : t("evidence.description", "Osteoporosis Risk: Asian women generally have lower bone mineral density (BMD) than other groups, placing them at higher risk for developing osteoporosis. This prevalence is higher, particularly among postmenopausal women.")}
              </p>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 p-4 rounded-r">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  <strong>{loading ? "Loading..." : t("evidence.source", "Source:")} </strong>
                </p>
                <p className="text-sm text-blue-700">
                  {loading ? "Loading..." : t("evidence.citation", "Lo JC, Pressman AR, et al. Osteoporosis and fractures in large American Asian adults. Curr Osteoporos Rep. 2023;21(4):374-383. PubMed PMID: 37542683")}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-lg p-4 text-center border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">2x</div>
                <div className="text-sm text-blue-700 font-medium">Higher Risk</div>
                <div className="text-xs text-blue-600 mt-1">vs other ethnicities</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">45+</div>
                <div className="text-sm text-blue-700 font-medium">Screening Age</div>
                <div className="text-xs text-blue-600 mt-1">Earlier than general population</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4 text-center border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <div className="text-sm text-blue-700 font-medium">Preventable</div>
                <div className="text-xs text-blue-600 mt-1">with early intervention</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Streamlined */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {loading ? "Loading..." : t("quickActions.title", "Take Action Today")}
            </h2>
            <p className="text-lg text-gray-600">
              {loading ? "Loading..." : t("quickActions.subtitle", "Essential steps for better bone health")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: loading ? "Loading..." : t("quickActions.riskTitle", "Risk Assessment"),
                description: loading ? "Loading..." : t("quickActions.riskDesc", "Free online evaluation"),
                action: () => window.open("https://theros.org.uk/risk-checker/?campaign=77a866ee-c708-ed11-82e5-0022481b5a28", "_blank")
              },
              {
                icon: "📅",
                title: loading ? "Loading..." : t("quickActions.screeningTitle", "Schedule Screening"),
                description: loading ? "Loading..." : t("quickActions.screeningDesc", "Book DEXA scan appointment"),
                action: () => window.open("https://www.nhs.uk/tests-and-treatments/dexa-scan/", "_blank")
              },
              {
                icon: "📚",
                title: loading ? "Loading..." : t("quickActions.learnTitle", "Learn More"),
                description: loading ? "Loading..." : t("quickActions.learnDesc", "Access educational materials"),
                action: () => setLocation("/resources")
              }
            ].map((action, index) => (
              <div 
                key={index} 
                onClick={action.action}
                className="bg-white/80 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer border border-white/60 group"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-200">
                  {loading ? "Loading..." : t("quickActions.getStarted", "Get Started")}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>





      {/* Footer */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bone className="w-8 h-8 text-primary mr-3" />
              <span className="text-2xl font-bold text-gradient">StrongHer</span>
            </div>
            <p className="text-muted-foreground mb-6">
              {loading ? "Loading..." : t("footer.tagline", "Building fracture-free futures for women through education and early intervention")}
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>{loading ? "Loading..." : t("footer.toolProvider", "Risk assessment tool provided by")}</strong>
              </p>
              <p className="mb-1">
                <strong>{loading ? "Loading..." : t("footer.ros", "Royal Osteoporosis Society (ROS)")}</strong>
              </p>
              <p className="mb-4">{loading ? "Loading..." : t("footer.rosDesc", "UK's national charity dedicated to improving bone and muscle health")}</p>
              
              {/* Copyright */}
              <div className="border-t border-muted-foreground/20 pt-4 mt-6">
                <p className="text-xs text-muted-foreground/80">
                  {loading ? "Loading..." : t("footer.copyright", "© 2025 Shiva Namdeo. All rights reserved.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}