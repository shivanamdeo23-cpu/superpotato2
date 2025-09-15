import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle } from "lucide-react";

interface RiskAssessmentProps {
  onClose: () => void;
}

export default function RiskAssessment({ onClose }: RiskAssessmentProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [results, setResults] = useState<any>(null);

  const questions = [
    {
      id: "age",
      type: "radio",
      question: t("assessment.age", "What is your age?"),
      options: [
        { value: "under40", label: t("assessment.under40", "Under 40"), score: 0 },
        { value: "40-50", label: t("assessment.40-50", "40-50"), score: 1 },
        { value: "50-60", label: t("assessment.50-60", "50-60"), score: 2 },
        { value: "over60", label: t("assessment.over60", "Over 60"), score: 3 }
      ]
    },
    {
      id: "ethnicity",
      type: "radio",
      question: t("assessment.ethnicity", "What is your ethnic background?"),
      options: [
        { value: "east-asian", label: t("assessment.eastAsian", "East Asian"), score: 2 },
        { value: "south-asian", label: t("assessment.southAsian", "South Asian"), score: 2 },
        { value: "southeast-asian", label: t("assessment.southeastAsian", "Southeast Asian"), score: 2 },
        { value: "other", label: t("assessment.other", "Other"), score: 1 }
      ]
    },
    {
      id: "menopause",
      type: "radio",
      question: t("assessment.menopause", "Have you gone through menopause?"),
      options: [
        { value: "no", label: t("assessment.no", "No"), score: 0 },
        { value: "early", label: t("assessment.earlyMenopause", "Yes, before age 45"), score: 3 },
        { value: "normal", label: t("assessment.normalMenopause", "Yes, after age 45"), score: 2 }
      ]
    },
    {
      id: "family-history",
      type: "checkbox",
      question: t("assessment.familyHistory", "Do you have a family history of osteoporosis or fractures?"),
      options: [
        { value: "mother", label: t("assessment.mother", "Mother"), score: 2 },
        { value: "father", label: t("assessment.father", "Father"), score: 1 },
        { value: "sibling", label: t("assessment.sibling", "Sibling"), score: 1 },
        { value: "grandparent", label: t("assessment.grandparent", "Grandparent"), score: 1 }
      ]
    },
    {
      id: "lifestyle",
      type: "checkbox",
      question: t("assessment.lifestyle", "Which of these apply to you?"),
      options: [
        { value: "smoking", label: t("assessment.smoking", "Current smoker"), score: 2 },
        { value: "alcohol", label: t("assessment.alcohol", "Drink alcohol regularly"), score: 1 },
        { value: "sedentary", label: t("assessment.sedentary", "Sedentary lifestyle"), score: 2 },
        { value: "low-calcium", label: t("assessment.lowCalcium", "Low calcium intake"), score: 2 }
      ]
    }
  ];

  const submitAssessment = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/risk-assessment", data);
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data);
      setCurrentStep(questions.length);
    },
  });

  const handleAnswer = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate risk score
      let totalScore = 0;
      questions.forEach(question => {
        const answer = responses[question.id];
        if (question.type === "radio") {
          const option = question.options.find(opt => opt.value === answer);
          if (option) totalScore += option.score;
        } else if (question.type === "checkbox" && Array.isArray(answer)) {
          answer.forEach(val => {
            const option = question.options.find(opt => opt.value === val);
            if (option) totalScore += option.score;
          });
        }
      });

      const sessionId = Math.random().toString(36).substr(2, 9);
      const recommendations = generateRecommendations(totalScore);

      submitAssessment.mutate({
        sessionId,
        responses,
        riskScore: totalScore,
        recommendations
      });
    }
  };

  const generateRecommendations = (score: number) => {
    if (score <= 3) {
      return [
        t("recommendations.low1", "Continue with regular exercise and calcium-rich diet"),
        t("recommendations.low2", "Consider bone density screening in 2-3 years"),
        t("recommendations.low3", "Maintain healthy lifestyle habits")
      ];
    } else if (score <= 7) {
      return [
        t("recommendations.moderate1", "Schedule bone density screening within 6 months"),
        t("recommendations.moderate2", "Increase calcium and vitamin D intake"),
        t("recommendations.moderate3", "Start weight-bearing exercise program"),
        t("recommendations.moderate4", "Consider consulting with healthcare provider")
      ];
    } else {
      return [
        t("recommendations.high1", "Schedule immediate consultation with healthcare provider"),
        t("recommendations.high2", "Get bone density screening as soon as possible"),
        t("recommendations.high3", "Consider medication evaluation"),
        t("recommendations.high4", "Implement comprehensive prevention strategy")
      ];
    }
  };

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: "Low", color: "text-green-600", bgColor: "bg-green-50" };
    if (score <= 7) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;
  const currentQuestion = questions[currentStep];
  const canProceed = responses[currentQuestion?.id] !== undefined;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-800">
            {results ? t("assessment.results", "Assessment Results") : t("assessment.title", "Bone Health Risk Assessment")}
          </DialogTitle>
        </DialogHeader>

        {!results ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>{t("assessment.progress", "Progress")}</span>
                <span>{currentStep + 1} of {questions.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {currentQuestion && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-neutral-800">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === "radio" ? (
                    <RadioGroup
                      value={responses[currentQuestion.id] || ""}
                      onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="text-sm text-neutral-700">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.value}
                            checked={(responses[currentQuestion.id] || []).includes(option.value)}
                            onCheckedChange={(checked) => {
                              const current = responses[currentQuestion.id] || [];
                              if (checked) {
                                handleAnswer(currentQuestion.id, [...current, option.value]);
                              } else {
                                handleAnswer(currentQuestion.id, current.filter((v: string) => v !== option.value));
                              }
                            }}
                          />
                          <Label htmlFor={option.value} className="text-sm text-neutral-700">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                {t("assessment.previous", "Previous")}
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed || submitAssessment.isPending}
              >
                {currentStep === questions.length - 1 
                  ? t("assessment.getResults", "Get Results")
                  : t("assessment.next", "Next")
                }
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${getRiskLevel(results.riskScore).bgColor}`}>
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className={`w-5 h-5 ${getRiskLevel(results.riskScore).color}`} />
                <h3 className={`text-lg font-semibold ${getRiskLevel(results.riskScore).color}`}>
                  {getRiskLevel(results.riskScore).level} {t("assessment.riskLevel", "Risk Level")}
                </h3>
              </div>
              <p className="text-sm text-neutral-700">
                {t("assessment.scoreText", `Your risk score is ${results.riskScore} out of ${questions.reduce((sum, q) => sum + q.options.reduce((osum, o) => osum + o.score, 0), 0)}`)}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-neutral-800">
                  {t("assessment.recommendations", "Recommendations")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-neutral-700">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                {t("assessment.close", "Close")}
              </Button>
              <Button onClick={() => {
                // Reset and retake
                setCurrentStep(0);
                setResponses({});
                setResults(null);
              }}>
                {t("assessment.retake", "Retake Assessment")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
