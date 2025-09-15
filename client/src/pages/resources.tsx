import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Download, ExternalLink } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";

export default function Resources() {
  const { t } = useLanguage();

  const resources = [
    {
      title: t("resources.calciumGuide", "Calcium-Rich Foods Guide"),
      type: t("resources.typePDF", "PDF"),
      description: t("resources.calciumDesc", "Comprehensive guide to calcium-rich foods from Asian cuisine"),
      icon: <BookOpen className="w-5 h-5" />,
      category: t("resources.categoryNutrition", "Nutrition"),
      url: null
    },
    {
      title: t("resources.exerciseVideo", "Bone-Strengthening Exercises"),
      type: t("resources.typeVideo", "Video"),
      description: t("resources.exerciseDesc", "Safe exercises for improving bone density"),
      icon: <Video className="w-5 h-5" />,
      category: t("resources.categoryExercise", "Exercise"),
      url: null
    },
    {
      title: t("resources.preventionGuide", "Prevention Strategies"),
      type: t("resources.typeArticle", "Article"),
      description: t("resources.preventionDesc", "Evidence-based prevention methods for osteoporosis"),
      icon: <BookOpen className="w-5 h-5" />,
      category: t("resources.categoryPrevention", "Prevention"),
      url: null
    },
    {
      title: t("resources.noggGuide", "NOGG Patient Information Guide"),
      type: t("resources.typeExternal", "External"),
      description: t("resources.noggDesc", "UK National Osteoporosis Guideline Group's comprehensive patient guide with clinical information and treatment advice"),
      icon: <ExternalLink className="w-5 h-5" />,
      category: t("resources.categoryClinical", "Clinical Guidelines"),
      url: "https://www.nogg.org.uk/information-patients-and-public"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50">
      {/* Language Toggle */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-end">
          <LanguageToggle />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">
            {t("resources.title", "Educational Resources")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t("resources.subtitle", "Access comprehensive materials about bone health, prevention strategies, and culturally-appropriate guidance for Asian women.")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="border-neutral-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {resource.icon}
                    <Badge variant="secondary">{resource.type}</Badge>
                  </div>
                  <Badge variant="outline">{resource.category}</Badge>
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  {resource.url ? (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("resources.viewOnline", "View Online")}
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        {t("resources.download", "Download")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                {t("resources.moreResources", "Need More Resources?")}
              </h3>
              <p className="text-blue-700 mb-4">
                {t("resources.contactDesc", "Contact us for additional materials or specific guidance tailored to your needs.")}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                {t("resources.contact", "Contact Us")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}