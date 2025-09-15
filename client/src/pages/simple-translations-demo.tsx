import { SimpleTranslationsProvider, useSimpleTranslations } from "@/hooks/use-simple-translations";
import { SimpleLanguageSwitcher, SimpleTranslationExample } from "@/components/simple-language-switcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

function DemoContent() {
  const { t, loading } = useSimpleTranslations();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Simple Translation System Demo</h1>
            <p className="text-muted-foreground">See how translations work with JSON files</p>
          </div>
          <SimpleLanguageSwitcher />
        </div>

        {/* Information Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This demo page shows how the simple JSON-based translation system works. 
            Switch languages using the buttons above to see the content change.
          </AlertDescription>
        </Alert>

        {/* Main Translation Example */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section Example</CardTitle>
            <CardDescription>
              This content comes from the JSON translation files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTranslationExample />
          </CardContent>
        </Card>

        {/* Navigation Example */}
        <Card>
          <CardHeader>
            <CardTitle>{t('navigation.title', 'Navigation Example')}</CardTitle>
            <CardDescription>
              Navigation items using translation keys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <nav className="flex gap-4 flex-wrap">
              <Button variant="ghost">{t('navigation.home', 'Home')}</Button>
              <Button variant="ghost">{t('navigation.about', 'About')}</Button>
              <Button variant="ghost">{t('navigation.assessment', 'Risk Assessment')}</Button>
              <Button variant="ghost">{t('navigation.resources', 'Resources')}</Button>
              <Button variant="ghost">{t('navigation.contact', 'Contact')}</Button>
              <Button variant="ghost">{t('navigation.feedback', 'Feedback')}</Button>
            </nav>
          </CardContent>
        </Card>

        {/* Clinical Evidence Example */}
        <Card>
          <CardHeader>
            <CardTitle>{t('evidence.title', 'Clinical Research Evidence')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              {t('evidence.description', 'Osteoporosis Risk: Asian women generally have lower bone mineral density (BMD) than other groups...')}
            </p>
            <div className="text-sm text-muted-foreground">
              <strong>{t('evidence.source', 'Source:')} </strong>
              <em>{t('evidence.citation', 'Lo JC, Pressman AR, et al. Osteoporosis and fracture among older US Asian adults...')}</em>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Example */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quickActions.title', 'Take Action Today')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">{t('quickActions.riskAssessment', 'Risk Assessment')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('quickActions.riskAssessmentDesc', 'Complete a personalized risk evaluation in your language')}
                </p>
                <Button size="sm">{t('common.submit', 'Submit')}</Button>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">{t('quickActions.scheduleTest', 'Schedule Test')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('quickActions.scheduleTestDesc', 'Book your bone density screening appointment')}
                </p>
                <Button size="sm" variant="outline">{t('common.cancel', 'Cancel')}</Button>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <h3 className="font-semibold mb-2">{t('quickActions.downloadResources', 'Download Resources')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('quickActions.downloadResourcesDesc', 'Access educational materials in your preferred language')}
                </p>
                <Button size="sm" variant="secondary">{t('common.close', 'Close')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Example */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Information</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm">
            <p>
              {t('footer.riskAssessmentBy', 'Risk assessment tool provided by')} {' '}
              <strong>{t('footer.ros', 'Royal Osteoporosis Society (ROS)')}</strong>
            </p>
            <p className="text-muted-foreground mt-2">
              {t('footer.rosDescription', 'The UK\'s national charity dedicated to improving bone and muscle health')}
            </p>
          </CardContent>
        </Card>

        {/* Language Status */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center text-sm">
              <p><strong>{t('language.current', 'Current')} Language:</strong> {t('language.english', 'English')} / {t('language.hindi', 'Hindi')}</p>
              <p className="text-muted-foreground mt-1">
                You can add more languages by creating additional JSON files (e.g., es.json for Spanish)
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default function SimpleTranslationsDemo() {
  return (
    <SimpleTranslationsProvider>
      <DemoContent />
    </SimpleTranslationsProvider>
  );
}