import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Users, Award, BookOpen, Globe, Mail } from "lucide-react";
import LanguageToggle from "@/components/language-toggle";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      title: t("about.culturalSensitivity", "Cultural Sensitivity"),
      description: t("about.culturalDesc", "Understanding unique health challenges facing Asian women"),
      icon: <Globe className="w-5 h-5" />
    },
    {
      title: t("about.evidenceBased", "Evidence-Based"),
      description: t("about.evidenceDesc", "All content backed by clinical research and medical expertise"),
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: t("about.accessibility", "Accessibility"),
      description: t("about.accessibilityDesc", "Free resources available in multiple languages"),
      icon: <Users className="w-5 h-5" />
    },
    {
      title: t("about.prevention", "Prevention Focus"),
      description: t("about.preventionDesc", "Emphasis on early detection and lifestyle interventions"),
      icon: <Target className="w-5 h-5" />
    }
  ];

  const achievements = [
    {
      number: "7",
      label: t("about.languages", "Languages Supported"),
      description: t("about.languagesDesc", "Making information accessible across Asian communities")
    },
    {
      number: "100+",
      label: t("about.resources", "Educational Resources"),
      description: t("about.resourcesDesc", "Comprehensive materials for bone health awareness")
    },
    {
      number: "ROS",
      label: t("about.partnership", "Endorsed Partnership"),
      description: t("about.partnershipDesc", "Collaborating with Royal Osteoporosis Society")
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t("about.mission", "Our Mission")}
          </Badge>
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">
            {t("about.title", "Empowering Asian Women's Bone Health")}
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            {t("about.subtitle", "Dedicated to raising awareness about osteoporosis risk factors specific to Asian women, providing culturally-sensitive resources, and promoting early detection through evidence-based education.")}
          </p>
        </div>

        {/* Story Section */}
        <Card className="mb-12 border-neutral-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("about.story", "Our Story")}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-neutral-700 mb-4">
                  {t("about.storyP1", "Asian women face a significantly higher risk of developing osteoporosis compared to other ethnic groups, yet awareness and culturally-appropriate resources remain limited.")}
                </p>
                <p className="text-neutral-700 mb-4">
                  {t("about.storyP2", "This platform was created to bridge that gap, offering comprehensive bone health information tailored specifically for Asian women's unique needs, genetic factors, and cultural contexts.")}
                </p>
                <p className="text-neutral-700">
                  {t("about.storyP3", "Working in partnership with the Royal Osteoporosis Society, we provide evidence-based resources that are both medically accurate and culturally relevant.")}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-4">
                  {t("about.impact", "Our Impact")}
                </h4>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="text-2xl font-bold text-blue-600 min-w-[4rem] flex-shrink-0">
                        {achievement.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-blue-800 mb-1">{achievement.label}</div>
                        <div className="text-sm text-blue-600 leading-relaxed">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-neutral-800 mb-8">
            {t("about.values", "Our Values")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-neutral-200 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* About the Creator */}
        <Card className="mb-12 border-neutral-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t("about.creator", "About the Creator")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                  {t("about.shivaName", "Shiva Namdeo")}
                </h3>
                <p className="text-neutral-600">
                  {t("about.creatorRole", "Founder & Health Advocate")}
                </p>
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                {t("about.creatorBio", "Passionate about addressing health disparities in Asian communities, Shiva recognized the critical need for culturally-sensitive bone health resources. With a commitment to evidence-based education and community empowerment, this platform represents a dedication to improving health outcomes for Asian women worldwide.")}
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  {t("about.contactButton", "Contact")}
                </Button>
                <Badge variant="secondary" className="px-3 py-1">
                  {t("about.advocate", "Health Advocate")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              {t("about.partnership", "Endorsed by Royal Osteoporosis Society")}
            </h3>
            <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
              {t("about.partnershipDesc", "We're proud to work in partnership with the Royal Osteoporosis Society (ROS), the UK's national charity dedicated to improving bone and muscle health. This collaboration ensures our content meets the highest medical standards.")}
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open('https://theros.org.uk/information-and-support/support-for-you/', '_blank')}
              >
                {t("about.accessMaterials", "Access Educational Materials")}
              </Button>
              <Badge variant="outline" className="px-4 py-2 border-blue-300 text-blue-700">
                {t("about.officialPartner", "Official Partner")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-green-200 bg-green-50">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                {t("about.joinMission", "Join Our Mission")}
              </h3>
              <p className="text-green-700 mb-6">
                {t("about.joinDesc", "Help us spread awareness about bone health in Asian communities. Share our resources, provide feedback, or get involved in our advocacy efforts.")}
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">
                  {t("about.getInvolved", "Get Involved")}
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700">
                  {t("about.shareResources", "Share Resources")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}