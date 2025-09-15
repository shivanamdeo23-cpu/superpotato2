import { 
  users, 
  contentSections, 
  resources, 
  healthcareProviders, 
  riskAssessments,
  translationKeys,
  translations,
  translationProjects,
  type User, 
  type InsertUser,
  type ContentSection,
  type InsertContentSection,
  type Resource,
  type InsertResource,
  type HealthcareProvider,
  type InsertHealthcareProvider,
  type RiskAssessment,
  type InsertRiskAssessment,
  type TranslationKey,
  type InsertTranslationKey,
  type Translation,
  type InsertTranslation,
  type TranslationProject,
  type InsertTranslationProject,
  type LanguageCode
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Content operations
  getContentSections(category?: string): Promise<ContentSection[]>;
  getContentSection(sectionKey: string): Promise<ContentSection | undefined>;
  createContentSection(section: InsertContentSection): Promise<ContentSection>;
  updateContentSection(id: number, section: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  
  // Resource operations
  getResources(category?: string, type?: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  searchResources(query: string, language?: string): Promise<Resource[]>;
  
  // Healthcare provider operations
  getHealthcareProviders(language?: string): Promise<HealthcareProvider[]>;
  getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined>;
  createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider>;
  
  // Risk assessment operations
  createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment>;
  getRiskAssessment(sessionId: string): Promise<RiskAssessment | undefined>;
  
  // Translation management operations
  getTranslationKeys(category?: string): Promise<TranslationKey[]>;
  getTranslationKey(id: number): Promise<TranslationKey | undefined>;
  createTranslationKey(key: InsertTranslationKey): Promise<TranslationKey>;
  updateTranslationKey(id: number, key: Partial<InsertTranslationKey>): Promise<TranslationKey | undefined>;
  deleteTranslationKey(id: number): Promise<boolean>;
  
  getTranslations(keyId?: number, languageCode?: string): Promise<Translation[]>;
  getTranslation(keyId: number, languageCode: string): Promise<Translation | undefined>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined>;
  deleteTranslation(id: number): Promise<boolean>;
  
  getTranslationProjects(): Promise<TranslationProject[]>;
  createTranslationProject(project: InsertTranslationProject): Promise<TranslationProject>;
  updateTranslationProject(id: number, project: Partial<InsertTranslationProject>): Promise<TranslationProject | undefined>;
  
  // Translation export/import
  exportTranslations(languageCode?: string): Promise<any>;
  importTranslations(data: any): Promise<{ success: number; errors: string[] }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getContentSections(category?: string): Promise<ContentSection[]> {
    if (category) {
      return await db.select().from(contentSections).where(
        and(eq(contentSections.category, category), eq(contentSections.isActive, true))
      ).orderBy(contentSections.order);
    }
    return await db.select().from(contentSections).where(eq(contentSections.isActive, true)).orderBy(contentSections.order);
  }

  async getContentSection(sectionKey: string): Promise<ContentSection | undefined> {
    const [section] = await db.select().from(contentSections).where(
      and(eq(contentSections.sectionKey, sectionKey), eq(contentSections.isActive, true))
    );
    return section || undefined;
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const [newSection] = await db
      .insert(contentSections)
      .values(section)
      .returning();
    return newSection;
  }

  async updateContentSection(id: number, section: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [updated] = await db
      .update(contentSections)
      .set(section)
      .where(eq(contentSections.id, id))
      .returning();
    return updated || undefined;
  }

  async getResources(category?: string, type?: string): Promise<Resource[]> {
    let query = db.select().from(resources).where(eq(resources.isActive, true));
    
    if (category && type) {
      return await db.select().from(resources).where(
        and(
          eq(resources.category, category),
          eq(resources.type, type),
          eq(resources.isActive, true)
        )
      );
    } else if (category) {
      return await db.select().from(resources).where(
        and(eq(resources.category, category), eq(resources.isActive, true))
      );
    } else if (type) {
      return await db.select().from(resources).where(
        and(eq(resources.type, type), eq(resources.isActive, true))
      );
    }
    
    return await db.select().from(resources).where(eq(resources.isActive, true));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db
      .insert(resources)
      .values(resource)
      .returning();
    return newResource;
  }

  async searchResources(query: string, language = 'en'): Promise<Resource[]> {
    if (!query.trim()) return [];
    
    // Note: This is a simplified search. In production, you'd want to use full-text search
    // For now, we'll search in the JSONB fields using PostgreSQL operators
    return await db.select().from(resources).where(
      and(
        eq(resources.isActive, true),
        or(
          // Search in title JSONB field
          like(resources.title, `%${query}%`),
          // Search in description JSONB field  
          like(resources.description, `%${query}%`)
        )
      )
    );
  }

  async getHealthcareProviders(language?: string): Promise<HealthcareProvider[]> {
    if (language) {
      // Note: This needs to be implemented with proper JSONB array search
      return await db.select().from(healthcareProviders).where(eq(healthcareProviders.isActive, true));
    }
    return await db.select().from(healthcareProviders).where(eq(healthcareProviders.isActive, true));
  }

  async getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined> {
    const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.id, id));
    return provider || undefined;
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const [newProvider] = await db
      .insert(healthcareProviders)
      .values(provider)
      .returning();
    return newProvider;
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const [newAssessment] = await db
      .insert(riskAssessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async getRiskAssessment(sessionId: string): Promise<RiskAssessment | undefined> {
    const [assessment] = await db.select().from(riskAssessments).where(eq(riskAssessments.sessionId, sessionId));
    return assessment || undefined;
  }

  // Translation management methods
  async getTranslationKeys(category?: string): Promise<TranslationKey[]> {
    if (category) {
      return await db.select().from(translationKeys).where(eq(translationKeys.category, category)).orderBy(desc(translationKeys.createdAt));
    }
    return await db.select().from(translationKeys).orderBy(desc(translationKeys.createdAt));
  }

  async getTranslationKey(id: number): Promise<TranslationKey | undefined> {
    const [key] = await db.select().from(translationKeys).where(eq(translationKeys.id, id));
    return key || undefined;
  }

  async createTranslationKey(key: InsertTranslationKey): Promise<TranslationKey> {
    const [newKey] = await db
      .insert(translationKeys)
      .values(key)
      .returning();
    return newKey;
  }

  async updateTranslationKey(id: number, key: Partial<InsertTranslationKey>): Promise<TranslationKey | undefined> {
    const [updated] = await db
      .update(translationKeys)
      .set({ ...key, updatedAt: new Date() })
      .where(eq(translationKeys.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTranslationKey(id: number): Promise<boolean> {
    const result = await db.delete(translationKeys).where(eq(translationKeys.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getTranslations(keyId?: number, languageCode?: string): Promise<Translation[]> {
    let query = db.select().from(translations);
    
    if (keyId && languageCode) {
      return await db.select().from(translations).where(
        and(eq(translations.keyId, keyId), eq(translations.languageCode, languageCode))
      );
    } else if (keyId) {
      return await db.select().from(translations).where(eq(translations.keyId, keyId));
    } else if (languageCode) {
      return await db.select().from(translations).where(eq(translations.languageCode, languageCode));
    }
    
    return await db.select().from(translations).orderBy(desc(translations.updatedAt));
  }

  async getTranslation(keyId: number, languageCode: string): Promise<Translation | undefined> {
    const [translation] = await db.select().from(translations).where(
      and(eq(translations.keyId, keyId), eq(translations.languageCode, languageCode))
    );
    return translation || undefined;
  }

  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const [newTranslation] = await db
      .insert(translations)
      .values(translation)
      .returning();
    return newTranslation;
  }

  async updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const [updated] = await db
      .update(translations)
      .set({ ...translation, updatedAt: new Date() })
      .where(eq(translations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTranslation(id: number): Promise<boolean> {
    const result = await db.delete(translations).where(eq(translations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getTranslationProjects(): Promise<TranslationProject[]> {
    return await db.select().from(translationProjects).orderBy(desc(translationProjects.createdAt));
  }

  async createTranslationProject(project: InsertTranslationProject): Promise<TranslationProject> {
    const [newProject] = await db
      .insert(translationProjects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateTranslationProject(id: number, project: Partial<InsertTranslationProject>): Promise<TranslationProject | undefined> {
    const [updated] = await db
      .update(translationProjects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(translationProjects.id, id))
      .returning();
    return updated || undefined;
  }

  async exportTranslations(languageCode?: string): Promise<any> {
    let translationsQuery;
    
    if (languageCode) {
      translationsQuery = await db.select({
        keyName: translationKeys.keyName,
        sourceText: translationKeys.sourceText,
        translatedText: translations.translatedText,
        languageCode: translations.languageCode,
        status: translations.status,
        category: translationKeys.category,
        context: translationKeys.context
      })
      .from(translations)
      .innerJoin(translationKeys, eq(translations.keyId, translationKeys.id))
      .where(eq(translations.languageCode, languageCode));
    } else {
      translationsQuery = await db.select({
        keyName: translationKeys.keyName,
        sourceText: translationKeys.sourceText,
        translatedText: translations.translatedText,
        languageCode: translations.languageCode,
        status: translations.status,
        category: translationKeys.category,
        context: translationKeys.context
      })
      .from(translations)
      .innerJoin(translationKeys, eq(translations.keyId, translationKeys.id));
    }
    
    return translationsQuery;
  }

  async importTranslations(data: any): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };
    
    for (const item of data) {
      try {
        // Check if translation key exists
        let [existingKey] = await db.select().from(translationKeys).where(eq(translationKeys.keyName, item.keyName));
        
        if (!existingKey) {
          // Create new translation key
          [existingKey] = await db
            .insert(translationKeys)
            .values({
              keyName: item.keyName,
              sourceText: item.sourceText,
              category: item.category || 'imported',
              context: item.context
            })
            .returning();
        }
        
        // Check if translation already exists
        const [existingTranslation] = await db.select().from(translations).where(
          and(eq(translations.keyId, existingKey.id), eq(translations.languageCode, item.languageCode))
        );
        
        if (existingTranslation) {
          // Update existing translation
          await db
            .update(translations)
            .set({
              translatedText: item.translatedText,
              status: item.status || 'pending',
              updatedAt: new Date()
            })
            .where(eq(translations.id, existingTranslation.id));
        } else {
          // Create new translation
          await db
            .insert(translations)
            .values({
              keyId: existingKey.id,
              languageCode: item.languageCode,
              translatedText: item.translatedText,
              status: item.status || 'pending'
            });
        }
        
        results.success++;
      } catch (error) {
        results.errors.push(`Failed to import ${item.keyName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return results;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contentSections: Map<number, ContentSection>;
  private resources: Map<number, Resource>;
  private healthcareProviders: Map<number, HealthcareProvider>;
  private riskAssessments: Map<number, RiskAssessment>;
  private translationKeysMap: Map<number, TranslationKey>;
  private translationsMap: Map<number, Translation>;
  private translationProjectsMap: Map<number, TranslationProject>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.contentSections = new Map();
    this.resources = new Map();
    this.healthcareProviders = new Map();
    this.riskAssessments = new Map();
    this.translationKeysMap = new Map();
    this.translationsMap = new Map();
    this.translationProjectsMap = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed content sections
    const sections = [
      {
        sectionKey: "what-is-osteoporosis",
        title: {
          en: "What is Osteoporosis?",
          hi: "ऑस्टियोपोरोसिस क्या है?",
          bn: "অস্টিওপোরোসিস কি?",
          pa: "ਆਸਟੀਓਪੋਰੋਸਿਸ ਕੀ ਹੈ?",
          ta: "ஆஸ்டியோபோரோசிஸ் என்றால் என்ன?",
          te: "ఆస్టియోపోరోసిస్ అంటే ఏమిటి?",
          ur: "آسٹیوپوروسس کیا ہے؟"
        },
        content: {
          en: "Osteoporosis is a bone disease that occurs when the body loses too much bone, makes too little bone, or both. As a result, bones become weak and may break from a fall or, in serious cases, from sneezing or minor bumps.",
          hi: "ऑस्टियोपोरोसिस एक हड्डी की बीमारी है जो तब होती है जब शरीर बहुत अधिक हड्डी खो देता है, बहुत कम हड्डी बनाता है, या दोनों। परिणामस्वरूप, हड्डियां कमजोर हो जाती हैं।",
          bn: "অস্টিওপোরোসিস একটি হাড়ের রোগ যা ঘটে যখন শরীর অত্যধিক হাড় হারায়, খুব কম হাড় তৈরি করে, বা উভয়ই। ফলস্বরূপ, হাড় দুর্বল হয়ে পড়ে।",
          pa: "ਆਸਟੀਓਪੋਰੋਸਿਸ ਇੱਕ ਹੱਡੀਆਂ ਦੀ ਬਿਮਾਰੀ ਹੈ ਜੋ ਉਦੋਂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਸਰੀਰ ਬਹੁਤ ਜ਼ਿਆਦਾ ਹੱਡੀ ਗੁਆ ਦੇਂਦਾ ਹੈ।",
          ta: "ஆஸ்டியோபோரோசிஸ் என்பது ஒரு எலும்பு நோயாகும், இது உடல் அதிக எலும்பை இழக்கும் போது, மிகக் குறைந்த எலும்பை உருவாக்கும் போது அல்லது இரண்டும் நிகழும் போது ஏற்படுகிறது।",
          te: "ఆస్టియోపోరోసిస్ అనేది ఒక ఎముక వ్యాధి, ఇది శరీరం చాలా ఎక్కువ ఎముకను కోల్పోయినప్పుడు, చాలా తక్కువ ఎముకను తయారు చేసినప్పుడు లేదా రెండూ జరిగినప్పుడు సంభవిస్తుంది।",
          ur: "آسٹیوپوروسس ایک ہڈی کی بیماری ہے جو اس وقت ہوتی ہے جب جسم بہت زیادہ ہڈی کھو دیتا ہے، بہت کم ہڈی بناتا ہے، یا دونوں۔"
        },
        category: "overview",
        order: 1,
        isActive: true
      },
      {
        sectionKey: "risk-factors",
        title: {
          en: "Risk Factors for Asian Women",
          hi: "एशियाई महिलाओं के लिए जोखिम कारक",
          bn: "এশিয়ান মহিলাদের জন্য ঝুঁকির কারণ",
          pa: "ਏਸ਼ੀਆਈ ਔਰਤਾਂ ਲਈ ਜੋਖਮ ਦੇ ਕਾਰਕ",
          ta: "ஆசிய பெண்களுக்கான ஆபத்து காரணிகள்",
          te: "ఆసియా మహిళలకు ప్రమాద కారకాలు",
          ur: "ایشیائی خواتین کے لیے خطرے کے عوامل"
        },
        content: {
          en: "Asian women face unique risk factors including smaller bone frame, genetic predisposition, dietary patterns with lower calcium intake, and earlier menopause onset.",
          hi: "एशियाई महिलाओं को अनोखे जोखिम कारकों का सामना करना पड़ता है जिसमें छोटी हड्डी का फ्रेम, आनुवंशिक पूर्वाग्रह, कम कैल्शियम सेवन वाले आहार पैटर्न और रजोनिवृत्ति की शुरुआत शामिल है।",
          bn: "এশিয়ান মহিলারা অনন্য ঝুঁকির কারণগুলির মুখোমুখি হন যার মধ্যে রয়েছে ছোট হাড়ের ফ্রেম, জেনেটিক প্রবণতা, কম ক্যালসিয়াম গ্রহণ সহ খাদ্য প্রবণতা এবং আগে মেনোপজের সূচনা।",
          pa: "ਏਸ਼ੀਆਈ ਔਰਤਾਂ ਨੂੰ ਵਿਲੱਖਣ ਜੋਖਮ ਦੇ ਕਾਰਕਾਂ ਦਾ ਸਾਹਮਣਾ ਕਰਨਾ ਪੈਂਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਛੋਟੇ ਹੱਡੀ ਦੇ ਫਰੇਮ, ਜੈਨੇਟਿਕ ਪ੍ਰਵਿਰਤੀ, ਘੱਟ ਕੈਲਸੀਅਮ ਦੇ ਸੇਵਨ ਵਾਲੇ ਖੁਰਾਕ ਪੈਟਰਨ ਅਤੇ ਪਹਿਲਾਂ ਰਜੋਨਿਵ੍ਰਿਤੀ ਦੀ ਸ਼ੁਰੂਆਤ ਸ਼ਾਮਲ ਹੈ।",
          ta: "ஆசிய பெண்கள் தனித்துவமான ஆபத்து காரணிகளை எதிர்கொள்கிறார்கள், இதில் சிறிய எலும்பு கட்டமைப்பு, மரபணு முன்னோட்டம், குறைந்த கால்சியம் உட்கொள்ளல் உள்ள உணவு முறைகள் மற்றும் முன்னதாக மாதவிடாய் நிறுத்தம் ஆகியவை அடங்கும்।",
          te: "ఆసియా మహిళలు ప్రత్యేకమైన ప్రమాద కారకాలను ఎదుర్కొంటారు, వీటిలో చిన్న ఎముక ఫ్రేమ్, జన్యుపరమైన ప్రవృత్తి, తక్కువ కాల్షియం తీసుకోవడంతో కూడిన ఆహార నమూనాలు మరియు ముందస్తు మెనోపాజ్ ప్రారంభం ఉన్నాయి।",
          ur: "ایشیائی خواتین کو منفرد خطرے کے عوامل کا سامنا کرنا پڑتا ہے جن میں چھوٹا ہڈی کا فریم، جینیاتی رجحان، کم کیلسیم کی مقدار والے غذائی نمونے اور پہلے رجونورتی کی شروعات شامل ہے۔"
        },
        category: "overview",
        order: 2,
        isActive: true
      }
    ];

    sections.forEach(section => {
      const id = this.currentId++;
      this.contentSections.set(id, { ...section, id, order: section.order || 0 });
    });

    // Seed resources
    const resourcesData = [
      {
        title: {
          en: "Calcium-Rich Foods Guide",
          hi: "कैल्शियम युक्त खाद्य पदार्थों की गाइड",
          bn: "ক্যালসিয়াম সমৃদ্ধ খাবারের গাইড",
          pa: "ਕੈਲਸੀਅਮ ਭਰਪੂਰ ਭੋਜਨ ਦੀ ਗਾਈਡ",
          ta: "கால்சியம் நிறைந்த உணவுகளின் வழிகாட்டி",
          te: "కాల్షియం అధికంగా ఉన్న ఆహారాల గైడ్",
          ur: "کیلسیم سے بھرپور غذاؤں کی رہنمائی"
        },
        description: {
          en: "Comprehensive guide to calcium-rich foods specifically for Asian diets",
          hi: "एशियाई आहार के लिए विशेष रूप से कैल्शियम युक्त खाद्य पदार्थों की व्यापक गाइड",
          bn: "এশিয়ান খাদ্যের জন্য বিশেষভাবে ক্যালসিয়াম সমৃদ্ধ খাবারের ব্যাপক গাইড",
          pa: "ਏਸ਼ੀਆਈ ਖੁਰਾਕ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਕੈਲਸੀਅਮ ਭਰਪੂਰ ਭੋਜਨ ਦੀ ਵਿਆਪਕ ਗਾਈਡ",
          ta: "ஆசிய உணவுகளுக்கு குறிப்பாக கால்சியம் நிறைந்த உணவுகளின் விரிவான வழிகாட்டி",
          te: "ఆసియా ఆహారాలకు ప్రత్యేకంగా కాల్షియం అధికంగా ఉన్న ఆహారాల సమగ్ర గైడ్",
          ur: "ایشیائی غذاؤں کے لیے خاص طور پر کیلسیم سے بھرپور غذاؤں کی جامع رہنمائی"
        },
        type: "document",
        url: "/resources/calcium-guide.pdf",
        category: "nutrition",
        tags: ["calcium", "nutrition", "diet", "asian-foods"],
        isActive: true
      }
    ];

    resourcesData.forEach(resource => {
      const id = this.currentId++;
      this.resources.set(id, { ...resource, id, url: resource.url || null });
    });

    // Seed healthcare providers
    const providers = [
      {
        name: "Dr. Priya Sharma",
        specialization: "Endocrinologist",
        address: "123 Main St, City, State 12345",
        phone: "(555) 123-4567",
        email: "priya.sharma@healthcenter.com",
        languages: ["en", "hi", "pa"],
        acceptsInsurance: true,
        isActive: true
      },
      {
        name: "Dr. Li Wei Chen",
        specialization: "Rheumatologist",
        address: "456 Oak Ave, City, State 12345",
        phone: "(555) 234-5678",
        email: "liwei.chen@boneclinic.com",
        languages: ["en", "zh"],
        acceptsInsurance: true,
        isActive: true
      }
    ];

    providers.forEach(provider => {
      const id = this.currentId++;
      this.healthcareProviders.set(id, { 
        ...provider, 
        id, 
        email: provider.email || null,
        phone: provider.phone || null,
        acceptsInsurance: provider.acceptsInsurance ?? true
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getContentSections(category?: string): Promise<ContentSection[]> {
    const sections = Array.from(this.contentSections.values()).filter(s => s.isActive);
    if (category) {
      return sections.filter(s => s.category === category);
    }
    return sections.sort((a, b) => a.order - b.order);
  }

  async getContentSection(sectionKey: string): Promise<ContentSection | undefined> {
    return Array.from(this.contentSections.values()).find(s => s.sectionKey === sectionKey && s.isActive);
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const id = this.currentId++;
    const newSection: ContentSection = { ...section, id, order: section.order || 0, isActive: section.isActive ?? true };
    this.contentSections.set(id, newSection);
    return newSection;
  }

  async updateContentSection(id: number, section: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const existing = this.contentSections.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...section };
    this.contentSections.set(id, updated);
    return updated;
  }

  async getResources(category?: string, type?: string): Promise<Resource[]> {
    const resources = Array.from(this.resources.values()).filter(r => r.isActive);
    let filtered = resources;
    
    if (category) {
      filtered = filtered.filter(r => r.category === category);
    }
    
    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }
    
    return filtered;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.currentId++;
    const newResource: Resource = { ...resource, id, url: resource.url || null, isActive: resource.isActive ?? true };
    this.resources.set(id, newResource);
    return newResource;
  }

  async searchResources(query: string, language = 'en'): Promise<Resource[]> {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.resources.values()).filter(resource => {
      if (!resource.isActive) return false;
      
      const title = (resource.title as any)[language] || (resource.title as any).en;
      const description = (resource.description as any)[language] || (resource.description as any).en;
      const tags = resource.tags as string[];
      
      return (
        title.toLowerCase().includes(lowercaseQuery) ||
        description.toLowerCase().includes(lowercaseQuery) ||
        tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    });
  }

  async getHealthcareProviders(language?: string): Promise<HealthcareProvider[]> {
    const providers = Array.from(this.healthcareProviders.values()).filter(p => p.isActive);
    
    if (language) {
      return providers.filter(p => (p.languages as string[]).includes(language));
    }
    
    return providers;
  }

  async getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined> {
    return this.healthcareProviders.get(id);
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const id = this.currentId++;
    const newProvider: HealthcareProvider = { 
      ...provider, 
      id,
      email: provider.email || null,
      phone: provider.phone || null,
      acceptsInsurance: provider.acceptsInsurance ?? true,
      isActive: provider.isActive ?? true
    };
    this.healthcareProviders.set(id, newProvider);
    return newProvider;
  }

  async createRiskAssessment(assessment: InsertRiskAssessment): Promise<RiskAssessment> {
    const id = this.currentId++;
    const newAssessment: RiskAssessment = { ...assessment, id };
    this.riskAssessments.set(id, newAssessment);
    return newAssessment;
  }

  async getRiskAssessment(sessionId: string): Promise<RiskAssessment | undefined> {
    return Array.from(this.riskAssessments.values()).find(a => a.sessionId === sessionId);
  }

  // Translation management methods for MemStorage
  async getTranslationKeys(category?: string): Promise<TranslationKey[]> {
    const keys = Array.from(this.translationKeysMap.values());
    if (category) {
      return keys.filter(k => k.category === category);
    }
    return keys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTranslationKey(id: number): Promise<TranslationKey | undefined> {
    return this.translationKeysMap.get(id);
  }

  async createTranslationKey(key: InsertTranslationKey): Promise<TranslationKey> {
    const id = this.currentId++;
    const now = new Date();
    const newKey: TranslationKey = { 
      ...key, 
      id, 
      context: key.context || null,
      createdAt: now,
      updatedAt: now
    };
    this.translationKeysMap.set(id, newKey);
    return newKey;
  }

  async updateTranslationKey(id: number, key: Partial<InsertTranslationKey>): Promise<TranslationKey | undefined> {
    const existing = this.translationKeysMap.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...key, updatedAt: new Date() };
    this.translationKeysMap.set(id, updated);
    return updated;
  }

  async deleteTranslationKey(id: number): Promise<boolean> {
    return this.translationKeysMap.delete(id);
  }

  async getTranslations(keyId?: number, languageCode?: string): Promise<Translation[]> {
    const translations = Array.from(this.translationsMap.values());
    
    if (keyId && languageCode) {
      return translations.filter(t => t.keyId === keyId && t.languageCode === languageCode);
    } else if (keyId) {
      return translations.filter(t => t.keyId === keyId);
    } else if (languageCode) {
      return translations.filter(t => t.languageCode === languageCode);
    }
    
    return translations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getTranslation(keyId: number, languageCode: string): Promise<Translation | undefined> {
    return Array.from(this.translationsMap.values()).find(
      t => t.keyId === keyId && t.languageCode === languageCode
    );
  }

  async createTranslation(translation: InsertTranslation): Promise<Translation> {
    const id = this.currentId++;
    const now = new Date();
    const newTranslation: Translation = { 
      ...translation, 
      id,
      status: translation.status || 'pending',
      translatorNotes: translation.translatorNotes || null,
      reviewerNotes: translation.reviewerNotes || null,
      createdAt: now,
      updatedAt: now
    };
    this.translationsMap.set(id, newTranslation);
    return newTranslation;
  }

  async updateTranslation(id: number, translation: Partial<InsertTranslation>): Promise<Translation | undefined> {
    const existing = this.translationsMap.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...translation, updatedAt: new Date() };
    this.translationsMap.set(id, updated);
    return updated;
  }

  async deleteTranslation(id: number): Promise<boolean> {
    return this.translationsMap.delete(id);
  }

  async getTranslationProjects(): Promise<TranslationProject[]> {
    return Array.from(this.translationProjectsMap.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTranslationProject(project: InsertTranslationProject): Promise<TranslationProject> {
    const id = this.currentId++;
    const now = new Date();
    const newProject: TranslationProject = { 
      ...project, 
      id,
      status: project.status || 'active',
      description: project.description || null,
      createdAt: now,
      updatedAt: now
    };
    this.translationProjectsMap.set(id, newProject);
    return newProject;
  }

  async updateTranslationProject(id: number, project: Partial<InsertTranslationProject>): Promise<TranslationProject | undefined> {
    const existing = this.translationProjectsMap.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...project, updatedAt: new Date() };
    this.translationProjectsMap.set(id, updated);
    return updated;
  }

  async exportTranslations(languageCode?: string): Promise<any> {
    const translations = Array.from(this.translationsMap.values());
    const keys = Array.from(this.translationKeysMap.values());
    
    const results = translations
      .filter(t => !languageCode || t.languageCode === languageCode)
      .map(t => {
        const key = keys.find(k => k.id === t.keyId);
        return {
          keyName: key?.keyName,
          sourceText: key?.sourceText,
          translatedText: t.translatedText,
          languageCode: t.languageCode,
          status: t.status,
          category: key?.category,
          context: key?.context
        };
      });
    
    return results;
  }

  async importTranslations(data: any): Promise<{ success: number; errors: string[] }> {
    const results = { success: 0, errors: [] as string[] };
    
    for (const item of data) {
      try {
        // Check if translation key exists
        let existingKey = Array.from(this.translationKeysMap.values()).find(k => k.keyName === item.keyName);
        
        if (!existingKey) {
          // Create new translation key
          existingKey = await this.createTranslationKey({
            keyName: item.keyName,
            sourceText: item.sourceText,
            category: item.category || 'imported',
            context: item.context
          });
        }
        
        // Check if translation already exists
        const existingTranslation = await this.getTranslation(existingKey.id, item.languageCode);
        
        if (existingTranslation) {
          // Update existing translation
          await this.updateTranslation(existingTranslation.id, {
            translatedText: item.translatedText,
            status: item.status || 'pending'
          });
        } else {
          // Create new translation
          await this.createTranslation({
            keyId: existingKey.id,
            languageCode: item.languageCode,
            translatedText: item.translatedText,
            status: item.status || 'pending'
          });
        }
        
        results.success++;
      } catch (error) {
        results.errors.push(`Failed to import ${item.keyName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return results;
  }
}

// Use MemStorage temporarily while database connection is being fixed
export const storage = new MemStorage();
