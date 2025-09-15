import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import LanguageSelector from "./language-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Info, 
  Shield, 
  Apple, 
  Zap, 
  Stethoscope, 
  BookOpen, 
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  ClipboardCheck,
  Mail,
  MessageSquare,
  User,
  Settings,
  Bone
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ 
  activeSection, 
  onSectionChange
}: SidebarProps) {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["prevention"]);

  const pageNavigation = [
    { path: "/", title: t("nav.home", "Home"), icon: <Home className="w-4 h-4" /> },
    { path: "/resources", title: t("nav.resources", "Resources"), icon: <FileText className="w-4 h-4" /> },
    { path: "/assessment", title: t("nav.assessment", "Assessment"), icon: <ClipboardCheck className="w-4 h-4" /> },
    { path: "/feedback", title: t("nav.feedback", "Feedback"), icon: <MessageSquare className="w-4 h-4" /> },
    { path: "/about", title: t("nav.about", "About"), icon: <User className="w-4 h-4" /> },
    { path: "/contact", title: t("nav.contact", "Contact"), icon: <Mail className="w-4 h-4" /> },
  ];

  const adminNavigation = [
    { path: "/admin/translations", title: "Translation Admin", icon: <Settings className="w-4 h-4" /> },
  ];

  const navigationSections = [
    {
      id: "overview",
      title: t("nav.overview", "Overview"),
      icon: <Info className="w-5 h-5" />,
      items: [
        { id: "what-is-osteoporosis", title: t("nav.whatIs", "What is Osteoporosis?") },
        { id: "risk-factors", title: t("nav.riskFactors", "Risk Factors") },
        { id: "cultural-considerations", title: t("nav.cultural", "Cultural Considerations") }
      ]
    },
    {
      id: "prevention",
      title: t("nav.prevention", "Prevention"),
      icon: <Shield className="w-5 h-5" />,
      items: [
        { id: "early-detection", title: t("nav.earlyDetection", "Early Detection") },
        { id: "lifestyle-changes", title: t("nav.lifestyleChanges", "Lifestyle Changes") },
        { id: "risk-assessment", title: t("nav.riskAssessment", "Risk Assessment") }
      ]
    },
    {
      id: "nutrition",
      title: t("nav.nutrition", "Nutrition"),
      icon: <Apple className="w-5 h-5" />,
      items: [
        { id: "calcium-vitamin-d", title: t("nav.calciumVitaminD", "Calcium & Vitamin D") },
        { id: "asian-diet", title: t("nav.asianDiet", "Asian Diet Guidelines") },
        { id: "supplements", title: t("nav.supplements", "Supplements") }
      ]
    },
    {
      id: "exercise",
      title: t("nav.exercise", "Exercise"),
      icon: <Zap className="w-5 h-5" />,
      items: [
        { id: "weight-bearing", title: t("nav.weightBearing", "Weight-bearing Exercises") },
        { id: "balance-flexibility", title: t("nav.balance", "Balance & Flexibility") },
        { id: "safe-exercise", title: t("nav.safeExercise", "Safe Exercise Tips") }
      ]
    },
    {
      id: "treatment",
      title: t("nav.treatment", "Treatment"),
      icon: <Stethoscope className="w-5 h-5" />,
      items: [
        { id: "medications", title: t("nav.medications", "Medications") },
        { id: "therapy-options", title: t("nav.therapy", "Therapy Options") },
        { id: "managing-fractures", title: t("nav.managingFractures", "Managing Fractures") }
      ]
    },
    {
      id: "resources",
      title: t("nav.resources", "Resources"),
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        { id: "find-doctor", title: t("nav.findDoctor", "Find a Doctor") },
        { id: "support-groups", title: t("nav.supportGroups", "Support Groups") },
        { id: "educational-materials", title: t("nav.educational", "Educational Materials") }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-background/95 backdrop-blur-xl border-r border-border sidebar-transition z-50 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Bone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                StrongHer
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("sidebar.subtitle", "Bone Health Resources")}
              </p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="mt-6">
            <LanguageSelector />
          </div>
        </div>

        {/* Page Navigation */}
        <div className="px-4 py-4 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t("nav.pages", "Navigation")}
          </h3>
          <div className="space-y-1">
            {pageNavigation.map((page) => (
              <Link key={page.path} href={page.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location === page.path 
                      ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {page.icon}
                    <span>{page.title}</span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {t("nav.contentSections", "Content Sections")}
            </h3>
            <div className="space-y-1">
              {navigationSections.map((section) => (
                <div key={section.id} className="nav-section">
                  <Button
                    variant="ghost"
                    className={`w-full justify-between p-3 text-left text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeSection === section.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-4 h-4 opacity-60" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-60" />
                    )}
                  </Button>
                  
                  {expandedSections.includes(section.id) && (
                    <div className="ml-8 mt-2 space-y-1 animate-slide-up">
                      {section.items.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                            activeSection === item.id 
                              ? 'text-primary bg-primary/5 border-l-2 border-primary' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                          }`}
                          onClick={() => onSectionChange(item.id)}
                        >
                          {item.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Admin Navigation */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t("nav.admin", "Admin")}
          </h3>
          <div className="space-y-1">
            {adminNavigation.map((page) => (
              <Link key={page.path} href={page.path}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    location === page.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {page.icon}
                    <span>{page.title}</span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              {t("sidebar.disclaimer", "This information is for educational purposes only and should not replace professional medical advice.")}
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                {t("sidebar.privacy", "Privacy")}
              </button>
              <button className="hover:text-foreground transition-colors">
                {t("sidebar.terms", "Terms")}
              </button>
              <button className="hover:text-foreground transition-colors">
                {t("sidebar.contact", "Contact")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}