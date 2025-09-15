import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertRiskAssessmentSchema, 
  insertTranslationKeySchema, 
  insertTranslationSchema, 
  insertTranslationProjectSchema,
  SUPPORTED_LANGUAGES 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Content sections
  app.get("/api/content-sections", async (req, res) => {
    try {
      const { category } = req.query;
      const sections = await storage.getContentSections(category as string);
      res.json(sections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content sections" });
    }
  });

  app.get("/api/content-sections/:sectionKey", async (req, res) => {
    try {
      const { sectionKey } = req.params;
      const section = await storage.getContentSection(sectionKey);
      if (!section) {
        return res.status(404).json({ message: "Content section not found" });
      }
      res.json(section);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content section" });
    }
  });

  // Resources
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, type } = req.query;
      const resources = await storage.getResources(category as string, type as string);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/search", async (req, res) => {
    try {
      const { q, language } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const results = await storage.searchResources(q, language as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search resources" });
    }
  });

  // Healthcare providers
  app.get("/api/healthcare-providers", async (req, res) => {
    try {
      const { language } = req.query;
      const providers = await storage.getHealthcareProviders(language as string);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch healthcare providers" });
    }
  });

  // Risk assessment
  app.post("/api/risk-assessment", async (req, res) => {
    try {
      const assessmentData = insertRiskAssessmentSchema.parse({
        ...req.body,
        createdAt: new Date().toISOString()
      });
      
      const assessment = await storage.createRiskAssessment(assessmentData);
      res.json(assessment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create risk assessment" });
    }
  });

  app.get("/api/risk-assessment/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const assessment = await storage.getRiskAssessment(sessionId);
      if (!assessment) {
        return res.status(404).json({ message: "Risk assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk assessment" });
    }
  });

  // Translation management routes
  app.get("/api/translation-keys", async (req, res) => {
    try {
      const { category } = req.query;
      const keys = await storage.getTranslationKeys(category as string);
      res.json(keys);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translation keys" });
    }
  });

  app.post("/api/translation-keys", async (req, res) => {
    try {
      const keyData = insertTranslationKeySchema.parse(req.body);
      const key = await storage.createTranslationKey(keyData);
      res.json(key);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid key data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create translation key" });
    }
  });

  app.put("/api/translation-keys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const keyData = insertTranslationKeySchema.partial().parse(req.body);
      const key = await storage.updateTranslationKey(parseInt(id), keyData);
      if (!key) {
        return res.status(404).json({ message: "Translation key not found" });
      }
      res.json(key);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid key data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update translation key" });
    }
  });

  app.delete("/api/translation-keys/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTranslationKey(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Translation key not found" });
      }
      res.json({ message: "Translation key deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete translation key" });
    }
  });

  app.get("/api/translations", async (req, res) => {
    try {
      const { keyId, languageCode } = req.query;
      const translations = await storage.getTranslations(
        keyId ? parseInt(keyId as string) : undefined,
        languageCode as string
      );
      res.json(translations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  app.post("/api/translations", async (req, res) => {
    try {
      const translationData = insertTranslationSchema.parse(req.body);
      const translation = await storage.createTranslation(translationData);
      res.json(translation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid translation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create translation" });
    }
  });

  app.put("/api/translations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const translationData = insertTranslationSchema.partial().parse(req.body);
      const translation = await storage.updateTranslation(parseInt(id), translationData);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid translation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update translation" });
    }
  });

  app.delete("/api/translations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteTranslation(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json({ message: "Translation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete translation" });
    }
  });

  app.get("/api/translation-projects", async (req, res) => {
    try {
      const projects = await storage.getTranslationProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translation projects" });
    }
  });

  app.post("/api/translation-projects", async (req, res) => {
    try {
      const projectData = insertTranslationProjectSchema.parse(req.body);
      const project = await storage.createTranslationProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create translation project" });
    }
  });

  app.put("/api/translation-projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const projectData = insertTranslationProjectSchema.partial().parse(req.body);
      const project = await storage.updateTranslationProject(parseInt(id), projectData);
      if (!project) {
        return res.status(404).json({ message: "Translation project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update translation project" });
    }
  });

  // Translation export/import routes
  app.get("/api/translations/export", async (req, res) => {
    try {
      const { languageCode, format } = req.query;
      const translations = await storage.exportTranslations(languageCode as string);
      
      if (format === 'csv') {
        // Convert to CSV format
        const csvHeader = 'keyName,sourceText,translatedText,languageCode,status,category,context\n';
        const csvRows = translations.map((t: any) => 
          `"${t.keyName}","${t.sourceText}","${t.translatedText}","${t.languageCode}","${t.status}","${t.category}","${t.context || ''}"`
        ).join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="translations-${languageCode || 'all'}.csv"`);
        res.send(csvHeader + csvRows);
      } else {
        // Default to JSON format
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="translations-${languageCode || 'all'}.json"`);
        res.json(translations);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export translations" });
    }
  });

  app.post("/api/translations/import", async (req, res) => {
    try {
      const { data } = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({ message: "Data must be an array of translation objects" });
      }
      
      const result = await storage.importTranslations(data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to import translations" });
    }
  });

  // Get supported languages
  app.get("/api/languages", async (req, res) => {
    res.json(SUPPORTED_LANGUAGES);
  });

  const httpServer = createServer(app);
  return httpServer;
}
