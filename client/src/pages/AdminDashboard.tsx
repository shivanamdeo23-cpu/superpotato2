import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Languages, Upload, Download, Plus, Settings } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@shared/schema";

interface TranslationKey {
  id: number;
  keyName: string;
  sourceText: string;
  category: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

interface Translation {
  id: number;
  keyId: number;
  languageCode: string;
  translatedText: string;
  status: string;
  translatorNotes?: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface TranslationProject {
  id: number;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'keys' | 'translations' | 'projects'>('keys');
  const queryClient = useQueryClient();

  const { data: translationKeys = [], isLoading: loadingKeys } = useQuery({
    queryKey: ['/api/translation-keys'],
  });

  const { data: translations = [], isLoading: loadingTranslations } = useQuery({
    queryKey: ['/api/translations'],
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['/api/translation-projects'],
  });

  const exportMutation = useMutation({
    mutationFn: async ({ languageCode, format }: { languageCode?: string; format?: string }) => {
      const params = new URLSearchParams();
      if (languageCode) params.append('languageCode', languageCode);
      if (format) params.append('format', format);
      
      const response = await fetch(`/api/translations/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${languageCode || 'all'}.${format || 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  // Calculate statistics
  const totalKeys = translationKeys.length;
  const totalTranslations = translations.length;
  const approvedTranslations = translations.filter((t: Translation) => t.status === 'approved').length;
  const pendingTranslations = translations.filter((t: Translation) => t.status === 'pending').length;
  
  const translationsByLanguage = Object.fromEntries(
    Object.keys(SUPPORTED_LANGUAGES).map(lang => [
      lang,
      translations.filter((t: Translation) => t.languageCode === lang).length
    ])
  );

  const handleExport = (languageCode?: string, format: string = 'json') => {
    exportMutation.mutate({ languageCode, format });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Translation Management</h1>
          <p className="text-muted-foreground">Manage multilingual content and translations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/translations/import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Link>
          </Button>
          <Button variant="outline" onClick={() => handleExport()}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Translation Keys</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKeys}</div>
            <p className="text-xs text-muted-foreground">Total source texts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Translations</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTranslations}</div>
            <p className="text-xs text-muted-foreground">Across all languages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Badge variant="secondary" className="text-green-600">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedTranslations}</div>
            <p className="text-xs text-muted-foreground">Ready for production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary" className="text-orange-600">⏳</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTranslations}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Language Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Translation Progress by Language</CardTitle>
          <CardDescription>Number of translations completed for each language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <div key={code} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{name}</div>
                  <div className="text-sm text-muted-foreground">{code.toUpperCase()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{translationsByLanguage[code] || 0}</Badge>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleExport(code, 'json')}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 border-b-2 ${activeTab === 'keys' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('keys')}
        >
          Translation Keys ({totalKeys})
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${activeTab === 'translations' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('translations')}
        >
          Translations ({totalTranslations})
        </button>
        <button
          className={`px-4 py-2 border-b-2 ${activeTab === 'projects' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'keys' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Translation Keys</CardTitle>
              <CardDescription>Manage source texts and translation keys</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/translations/keys/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Key
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingKeys ? (
              <div>Loading translation keys...</div>
            ) : (
              <div className="space-y-2">
                {translationKeys.map((key: TranslationKey) => (
                  <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{key.keyName}</div>
                      <div className="text-sm text-muted-foreground">{key.sourceText}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{key.category}</Badge>
                        {key.context && <Badge variant="secondary">Context: {key.context}</Badge>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/translations/keys/${key.id}`}>
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'translations' && (
        <Card>
          <CardHeader>
            <CardTitle>Translations</CardTitle>
            <CardDescription>Review and manage individual translations</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTranslations ? (
              <div>Loading translations...</div>
            ) : (
              <div className="space-y-2">
                {translations.map((translation: Translation) => {
                  const key = translationKeys.find((k: TranslationKey) => k.id === translation.keyId);
                  return (
                    <div key={translation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{key?.keyName || 'Unknown Key'}</div>
                        <div className="text-sm text-muted-foreground">{translation.translatedText}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{SUPPORTED_LANGUAGES[translation.languageCode as keyof typeof SUPPORTED_LANGUAGES]}</Badge>
                          <Badge variant={translation.status === 'approved' ? 'default' : 'secondary'}>
                            {translation.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/translations/${translation.id}`}>
                          <Settings className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'projects' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Translation Projects</CardTitle>
              <CardDescription>Organize translations into projects</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/translations/projects/new">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingProjects ? (
              <div>Loading projects...</div>
            ) : (
              <div className="space-y-2">
                {projects.map((project: TranslationProject) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      {project.description && (
                        <div className="text-sm text-muted-foreground">{project.description}</div>
                      )}
                      <Badge variant="outline" className="mt-1">{project.status}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/translations/projects/${project.id}`}>
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}