import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: jsonb("title").notNull(), // {en: "Title", hi: "शीर्षक", ...}
  content: jsonb("content").notNull(), // Multilingual content
  category: text("category").notNull(), // overview, prevention, nutrition, exercise, treatment, resources
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: jsonb("title").notNull(),
  description: jsonb("description").notNull(),
  type: text("type").notNull(), // article, video, document, tool
  url: text("url"),
  category: text("category").notNull(),
  tags: jsonb("tags").notNull(), // Array of strings
  isActive: boolean("is_active").notNull().default(true),
});

export const healthcareProviders = pgTable("healthcare_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  languages: jsonb("languages").notNull(), // Array of language codes
  acceptsInsurance: boolean("accepts_insurance").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
});

export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  responses: jsonb("responses").notNull(),
  riskScore: integer("risk_score").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: text("created_at").notNull(),
});

// Translation management tables
export const translationKeys = pgTable("translation_keys", {
  id: serial("id").primaryKey(),
  keyName: text("key_name").notNull().unique(),
  sourceText: text("source_text").notNull(), // Original English text
  category: text("category").notNull(), // content, resource, ui, etc.
  context: text("context"), // Additional context for translators
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  keyId: integer("key_id").notNull().references(() => translationKeys.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull(), // en, hi, bn, pa, ta, te, ur
  translatedText: text("translated_text").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  translatorNotes: text("translator_notes"),
  reviewerNotes: text("reviewer_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const translationProjects = pgTable("translation_projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, completed, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const translationKeysRelations = relations(translationKeys, ({ many }) => ({
  translations: many(translations),
}));

export const translationsRelations = relations(translations, ({ one }) => ({
  translationKey: one(translationKeys, {
    fields: [translations.keyId],
    references: [translationKeys.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContentSectionSchema = createInsertSchema(contentSections).pick({
  sectionKey: true,
  title: true,
  content: true,
  category: true,
  order: true,
  isActive: true,
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  type: true,
  url: true,
  category: true,
  tags: true,
  isActive: true,
});

export const insertHealthcareProviderSchema = createInsertSchema(healthcareProviders).pick({
  name: true,
  specialization: true,
  address: true,
  phone: true,
  email: true,
  languages: true,
  acceptsInsurance: true,
  isActive: true,
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).pick({
  sessionId: true,
  responses: true,
  riskScore: true,
  recommendations: true,
  createdAt: true,
});

export const insertTranslationKeySchema = createInsertSchema(translationKeys).pick({
  keyName: true,
  sourceText: true,
  category: true,
  context: true,
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  keyId: true,
  languageCode: true,
  translatedText: true,
  status: true,
  translatorNotes: true,
  reviewerNotes: true,
});

export const insertTranslationProjectSchema = createInsertSchema(translationProjects).pick({
  name: true,
  description: true,
  status: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type HealthcareProvider = typeof healthcareProviders.$inferSelect;
export type InsertHealthcareProvider = z.infer<typeof insertHealthcareProviderSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type TranslationKey = typeof translationKeys.$inferSelect;
export type InsertTranslationKey = z.infer<typeof insertTranslationKeySchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type TranslationProject = typeof translationProjects.$inferSelect;
export type InsertTranslationProject = z.infer<typeof insertTranslationProjectSchema>;

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: "English",
  hi: "हिन्दी (Hindi)"
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
