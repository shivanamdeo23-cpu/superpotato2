import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp, AlertCircle } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";

export default function Feedback() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const feedbackTypes = [
    { value: "general", label: t("feedback.general", "General Feedback") },
    { value: "bug", label: t("feedback.bug", "Report a Bug") },
    { value: "feature", label: t("feedback.feature", "Feature Request") },
    { value: "content", label: t("feedback.content", "Content Suggestion") },
    { value: "translation", label: t("feedback.translation", "Translation Issue") }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-neutral-50 flex items-center justify-center">
        <Card className="max-w-lg mx-auto border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              {t("feedback.thankYou", "Thank You!")}
            </h2>
            <p className="text-green-700 mb-6">
              {t("feedback.submitted", "Your feedback has been submitted successfully. We appreciate you helping us improve our resources for the community.")}
            </p>
            <Button 
              onClick={() => setSubmitted(false)} 
              className="bg-green-600 hover:bg-green-700"
            >
              {t("feedback.submitAnother", "Submit Another Feedback")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {t("feedback.title", "Your Feedback Matters")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t("feedback.subtitle", "Help us improve our bone health resources and make them more valuable for the Asian women's community. Your input drives our improvements.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("feedback.shareExperience", "Share Your Experience")}
                </CardTitle>
                <CardDescription>
                  {t("feedback.formDesc", "All feedback is anonymous and helps us serve the community better")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="feedback-type">
                      {t("feedback.type", "Feedback Type")}
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={t("feedback.selectType", "Select feedback type...")} />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">
                      {t("feedback.rating", "Overall Rating")}
                    </Label>
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 ${
                            star <= rating ? 'text-yellow-500' : 'text-neutral-300'
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-neutral-600">
                        {rating > 0 && `${rating}/5`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">
                      {t("feedback.subject", "Subject")}
                    </Label>
                    <Input 
                      id="subject"
                      placeholder={t("feedback.subjectPlaceholder", "Brief description of your feedback...")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">
                      {t("feedback.message", "Your Feedback")}
                    </Label>
                    <Textarea 
                      id="message"
                      placeholder={t("feedback.messagePlaceholder", "Please share your detailed feedback, suggestions, or report any issues you've encountered...")}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm">
                      {t("feedback.email", "Email (Optional)")}
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder={t("feedback.emailPlaceholder", "your@email.com")}
                      className="mt-1"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {t("feedback.emailNote", "Only provide if you'd like a response to your feedback")}
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    {t("feedback.submit", "Submit Feedback")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-blue-800">
                    {t("feedback.howWeUse", "How We Use Your Feedback")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("feedback.improve", "Improve existing content")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("feedback.develop", "Develop new resources")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("feedback.fix", "Fix technical issues")}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("feedback.enhance", "Enhance user experience")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-green-800">
                    {t("feedback.recent", "Recent Improvements")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>{t("feedback.improvement1", "Added more cultural dietary examples")}</li>
                  <li>{t("feedback.improvement2", "Improved translation accuracy")}</li>
                  <li>{t("feedback.improvement3", "Enhanced mobile accessibility")}</li>
                  <li>{t("feedback.improvement4", "Expanded exercise recommendations")}</li>
                </ul>
              </CardContent>
            </Card>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                <strong>{t("feedback.privacy", "Privacy Notice:")}</strong>{" "}
                {t("feedback.privacyText", "Your feedback is treated confidentially and used solely for improving our services. We do not share personal information with third parties.")}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}