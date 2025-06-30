import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("free").notNull(), // free, premium_monthly, premium_yearly
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("active").notNull(), // active, canceled, past_due
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personal Dashboard Access Tokens
export const personalAccessTokens = pgTable("personal_access_tokens", {
  id: text("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  permissions: jsonb("permissions").default([]).notNull(), // Array of permissions like ['premium', 'admin']
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Discord bots table
export const bots = pgTable("bots", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  token: varchar("token").notNull(),
  avatarUrl: varchar("avatar_url"),
  status: varchar("status").notNull().default("offline"), // online, offline, idle
  serverCount: integer("server_count").default(0),
  userCount: integer("user_count").default(0),
  ownerId: varchar("owner_id").notNull(),
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false), // premium features enabled
  botType: varchar("bot_type").default("custom").notNull(), // custom, standard
  serverType: varchar("server_type"), // gaming, business, community, support, education, creative
  features: text("features").array(), // Array of selected feature IDs
  prefix: varchar("prefix").default("!"), // Command prefix
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Standard Discord Bot Configuration
export const standardBot = pgTable("standard_bot", {
  id: serial("id").primaryKey(),
  name: varchar("name").default("BotCentral Bot").notNull(),
  clientId: varchar("client_id").notNull(),
  token: varchar("token").notNull(),
  isActive: boolean("is_active").default(true),
  version: varchar("version").default("1.0.0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User custom bot configurations
export const userCustomBots = pgTable("user_custom_bots", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  guildId: varchar("guild_id").notNull(),
  customBotToken: varchar("custom_bot_token").notNull(),
  botName: varchar("bot_name").notNull(),
  botAvatarUrl: varchar("bot_avatar_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scheduled messages table for automation
export const scheduledMessages = pgTable("scheduled_messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  guildId: varchar("guild_id").notNull(),
  channelId: varchar("channel_id").notNull(),
  message: text("message").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  repeatType: varchar("repeat_type"), // 'daily', 'weekly', 'monthly', 'once'
  isActive: boolean("is_active").default(true),
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bot Features (what's available for free vs premium)
export const botFeatures = pgTable("bot_features", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  isPremium: boolean("is_premium").default(false),
  category: varchar("category").notNull(), // moderation, automation, analytics, entertainment
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User-Bot subscriptions for the standard bot
export const userStandardBotSubscriptions = pgTable("user_standard_bot_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  guildId: varchar("guild_id").notNull(), // Discord server ID
  subscriptionTier: varchar("subscription_tier").default("free").notNull(), // free, premium
  isActive: boolean("is_active").default(true),
  addedAt: timestamp("added_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  attendeeCount: integer("attendee_count").default(0),
  maxAttendees: integer("max_attendees"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community announcements table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").notNull(),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id"),
  action: varchar("action").notNull(),
  description: text("description").notNull(),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Leaderboard entries table
export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  username: varchar("username").notNull(),
  score: integer("score").notNull(),
  category: varchar("category").notNull(), // messages, events_created, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Polls table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  allowMultipleVotes: boolean("allow_multiple_votes").notNull().default(false),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  category: varchar("category").notNull().default("general"), // "general", "community", "events", "features"
  discordChannelId: varchar("discord_channel_id"),
  discordWebhookUrl: varchar("discord_webhook_url"),
  postToDiscord: boolean("post_to_discord").notNull().default(false),
  discordMessageId: varchar("discord_message_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Poll options table
export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  text: varchar("text").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Poll votes table
export const pollVotes = pgTable("poll_votes", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull().references(() => polls.id, { onDelete: "cascade" }),
  optionId: integer("option_id").notNull().references(() => pollOptions.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  // Ensure one vote per user per poll (unless multiple votes allowed)
  index("unique_user_poll_vote").on(table.userId, table.pollId)
]);

// Discord channels configuration table
export const discordChannels = pgTable("discord_channels", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id").notNull(),
  channelId: varchar("channel_id").notNull(),
  channelName: varchar("channel_name").notNull(),
  channelType: varchar("channel_type").notNull(), // "polls", "announcements", "events", "general"
  webhookUrl: varchar("webhook_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("unique_guild_channel_type").on(table.guildId, table.channelType)
]);

// User roles and permissions table
export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").notNull(), // "admin", "moderator", "member", "banned"
  guildId: varchar("guild_id"), // For Discord server-specific roles
  permissions: text("permissions").array(), // Array of permission strings
  assignedBy: varchar("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
}, (table) => [
  index("unique_user_guild_role").on(table.userId, table.guildId)
]);

// Moderation logs table
export const moderationLogs = pgTable("moderation_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action").notNull(), // "warn", "mute", "kick", "ban", "delete_message", "filter_triggered"
  targetUserId: varchar("target_user_id").references(() => users.id),
  moderatorId: varchar("moderator_id").references(() => users.id),
  reason: text("reason"),
  details: text("details"), // Additional context or automated filter details
  severity: varchar("severity").notNull().default("low"), // "low", "medium", "high", "critical"
  guildId: varchar("guild_id"),
  channelId: varchar("channel_id"),
  messageId: varchar("message_id"),
  duration: integer("duration"), // Duration in minutes for temporary actions
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("moderation_target_user").on(table.targetUserId),
  index("moderation_moderator").on(table.moderatorId),
  index("moderation_action").on(table.action)
]);

// Content filters table
export const contentFilters = pgTable("content_filters", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  filterType: varchar("filter_type").notNull(), // "word", "regex", "link", "spam", "toxicity"
  pattern: text("pattern").notNull(), // The actual filter pattern
  action: varchar("action").notNull().default("warn"), // "warn", "delete", "flag", "auto_moderate"
  severity: varchar("severity").notNull().default("medium"),
  isActive: boolean("is_active").notNull().default(true),
  guildId: varchar("guild_id"), // For server-specific filters
  whitelist: text("whitelist").array(), // Exempt words/patterns
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reports table for user-reported content
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reportedUserId: varchar("reported_user_id").references(() => users.id),
  reporterUserId: varchar("reporter_user_id").references(() => users.id),
  contentType: varchar("content_type").notNull(), // "message", "poll", "event", "user"
  contentId: varchar("content_id"), // ID of the reported content
  reason: varchar("reason").notNull(), // "spam", "harassment", "inappropriate", "other"
  description: text("description"),
  status: varchar("status").notNull().default("pending"), // "pending", "investigating", "resolved", "dismissed"
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  guildId: varchar("guild_id"),
  channelId: varchar("channel_id"),
  messageId: varchar("message_id"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
}, (table) => [
  index("reports_status").on(table.status),
  index("reports_assigned").on(table.assignedTo)
]);

// Automation rules table for auto-moderation
export const automationRules = pgTable("automation_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  triggerType: varchar("trigger_type").notNull(), // "message_sent", "user_joined", "role_added", "reaction_added", "time_based"
  triggerConditions: text("trigger_conditions").notNull(), // JSON object with conditions
  actions: text("actions").array().notNull(), // Array of actions to execute
  actionSettings: text("action_settings"), // JSON object with action-specific settings
  isActive: boolean("is_active").notNull().default(true),
  guildId: varchar("guild_id"),
  channelId: varchar("channel_id"), // Optional: specific channel for rule
  priority: integer("priority").notNull().default(1), // Higher number = higher priority
  cooldownSeconds: integer("cooldown_seconds").default(0), // Cooldown between rule executions
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").notNull().default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("automation_trigger_type").on(table.triggerType),
  index("automation_guild").on(table.guildId)
]);

// Auto-roles table for automatic role assignment
export const autoRoles = pgTable("auto_roles", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  roleId: varchar("role_id").notNull(), // Discord role ID to assign
  roleName: varchar("role_name").notNull(), // Discord role name for display
  triggerType: varchar("trigger_type").notNull(), // "join", "level_up", "message_count", "time_based", "reaction", "manual"
  triggerValue: integer("trigger_value"), // Threshold value (messages, level, time in hours)
  conditions: text("conditions"), // JSON object with additional conditions
  guildId: varchar("guild_id").notNull(),
  channelId: varchar("channel_id"), // Optional: specific channel requirement
  isActive: boolean("is_active").notNull().default(true),
  removeOnLeave: boolean("remove_on_leave").notNull().default(false),
  stackable: boolean("stackable").notNull().default(true), // Can user have multiple auto-roles
  priority: integer("priority").notNull().default(1),
  assignedCount: integer("assigned_count").notNull().default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("autoroles_guild").on(table.guildId),
  index("autoroles_trigger").on(table.triggerType)
]);

// User auto-role assignments tracking
export const userAutoRoles = pgTable("user_auto_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  autoRoleId: integer("auto_role_id").notNull().references(() => autoRoles.id),
  roleId: varchar("role_id").notNull(), // Discord role ID
  guildId: varchar("guild_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  assignedBy: varchar("assigned_by"), // "system" or user ID
  isActive: boolean("is_active").notNull().default(true),
}, (table) => [
  index("user_autoroles_user").on(table.userId),
  index("user_autoroles_guild").on(table.guildId)
]);

// Logging configurations for Discord channels
export const loggingConfigs = pgTable("logging_configs", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  guildId: varchar("guild_id").notNull(),
  channelId: varchar("channel_id").notNull(),
  channelName: varchar("channel_name"),
  logType: varchar("log_type").notNull(), // "messages", "voice_activity", "member_join", "member_leave", "account_creation", "invites", "moderation", "role_changes"
  isActive: boolean("is_active").notNull().default(true),
  webhookUrl: varchar("webhook_url"),
  filterSettings: text("filter_settings"), // JSON for additional filtering options
  description: text("description"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("logging_configs_guild").on(table.guildId),
  index("logging_configs_type").on(table.logType),
  index("logging_configs_channel").on(table.channelId)
]);

export const altDetectionRules = pgTable("alt_detection_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  guildId: varchar("guild_id", { length: 255 }).notNull(),
  minAccountAge: integer("min_account_age").default(7), // days
  requireAvatar: boolean("require_avatar").default(true),
  requireVerification: boolean("require_verification").default(false),
  minMutualServers: integer("min_mutual_servers").default(0),
  bannedUsernamePatterns: text("banned_username_patterns").array().default([]),
  action: varchar("action", { length: 50 }).notNull(), // kick, ban, quarantine, alert
  notifyChannel: varchar("notify_channel", { length: 255 }),
  exemptRoles: text("exempt_roles").array().default([]),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(5),
  triggerCount: integer("trigger_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("alt_detection_guild").on(table.guildId),
  index("alt_detection_active").on(table.isActive),
  index("alt_detection_priority").on(table.priority)
]);

// Schema exports
export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertLeaderboardEntrySchema = createInsertSchema(leaderboardEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPollSchema = createInsertSchema(polls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPollOptionSchema = createInsertSchema(pollOptions).omit({
  id: true,
  createdAt: true,
});

export const insertPollVoteSchema = createInsertSchema(pollVotes).omit({
  id: true,
  createdAt: true,
});

export const insertDiscordChannelSchema = createInsertSchema(discordChannels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRoleSchema = createInsertSchema(userRoles).omit({
  id: true,
  assignedAt: true,
});

export const insertModerationLogSchema = createInsertSchema(moderationLogs).omit({
  id: true,
  createdAt: true,
});

export const insertContentFilterSchema = createInsertSchema(contentFilters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastTriggered: true,
  triggerCount: true,
});

export const insertAutoRoleSchema = createInsertSchema(autoRoles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  assignedCount: true,
});

export const insertUserAutoRoleSchema = createInsertSchema(userAutoRoles).omit({
  id: true,
  assignedAt: true,
});

export const insertLoggingConfigSchema = createInsertSchema(loggingConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAltDetectionRuleSchema = createInsertSchema(altDetectionRules).omit({
  id: true,
  triggerCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCustomBotSchema = createInsertSchema(userCustomBots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduledMessageSchema = createInsertSchema(scheduledMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSent: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Discord connections for OAuth integration
export const discordConnections = pgTable("discord_connections", {
  id: text("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  discordUserId: varchar("discord_user_id").notNull(),
  discordUsername: varchar("discord_username").notNull(),
  discordDiscriminator: varchar("discord_discriminator"),
  discordAvatar: varchar("discord_avatar"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at").notNull(),
  scopes: text("scopes").array().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Discord servers the user has access to
export const discordServers = pgTable("discord_servers", {
  id: text("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  serverId: varchar("server_id").notNull(),
  serverName: varchar("server_name").notNull(),
  serverIcon: varchar("server_icon"),
  serverOwner: boolean("server_owner").default(false),
  permissions: text("permissions").notNull(),
  features: text("features").array(),
  memberCount: integer("member_count"),
  isSelected: boolean("is_selected").default(false), // Which server user selected for bot management
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type DiscordConnection = typeof discordConnections.$inferSelect;
export type InsertDiscordConnection = typeof discordConnections.$inferInsert;
export type DiscordServer = typeof discordServers.$inferSelect;
export type InsertDiscordServer = typeof discordServers.$inferInsert;
export type InsertBot = z.infer<typeof insertBotSchema>;
export type Bot = typeof bots.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertLeaderboardEntry = z.infer<typeof insertLeaderboardEntrySchema>;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Poll = typeof polls.$inferSelect;
export type InsertPollOption = z.infer<typeof insertPollOptionSchema>;
export type PollOption = typeof pollOptions.$inferSelect;
export type InsertPollVote = z.infer<typeof insertPollVoteSchema>;
export type PollVote = typeof pollVotes.$inferSelect;
export type InsertDiscordChannel = z.infer<typeof insertDiscordChannelSchema>;
export type DiscordChannel = typeof discordChannels.$inferSelect;

export type InsertUserRole = z.infer<typeof insertUserRoleSchema>;
export type UserRole = typeof userRoles.$inferSelect;

export type InsertModerationLog = z.infer<typeof insertModerationLogSchema>;
export type ModerationLog = typeof moderationLogs.$inferSelect;

export type InsertContentFilter = z.infer<typeof insertContentFilterSchema>;
export type ContentFilter = typeof contentFilters.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type AutomationRule = typeof automationRules.$inferSelect;

export type InsertAutoRole = z.infer<typeof insertAutoRoleSchema>;
export type AutoRole = typeof autoRoles.$inferSelect;

export type InsertUserAutoRole = z.infer<typeof insertUserAutoRoleSchema>;
export type UserAutoRole = typeof userAutoRoles.$inferSelect;

export type InsertLoggingConfig = z.infer<typeof insertLoggingConfigSchema>;
export type LoggingConfig = typeof loggingConfigs.$inferSelect;

export type InsertAltDetectionRule = z.infer<typeof insertAltDetectionRuleSchema>;
export type AltDetectionRule = typeof altDetectionRules.$inferSelect;

export type BotFeature = typeof botFeatures.$inferSelect;
export type StandardBot = typeof standardBot.$inferSelect;
export type UserStandardBotSubscription = typeof userStandardBotSubscriptions.$inferSelect;

export type InsertUserCustomBot = z.infer<typeof insertUserCustomBotSchema>;
export type UserCustomBot = typeof userCustomBots.$inferSelect;

export type InsertScheduledMessage = z.infer<typeof insertScheduledMessageSchema>;
export type ScheduledMessage = typeof scheduledMessages.$inferSelect;

// Global embed color settings
export const embedColorSettings = pgTable("embed_color_settings", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id").notNull(),
  globalColor: varchar("global_color").default("#5865F2"), // Default Discord blue
  useGlobalColor: boolean("use_global_color").default(false),
  titleColor: varchar("title_color").default("#FFFFFF"), // Default white for titles
  useCustomTitleColor: boolean("use_custom_title_color").default(false), // Premium feature
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmbedColorSettingsSchema = createInsertSchema(embedColorSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmbedColorSettings = z.infer<typeof insertEmbedColorSettingsSchema>;
export type EmbedColorSettings = typeof embedColorSettings.$inferSelect;

// Personal Access Token schemas
export const insertPersonalAccessTokenSchema = createInsertSchema(personalAccessTokens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPersonalAccessToken = z.infer<typeof insertPersonalAccessTokenSchema>;
export type PersonalAccessToken = typeof personalAccessTokens.$inferSelect;
