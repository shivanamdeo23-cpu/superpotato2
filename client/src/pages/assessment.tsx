import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";

export default function Assessment() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const assessmentSteps = [
    {
      title: t("assessment.step1", "Personal Information"),
      description: t("assessment.step1Desc", "Age, ethnicity, and basic health information"),
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: t("assessment.step2", "Medical History"),
      description: t("assessment.step2Desc", "Previous fractures and family history"),
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: t("assessment.step3", "Lifestyle Factors"),
      description: t("assessment.step3Desc", "Diet, exercise, and daily habits"),
      icon: <AlertTriangle className="w-5 h-5" />
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
            {t("assessment.title", "Bone Health Risk Assessment")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t("assessment.subtitle", "Take our comprehensive assessment to understand your bone health risk factors and receive personalized recommendations.")}
          </p>
        </div>

        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            <strong>{t("assessment.disclaimer", "Medical Disclaimer:")}</strong>{" "}
            {t("assessment.disclaimerText", "This assessment is for educational purposes only and does not replace professional medical advice. Please consult with your healthcare provider for proper diagnosis and treatment.")}
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {t("assessment.quickStart", "Quick Assessment")}
                    </CardTitle>
                    <CardDescription>
                      {t("assessment.quickDesc", "Complete in 5-10 minutes")}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{t("assessment.free", "Free")}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {assessmentSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-neutral-200">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStep ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-400'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-800">{step.title}</h4>
                        <p className="text-sm text-neutral-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    {t("assessment.externalOption", "Professional Assessment Available")}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-4">
                    {t("assessment.externalDesc", "For a comprehensive clinical assessment, use the Royal Osteoporosis Society's validated risk checker.")}
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open('https://theros.org.uk/risk-checker/?campaign=77a866ee-c708-ed11-82e5-0022481b5a28', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("assessment.takeExternal", "Take Professional Assessment")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">
                  {t("assessment.whatYouGet", "What You'll Get")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("assessment.personalizedRisk", "Personalized risk score")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("assessment.recommendations", "Tailored recommendations")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("assessment.actionPlan", "Action plan for prevention")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("assessment.resources", "Educational resources")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  {t("assessment.needHelp", "Need Help?")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 mb-4">
                  {t("assessment.helpDesc", "Our assessment is designed to be easy to understand. If you need assistance, contact our support team.")}
                </p>
                <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700">
                  {t("assessment.getHelp", "Get Help")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}