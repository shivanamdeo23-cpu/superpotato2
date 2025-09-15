import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { SUPPORTED_LANGUAGES, type InsertTranslationKey } from "@shared/schema";

interface TranslationKey {
  id: number;
  keyName: string;
  sourceText: string;
  category: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TranslationKeyForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState<Partial<InsertTranslationKey>>({
    keyName: '',
    sourceText: '',
    category: '',
    context: ''
  });

  const { data: translationKey, isLoading } = useQuery({
    queryKey: ['/api/translation-keys', id],
    enabled: isEditing,
  });

  const { data: translations = [] } = useQuery({
    queryKey: ['/api/translations'],
    select: (data) => data.filter((t: any) => t.keyId === parseInt(id || '0')),
    enabled: isEditing,
  });

  useEffect(() => {
    if (translationKey) {
      setFormData({
        keyName: translationKey.keyName,
        sourceText: translationKey.sourceText,
        category: translationKey.category,
        context: translationKey.context || ''
      });
    }
  }, [translationKey]);

  const createMutation = useMutation({
    mutationFn: (data: InsertTranslationKey) => 
      apiRequest('/api/translation-keys', 'POST', data),
    onSuccess: () => {
      toast({ title: "Translation key created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/translation-keys'] });
      setLocation('/admin/translations');
    },
    onError: () => {
      toast({ title: "Failed to create translation key", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<InsertTranslationKey>) => 
      apiRequest(`/api/translation-keys/${id}`, 'PUT', data),
    onSuccess: () => {
      toast({ title: "Translation key updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/translation-keys'] });
      setLocation('/admin/translations');
    },
    onError: () => {
      toast({ title: "Failed to update translation key", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest(`/api/translation-keys/${id}`, 'DELETE'),
    onSuccess: () => {
      toast({ title: "Translation key deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/translation-keys'] });
      setLocation('/admin/translations');
    },
    onError: () => {
      toast({ title: "Failed to delete translation key", variant: "destructive" });
    },
  });

  const createTranslationMutation = useMutation({
    mutationFn: (data: { languageCode: string; translatedText: string }) => 
      apiRequest('/api/translations', 'POST', {
        keyId: parseInt(id!),
        ...data,
        status: 'pending'
      }),
    onSuccess: () => {
      toast({ title: "Translation added successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/translations'] });
    },
    onError: () => {
      toast({ title: "Failed to add translation", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.keyName || !formData.sourceText || !formData.category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData as InsertTranslationKey);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this translation key? This will also delete all associated translations.')) {
      deleteMutation.mutate();
    }
  };

  const handleAddTranslation = (languageCode: string) => {
    const translatedText = prompt(`Enter translation for ${SUPPORTED_LANGUAGES[languageCode as keyof typeof SUPPORTED_LANGUAGES]}:`);
    if (translatedText) {
      createTranslationMutation.mutate({ languageCode, translatedText });
    }
  };

  if (isEditing && isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  const existingLanguages = new Set(translations.map((t: any) => t.languageCode));
  const availableLanguages = Object.entries(SUPPORTED_LANGUAGES).filter(([code]) => !existingLanguages.has(code));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation('/admin/translations')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Translation Key' : 'Create Translation Key'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update the source text and manage translations' : 'Add a new source text for translation'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Information</CardTitle>
            <CardDescription>Basic information about the translation key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="keyName">Key Name *</Label>
              <Input
                id="keyName"
                value={formData.keyName}
                onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
                placeholder="e.g., welcome_message, navigation_home"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Unique identifier for this text (use lowercase with underscores)
              </p>
            </div>

            <div>
              <Label htmlFor="sourceText">Source Text (English) *</Label>
              <Textarea
                id="sourceText"
                value={formData.sourceText}
                onChange={(e) => setFormData({ ...formData, sourceText: e.target.value })}
                placeholder="Enter the original English text"
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="ui">User Interface</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                  <SelectItem value="forms">Forms</SelectItem>
                  <SelectItem value="messages">Messages</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="context">Context (Optional)</Label>
              <Textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Additional context to help translators understand the usage"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update' : 'Create'}
          </Button>
          
          {isEditing && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </form>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Translations</CardTitle>
            <CardDescription>Manage translations for this key</CardDescription>
          </CardHeader>
          <CardContent>
            {translations.length > 0 && (
              <div className="space-y-3 mb-4">
                {translations.map((translation: any) => (
                  <div key={translation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">
                        {SUPPORTED_LANGUAGES[translation.languageCode as keyof typeof SUPPORTED_LANGUAGES]}
                      </div>
                      <div className="text-sm text-muted-foreground">{translation.translatedText}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Status: {translation.status}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newText = prompt('Update translation:', translation.translatedText);
                      if (newText) {
                        apiRequest(`/api/translations/${translation.id}`, 'PUT', {
                          translatedText: newText
                        }).then(() => {
                          toast({ title: "Translation updated" });
                          queryClient.invalidateQueries({ queryKey: ['/api/translations'] });
                        });
                      }
                    }}>
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {availableLanguages.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Add New Translation</h4>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map(([code, name]) => (
                    <Button
                      key={code}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTranslation(code)}
                      disabled={createTranslationMutation.isPending}
                    >
                      Add {name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}