import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Download, AlertCircle } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@shared/schema";

export default function TranslationImport() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [importFormat, setImportFormat] = useState<'json' | 'csv'>('json');
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const importMutation = useMutation({
    mutationFn: async (data: any[]) => {
      const response = await apiRequest('/api/translations/import', 'POST', { data });
      return response;
    },
    onSuccess: (result) => {
      setImportResult(result);
      toast({ 
        title: `Import completed: ${result.success} successful${result.errors.length > 0 ? `, ${result.errors.length} errors` : ''}` 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/translation-keys'] });
      queryClient.invalidateQueries({ queryKey: ['/api/translations'] });
    },
    onError: () => {
      toast({ title: "Import failed", variant: "destructive" });
    },
  });

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const expectedHeaders = ['keyName', 'sourceText', 'translatedText', 'languageCode', 'status', 'category', 'context'];
    
    // Validate headers
    if (!expectedHeaders.every(h => headers.includes(h))) {
      throw new Error(`CSV must contain these headers: ${expectedHeaders.join(', ')}`);
    }
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (importFormat === 'json') {
          setJsonData(text);
        } else {
          try {
            const csvData = parseCSV(text);
            setJsonData(JSON.stringify(csvData, null, 2));
          } catch (error) {
            toast({ 
              title: "CSV parsing error", 
              description: error instanceof Error ? error.message : "Invalid CSV format",
              variant: "destructive" 
            });
          }
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleImport = () => {
    try {
      let data;
      if (importFormat === 'json') {
        data = JSON.parse(jsonData);
      } else {
        data = JSON.parse(jsonData); // Already parsed from CSV
      }
      
      if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
      }
      
      importMutation.mutate(data);
    } catch (error) {
      toast({ 
        title: "Invalid data format", 
        description: error instanceof Error ? error.message : "Please check your data format",
        variant: "destructive" 
      });
    }
  };

  const generateSampleData = () => {
    const sample = [
      {
        keyName: "welcome_message",
        sourceText: "Welcome to our health platform",
        translatedText: "हमारे स्वास्थ्य प्लेटफॉर्म में आपका स्वागत है",
        languageCode: "hi",
        status: "approved",
        category: "content",
        context: "Main page greeting"
      },
      {
        keyName: "navigation_home",
        sourceText: "Home",
        translatedText: "घर",
        languageCode: "hi",
        status: "pending",
        category: "navigation",
        context: "Navigation menu item"
      }
    ];
    
    if (importFormat === 'json') {
      setJsonData(JSON.stringify(sample, null, 2));
    } else {
      const csvHeader = 'keyName,sourceText,translatedText,languageCode,status,category,context\n';
      const csvRows = sample.map(item => 
        `"${item.keyName}","${item.sourceText}","${item.translatedText}","${item.languageCode}","${item.status}","${item.category}","${item.context}"`
      ).join('\n');
      setJsonData(csvHeader + csvRows);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        keyName: "example_key",
        sourceText: "Example English text",
        translatedText: "Your translation here",
        languageCode: "hi",
        status: "pending",
        category: "content",
        context: "Context for translators"
      }
    ];
    
    let content, filename, mimeType;
    
    if (importFormat === 'json') {
      content = JSON.stringify(template, null, 2);
      filename = 'translation-template.json';
      mimeType = 'application/json';
    } else {
      const csvHeader = 'keyName,sourceText,translatedText,languageCode,status,category,context\n';
      const csvRow = '"example_key","Example English text","Your translation here","hi","pending","content","Context for translators"';
      content = csvHeader + csvRow;
      filename = 'translation-template.csv';
      mimeType = 'text/csv';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setLocation('/admin/translations')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Import Translations</h1>
          <p className="text-muted-foreground">Upload translation files to populate the database</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Import Format:</strong> Your file should contain translation keys, source text, translations, 
          language codes, and metadata. Use the template download or sample data buttons below to see the expected format.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload Settings</CardTitle>
          <CardDescription>Choose your file format and upload method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Import Format</Label>
            <Select value={importFormat} onValueChange={(value: 'json' | 'csv') => setImportFormat(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="file-upload">Upload File</Label>
            <Input
              id="file-upload"
              type="file"
              accept={importFormat === 'json' ? '.json' : '.csv'}
              onChange={handleFileUpload}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button variant="outline" onClick={generateSampleData}>
              <FileText className="w-4 h-4 mr-2" />
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
          <CardDescription>Review and edit your data before importing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={`Paste your ${importFormat.toUpperCase()} data here or upload a file above`}
              rows={12}
              className="font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleImport} 
                disabled={!jsonData.trim() || importMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Translations
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Language Codes</CardTitle>
          <CardDescription>Use these language codes in your import data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <div key={code} className="flex items-center gap-2 p-2 border rounded">
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{code}</code>
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-green-600 font-medium">
                ✓ Successfully imported: {importResult.success} translations
              </div>
              
              {importResult.errors.length > 0 && (
                <div>
                  <div className="text-red-600 font-medium mb-2">
                    ⚠ Errors ({importResult.errors.length}):
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}