import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Phone, MessageCircle, Heart, MapPin, Clock, ExternalLink } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";

export default function Contact() {
  const { t } = useLanguage();

  const contactMethods = [
    {
      title: t("contact.email", "Email"),
      description: t("contact.emailDesc", "Get in touch for general inquiries"),
      icon: <Mail className="w-5 h-5" />,
      value: "info@bonehealthasianwomen.org",
      action: t("contact.sendEmail", "Send Email")
    },
    {
      title: t("contact.whatsapp", "WhatsApp"),
      description: t("contact.whatsappDesc", "Quick support and questions"),
      icon: <MessageCircle className="w-5 h-5" />,
      value: "+44 7XXX XXXXXX",
      action: t("contact.openWhatsApp", "Open WhatsApp")
    },
    {
      title: t("contact.phone", "Phone"),
      description: t("contact.phoneDesc", "Speak with our support team"),
      icon: <Phone className="w-5 h-5" />,
      value: "+44 20 XXXX XXXX",
      action: t("contact.call", "Call Now")
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
            {t("contact.title", "Contact & Support")}
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            {t("contact.subtitle", "Get in touch with our team for support, questions, or to learn more about our mission to improve bone health awareness.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-neutral-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-neutral-800 mb-3">{method.value}</p>
                    <Button className="w-full" variant="outline">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("contact.officeHours", "Office Hours & Location")}
                </CardTitle>
                <CardDescription>
                  {t("contact.officeDesc", "When to reach us and where we're based")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 mt-1 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-2">
                        {t("contact.hours", "Support Hours")}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {t("contact.weekdays", "Monday - Friday: 9:00 AM - 5:00 PM GMT")}<br />
                        {t("contact.weekends", "Saturday - Sunday: Closed")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 mt-1 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-neutral-800 mb-2">
                        {t("contact.location", "Based in")}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {t("contact.address", "United Kingdom")}<br />
                        {t("contact.serving", "Serving communities worldwide")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-800">
                    {t("contact.support", "Support Our Mission")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-4">
                  {t("contact.donationDesc", "Help us continue providing free bone health resources and awareness programs for Asian women worldwide.")}
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Heart className="w-4 h-4 mr-2" />
                  {t("contact.donate", "Make a Donation")}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">
                  {t("contact.partnerships", "Partnerships")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 mb-4">
                  {t("contact.partnerDesc", "We work with healthcare organizations, community groups, and medical professionals to expand our reach.")}
                </p>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700">
                  {t("contact.partner", "Partner With Us")}
                </Button>
              </CardContent>
            </Card>

            <Alert className="border-amber-200 bg-amber-50">
              <AlertDescription className="text-amber-700">
                <strong>{t("contact.emergencyNote", "Medical Emergency:")}</strong>{" "}
                {t("contact.emergencyText", "For urgent medical concerns, please contact your healthcare provider or emergency services immediately.")}
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-neutral-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                {t("contact.attribution", "Acknowledgments")}
              </h3>
              <p className="text-neutral-600 mb-4">
                {t("contact.rosCredit", "Risk assessment tools provided by the Royal Osteoporosis Society (ROS), the UK's national charity dedicated to improving bone and muscle health.")}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("contact.visitROS", "Visit ROS")}
                </Button>
                <Badge variant="secondary">{t("contact.endorsedBy", "Endorsed by ROS")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}