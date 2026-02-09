/**
 * Validation schemas using built-in TypeScript types
 * Zod not needed - using native TypeScript for minimal dependencies
 */

// ============ USER SCHEMAS ============

export interface CreateUserInput {
  email: string;
  credits?: number;
}

export function validateCreateUser(data: unknown): CreateUserInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  if (typeof obj.email !== "string" || !obj.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return null;
  }
  
  const credits = obj.credits ? Number(obj.credits) : 0;
  if (isNaN(credits) || credits < 0) {
    return null;
  }
  
  return {
    email: obj.email,
    credits: credits || 0,
  };
}

// ============ AI MODEL SCHEMAS (ENHANCED) ============

// Supported enum values - keep in sync with Prisma schema
export const AI_PROVIDERS = [
  "OPENAI", "GEMINI", "KLING", "ANTHROPIC", 
  "MISTRAL", "COHERE", "STABILITY", 
  "HUGGINGFACE", "CUSTOM"
] as const;

export const AI_MODEL_TYPES = [
  "LLM", "IMAGE", "VIDEO", "AUDIO", "EMBEDDING", "MULTIMODAL"
] as const;

export const PRICING_MODEL_TYPES = [
  "PER_REQUEST", "PER_TOKEN", "PER_SECOND", "PER_IMAGE", "TIERED"
] as const;

export const MODEL_CAPABILITIES = [
  "vision", "function_calling", "streaming", "json_mode", 
  "system_prompts", "tools", "image_input", "audio_input",
  "video_input", "code_execution", "web_search"
] as const;

export const IMAGE_SIZES = [
  "256x256", "512x512", "1024x1024", "1024x1792", 
  "1792x1024", "2048x2048", "custom"
] as const;

export const IMAGE_FORMATS = ["png", "jpg", "jpeg", "webp", "gif"] as const;

export const PLAN_TIERS = ["free", "starter", "pro", "business", "enterprise"] as const;

export type AiProvider = typeof AI_PROVIDERS[number];
export type AiModelType = typeof AI_MODEL_TYPES[number];
export type PricingModelType = typeof PRICING_MODEL_TYPES[number];

export interface CreateAiModelInput {
  // Core identification
  name: string;
  apiIdentifier: string;
  provider: AiProvider;
  modelType: AiModelType;
  
  // Basic configuration
  creditCost: number;
  description?: string;
  imageUrl?: string;
  apiKey?: string;
  baseUrl?: string;
  config?: Record<string, unknown>;
  isActive?: boolean;
  
  // Pricing configuration
  pricingModel?: PricingModelType;
  inputTokenCost?: number;
  outputTokenCost?: number;
  
  // Rate limits
  maxRequestsPerMinute?: number;
  maxRequestsPerDay?: number;
  maxTokensPerRequest?: number;
  maxImagesPerRequest?: number;
  
  // Capabilities
  capabilities?: string[];
  supportedSizes?: string[];
  supportedFormats?: string[];
  maxInputLength?: number;
  contextWindow?: number;
  
  // Quality settings
  defaultQuality?: string;
  defaultStyle?: string;
  priority?: number;
  
  // Access control
  requiredPlanTier?: string;
  isPublic?: boolean;
  isBeta?: boolean;
  isDeprecated?: boolean;
  
  // Metadata
  version?: string;
  releaseNotes?: string;
  documentationUrl?: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Production-grade validation for AI Model creation/update
 * Returns detailed error messages for each invalid field
 */
export function validateCreateAiModel(data: unknown): ValidationResult<CreateAiModelInput> {
  const errors: Record<string, string> = {};
  
  if (typeof data !== "object" || data === null) {
    return { success: false, errors: { _form: "Invalid input data" } };
  }
  
  const obj = data as Record<string, unknown>;
  
  // === REQUIRED FIELDS ===
  
  // Name validation
  const name = obj.name;
  if (typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (name.length > 100) {
    errors.name = "Name must not exceed 100 characters";
  }
  
  // API Identifier validation
  const apiIdentifier = obj.apiIdentifier;
  if (typeof apiIdentifier !== "string" || apiIdentifier.trim().length < 1) {
    errors.apiIdentifier = "API Identifier is required";
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(apiIdentifier)) {
    errors.apiIdentifier = "API Identifier can only contain letters, numbers, dots, dashes, and underscores";
  } else if (apiIdentifier.length > 100) {
    errors.apiIdentifier = "API Identifier must not exceed 100 characters";
  }
  
  // Provider validation
  const provider = obj.provider;
  if (!AI_PROVIDERS.includes(provider as AiProvider)) {
    errors.provider = `Provider must be one of: ${AI_PROVIDERS.join(", ")}`;
  }
  
  // Model Type validation
  const modelType = obj.modelType;
  if (!AI_MODEL_TYPES.includes(modelType as AiModelType)) {
    errors.modelType = `Model type must be one of: ${AI_MODEL_TYPES.join(", ")}`;
  }
  
  // Credit Cost validation
  const creditCost = Number(obj.creditCost);
  if (isNaN(creditCost) || creditCost < 0) {
    errors.creditCost = "Credit cost must be a non-negative number";
  } else if (creditCost > 10000) {
    errors.creditCost = "Credit cost seems too high (max 10,000)";
  }
  
  // === OPTIONAL FIELDS ===
  
  // Description
  const description = obj.description;
  if (description !== undefined && typeof description !== "string") {
    errors.description = "Description must be a string";
  } else if (typeof description === "string" && description.length > 1000) {
    errors.description = "Description must not exceed 1000 characters";
  }
  
  // Image URL
  const imageUrl = obj.imageUrl;
  if (imageUrl !== undefined && imageUrl !== "" && typeof imageUrl === "string") {
    if (!isValidUrl(imageUrl)) {
      errors.imageUrl = "Image URL must be a valid URL";
    }
  }
  
  // Base URL
  const baseUrl = obj.baseUrl;
  if (baseUrl !== undefined && baseUrl !== "" && typeof baseUrl === "string") {
    if (!isValidUrl(baseUrl)) {
      errors.baseUrl = "Base URL must be a valid URL";
    }
  }
  
  // Documentation URL
  const documentationUrl = obj.documentationUrl;
  if (documentationUrl !== undefined && documentationUrl !== "" && typeof documentationUrl === "string") {
    if (!isValidUrl(documentationUrl)) {
      errors.documentationUrl = "Documentation URL must be a valid URL";
    }
  }
  
  // Pricing Model
  const pricingModel = obj.pricingModel;
  if (pricingModel !== undefined && !PRICING_MODEL_TYPES.includes(pricingModel as PricingModelType)) {
    errors.pricingModel = `Pricing model must be one of: ${PRICING_MODEL_TYPES.join(", ")}`;
  }
  
  // Token costs
  const inputTokenCost = obj.inputTokenCost !== undefined ? Number(obj.inputTokenCost) : undefined;
  if (inputTokenCost !== undefined && (isNaN(inputTokenCost) || inputTokenCost < 0)) {
    errors.inputTokenCost = "Input token cost must be a non-negative number";
  }
  
  const outputTokenCost = obj.outputTokenCost !== undefined ? Number(obj.outputTokenCost) : undefined;
  if (outputTokenCost !== undefined && (isNaN(outputTokenCost) || outputTokenCost < 0)) {
    errors.outputTokenCost = "Output token cost must be a non-negative number";
  }
  
  // Rate limits
  const maxRequestsPerMinute = obj.maxRequestsPerMinute !== undefined ? Number(obj.maxRequestsPerMinute) : undefined;
  if (maxRequestsPerMinute !== undefined && (isNaN(maxRequestsPerMinute) || maxRequestsPerMinute < 1 || maxRequestsPerMinute > 10000)) {
    errors.maxRequestsPerMinute = "Requests per minute must be between 1 and 10,000";
  }
  
  const maxRequestsPerDay = obj.maxRequestsPerDay !== undefined ? Number(obj.maxRequestsPerDay) : undefined;
  if (maxRequestsPerDay !== undefined && (isNaN(maxRequestsPerDay) || maxRequestsPerDay < 1 || maxRequestsPerDay > 1000000)) {
    errors.maxRequestsPerDay = "Requests per day must be between 1 and 1,000,000";
  }
  
  const maxTokensPerRequest = obj.maxTokensPerRequest !== undefined ? Number(obj.maxTokensPerRequest) : undefined;
  if (maxTokensPerRequest !== undefined && (isNaN(maxTokensPerRequest) || maxTokensPerRequest < 1)) {
    errors.maxTokensPerRequest = "Max tokens must be a positive number";
  }
  
  const contextWindow = obj.contextWindow !== undefined ? Number(obj.contextWindow) : undefined;
  if (contextWindow !== undefined && (isNaN(contextWindow) || contextWindow < 1)) {
    errors.contextWindow = "Context window must be a positive number";
  }
  
  const maxInputLength = obj.maxInputLength !== undefined ? Number(obj.maxInputLength) : undefined;
  if (maxInputLength !== undefined && (isNaN(maxInputLength) || maxInputLength < 1)) {
    errors.maxInputLength = "Max input length must be a positive number";
  }
  
  // Capabilities array
  const capabilities = obj.capabilities;
  if (capabilities !== undefined && !Array.isArray(capabilities)) {
    errors.capabilities = "Capabilities must be an array";
  }
  
  // Supported sizes array
  const supportedSizes = obj.supportedSizes;
  if (supportedSizes !== undefined && !Array.isArray(supportedSizes)) {
    errors.supportedSizes = "Supported sizes must be an array";
  }
  
  // Supported formats array
  const supportedFormats = obj.supportedFormats;
  if (supportedFormats !== undefined && !Array.isArray(supportedFormats)) {
    errors.supportedFormats = "Supported formats must be an array";
  }
  
  // Priority
  const priority = obj.priority !== undefined ? Number(obj.priority) : undefined;
  if (priority !== undefined && (isNaN(priority) || priority < 0 || priority > 1000)) {
    errors.priority = "Priority must be between 0 and 1000";
  }
  
  // Required plan tier
  const requiredPlanTier = obj.requiredPlanTier;
  if (requiredPlanTier !== undefined && requiredPlanTier !== "" && !PLAN_TIERS.includes(requiredPlanTier as any)) {
    errors.requiredPlanTier = `Plan tier must be one of: ${PLAN_TIERS.join(", ")}`;
  }
  
  // Version format
  const version = obj.version;
  if (version !== undefined && typeof version === "string" && version.length > 20) {
    errors.version = "Version must not exceed 20 characters";
  }
  
  // Config JSON validation
  const config = obj.config;
  if (config !== undefined && typeof config !== "object") {
    errors.config = "Config must be a valid JSON object";
  }
  
  // Return errors if any
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }
  
  // Build validated input
  const validatedInput: CreateAiModelInput = {
    name: (name as string).trim(),
    apiIdentifier: (apiIdentifier as string).trim(),
    provider: provider as AiProvider,
    modelType: modelType as AiModelType,
    creditCost,
    description: typeof description === "string" ? description.trim() : undefined,
    imageUrl: typeof imageUrl === "string" && imageUrl ? imageUrl.trim() : undefined,
    apiKey: typeof obj.apiKey === "string" && obj.apiKey ? obj.apiKey : undefined,
    baseUrl: typeof baseUrl === "string" && baseUrl ? baseUrl.trim() : undefined,
    config: typeof config === "object" ? config as Record<string, unknown> : undefined,
    isActive: obj.isActive === true || obj.isActive === "true" || obj.isActive === "on",
    pricingModel: pricingModel as PricingModelType | undefined,
    inputTokenCost,
    outputTokenCost,
    maxRequestsPerMinute,
    maxRequestsPerDay,
    maxTokensPerRequest: maxTokensPerRequest || undefined,
    maxImagesPerRequest: obj.maxImagesPerRequest !== undefined ? Number(obj.maxImagesPerRequest) : undefined,
    capabilities: Array.isArray(capabilities) ? capabilities.filter(c => typeof c === "string") : undefined,
    supportedSizes: Array.isArray(supportedSizes) ? supportedSizes.filter(s => typeof s === "string") : undefined,
    supportedFormats: Array.isArray(supportedFormats) ? supportedFormats.filter(f => typeof f === "string") : undefined,
    maxInputLength,
    contextWindow: contextWindow || undefined,
    defaultQuality: typeof obj.defaultQuality === "string" ? obj.defaultQuality : undefined,
    defaultStyle: typeof obj.defaultStyle === "string" ? obj.defaultStyle : undefined,
    priority,
    requiredPlanTier: typeof requiredPlanTier === "string" && requiredPlanTier ? requiredPlanTier : undefined,
    isPublic: obj.isPublic !== false && obj.isPublic !== "false",
    isBeta: obj.isBeta === true || obj.isBeta === "true" || obj.isBeta === "on",
    isDeprecated: obj.isDeprecated === true || obj.isDeprecated === "true" || obj.isDeprecated === "on",
    version: typeof version === "string" ? version.trim() : undefined,
    releaseNotes: typeof obj.releaseNotes === "string" ? obj.releaseNotes.trim() : undefined,
    documentationUrl: typeof documentationUrl === "string" && documentationUrl ? documentationUrl.trim() : undefined,
  };
  
  return { success: true, data: validatedInput };
}

/**
 * Helper to validate URL format
 */
function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Helper to format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string>): string {
  return Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join("; ");
}

/**
 * Get provider display configuration
 */
export function getProviderConfig(provider: AiProvider) {
  const configs: Record<AiProvider, { label: string; color: string; icon: string }> = {
    OPENAI: { label: "OpenAI", color: "success", icon: "sparkles" },
    GEMINI: { label: "Google Gemini", color: "info", icon: "bot" },
    KLING: { label: "Kling AI", color: "primary", icon: "video" },
    ANTHROPIC: { label: "Anthropic", color: "warning", icon: "brain" },
    MISTRAL: { label: "Mistral AI", color: "purple", icon: "wind" },
    COHERE: { label: "Cohere", color: "orange", icon: "layers" },
    STABILITY: { label: "Stability AI", color: "pink", icon: "image" },
    HUGGINGFACE: { label: "Hugging Face", color: "yellow", icon: "smile" },
    CUSTOM: { label: "Custom", color: "muted", icon: "settings" },
  };
  return configs[provider] || configs.CUSTOM;
}

/**
 * Get model type display configuration
 */
export function getModelTypeConfig(modelType: AiModelType) {
  const configs: Record<AiModelType, { label: string; icon: string }> = {
    LLM: { label: "Text & Chat", icon: "message-square" },
    IMAGE: { label: "Image Generation", icon: "image" },
    VIDEO: { label: "Video Generation", icon: "video" },
    AUDIO: { label: "Audio Generation", icon: "volume-2" },
    EMBEDDING: { label: "Embeddings", icon: "hash" },
    MULTIMODAL: { label: "Multimodal", icon: "layers" },
  };
  return configs[modelType] || configs.LLM;
}

// ============ ADMIN SCHEMAS ============

export interface CreateAdminUserInput {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "READ_ONLY";
  permissions?: string[];
}

export function validateCreateAdminUser(data: unknown): CreateAdminUserInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const userId = obj.userId;
  const email = obj.email;
  const role = obj.role;
  
  if (typeof userId !== "string" || userId.length < 1) return null;
  if (typeof email !== "string" || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return null;
  if (!["SUPER_ADMIN", "ADMIN", "SUPPORT", "READ_ONLY"].includes(role as string)) return null;
  
  const permissions = Array.isArray(obj.permissions)
    ? obj.permissions.filter((p) => typeof p === "string")
    : [];
  
  return {
    userId,
    email,
    role: role as "SUPER_ADMIN" | "ADMIN" | "SUPPORT" | "READ_ONLY",
    permissions: permissions.length > 0 ? permissions : undefined,
  };
}

// ============ PRICING PLAN SCHEMAS ============

export interface CreatePricingPlanInput {
  name: string;
  price: number;
  credits: number;
  features: string[];
  description?: string;
  isPopular?: boolean;
  isActive?: boolean;
}

export function validateCreatePricingPlan(data: unknown): CreatePricingPlanInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const name = obj.name;
  const price = Number(obj.price);
  const credits = Number(obj.credits);
  const features = obj.features;
  
  if (typeof name !== "string" || name.length < 1) return null;
  if (isNaN(price) || price < 0) return null;
  if (isNaN(credits) || credits < 0) return null;
  if (!Array.isArray(features) || features.some((f) => typeof f !== "string")) return null;
  
  return {
    name,
    price,
    credits,
    features: features as string[],
    description: typeof obj.description === "string" ? obj.description : undefined,
    isPopular: obj.isPopular === true,
    isActive: obj.isActive !== false,
  };
}

// ============ ANALYTICS SCHEMAS ============

export interface CreateAnalyticsRecordInput {
  date: Date;
  revenue: number;
  creditUsage: number;
  generations: number;
  activeUsers: number;
}

export function validateCreateAnalyticsRecord(data: unknown): CreateAnalyticsRecordInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const date = obj.date instanceof Date ? obj.date : new Date(obj.date as string);
  const revenue = Number(obj.revenue ?? obj.totalRevenue);
  const creditUsage = Number(obj.creditUsage ?? obj.totalCreditsUsed);
  const generations = Number(obj.generations ?? obj.totalGenerations);
  const activeUsers = Number(obj.activeUsers);
  
  if (isNaN(date.getTime())) return null;
  if (isNaN(revenue) || revenue < 0) return null;
  if (isNaN(creditUsage) || creditUsage < 0) return null;
  if (isNaN(generations) || generations < 0) return null;
  if (isNaN(activeUsers) || activeUsers < 0) return null;
  
  return {
    date,
    revenue,
    creditUsage,
    generations,
    activeUsers,
  };
}

// ============ MODERATION SCHEMAS ============

export interface CreateModerationInput {
  userId: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isBlocked?: boolean;
}

export function validateCreateModeration(data: unknown): CreateModerationInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const userId = obj.userId;
  const reason = obj.reason;
  const severity = obj.severity;
  
  if (typeof userId !== "string" || userId.length < 1) return null;
  if (typeof reason !== "string" || reason.length < 1) return null;
  if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity as string)) return null;
  
  return {
    userId,
    reason,
    severity: severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    isBlocked: obj.isBlocked === true,
  };
}

// ============ FEATURE FLAG SCHEMAS ============

export interface CreateFeatureFlagInput {
  name: string;
  description?: string;
  isEnabled: boolean;
  rolloutPercentage?: number;
}

export function validateCreateFeatureFlag(data: unknown): CreateFeatureFlagInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const name = obj.name;
  const isEnabled = obj.isEnabled;
  
  if (typeof name !== "string" || name.length < 1) return null;
  if (typeof isEnabled !== "boolean") return null;
  
  const rolloutPercentage = obj.rolloutPercentage ? Number(obj.rolloutPercentage) : 100;
  if (isNaN(rolloutPercentage) || rolloutPercentage < 0 || rolloutPercentage > 100) return null;
  
  return {
    name,
    description: typeof obj.description === "string" ? obj.description : undefined,
    isEnabled,
    rolloutPercentage,
  };
}

// ============ GLOBAL SETTINGS SCHEMAS ============

export interface UpdateGlobalSettingsInput {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  supportEmail?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;
  heroBadge?: string;
  featureTitle?: string;
  isMaintenance?: boolean;
  isFreeGenerationEnabled?: boolean;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
}

export function validateUpdateGlobalSettings(data: unknown): UpdateGlobalSettingsInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  const result: Partial<UpdateGlobalSettingsInput> = {};
  
  // Validate optional string fields
  const stringFields = [
    "siteName",
    "siteDescription",
    "siteUrl",
    "supportEmail",
    "heroTitle",
    "heroHighlight",
    "heroDescription",
    "heroBadge",
    "featureTitle",
    "stripePublishableKey",
    "stripeSecretKey",
    "stripeWebhookSecret",
  ];
  
  for (const field of stringFields) {
    if (field in obj && typeof obj[field] === "string") {
      (result as Record<string, unknown>)[field] = obj[field];
    }
  }
  
  // Validate optional boolean fields
  if ("isMaintenance" in obj && typeof obj.isMaintenance === "boolean") {
    result.isMaintenance = obj.isMaintenance;
  }
  
  if ("isFreeGenerationEnabled" in obj && typeof obj.isFreeGenerationEnabled === "boolean") {
    result.isFreeGenerationEnabled = obj.isFreeGenerationEnabled;
  }
  
  return result;
}

// ============ CHAT SCHEMAS ============

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface CreateChatInput {
  messages: ChatMessageInput[];
  modelId: string;
}

export function validateCreateChat(data: unknown): CreateChatInput | null {
  if (typeof data !== "object" || data === null) return null;
  
  const obj = data as Record<string, unknown>;
  
  const messages = obj.messages;
  const modelId = obj.modelId;
  
  if (typeof modelId !== "string" || modelId.length < 1) return null;
  
  if (!Array.isArray(messages) || messages.length < 1) return null;
  
  const validMessages: ChatMessageInput[] = [];
  for (const msg of messages) {
    if (typeof msg !== "object" || msg === null) return null;
    
    const m = msg as Record<string, unknown>;
    if (!["user", "assistant"].includes(m.role as string)) return null;
    if (typeof m.content !== "string" || m.content.length < 1) return null;
    
    validMessages.push({
      role: m.role as "user" | "assistant",
      content: m.content,
    });
  }
  
  return {
    messages: validMessages,
    modelId,
  };
}

// ============ ERROR RESPONSE SCHEMA ============

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export function createErrorResponse(
  message: string,
  code?: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    error: message,
    code,
    details,
  };
}

// ============ SUCCESS RESPONSE SCHEMA ============

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data?: T;
}

export function createSuccessResponse<T = unknown>(data?: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
  };
}
