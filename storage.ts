import {
  users,
  bots,
  events,
  announcements,
  activityLogs,
  leaderboardEntries,
  polls,
  pollOptions,
  pollVotes,
  discordChannels,
  userRoles,
  moderationLogs,
  contentFilters,
  reports,
  automationRules,
  autoRoles,
  userAutoRoles,
  loggingConfigs,
  altDetectionRules,
  botFeatures,
  standardBot,
  embedColorSettings,
  personalAccessTokens,
  discordConnections,
  discordServers,
  type User,
  type UpsertUser,
  type Bot,
  type InsertBot,
  type Event,
  type InsertEvent,
  type Announcement,
  type InsertAnnouncement,
  type ActivityLog,
  type InsertActivityLog,
  type LeaderboardEntry,
  type InsertLeaderboardEntry,
  type Poll,
  type InsertPoll,
  type PollOption,
  type InsertPollOption,
  type PollVote,
  type InsertPollVote,
  type DiscordChannel,
  type InsertDiscordChannel,
  type UserRole,
  type InsertUserRole,
  type ModerationLog,
  type InsertModerationLog,
  type ContentFilter,
  type InsertContentFilter,
  type Report,
  type InsertReport,
  type AutomationRule,
  type InsertAutomationRule,
  type AutoRole,
  type InsertAutoRole,
  type UserAutoRole,
  type InsertUserAutoRole,
  type LoggingConfig,
  type InsertLoggingConfig,
  type AltDetectionRule,
  type InsertAltDetectionRule,
  type BotFeature,
  type StandardBot,
  type EmbedColorSettings,
  type InsertEmbedColorSettings,
  type PersonalAccessToken,
  type InsertPersonalAccessToken,
  type DiscordConnection,
  type InsertDiscordConnection,
  type DiscordServer,
  type InsertDiscordServer,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, asc, sql, or, isNull, gt } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Bot operations
  getBots(ownerId: string): Promise<Bot[]>;
  getBot(id: number): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: number, bot: Partial<InsertBot>): Promise<Bot>;
  deleteBot(id: number): Promise<void>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  
  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Activity log operations
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Leaderboard operations
  getLeaderboard(category: string): Promise<LeaderboardEntry[]>;
  updateLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
  
  // Poll operations
  getPolls(category?: string): Promise<Poll[]>;
  getPoll(id: number): Promise<Poll | undefined>;
  createPoll(poll: InsertPoll): Promise<Poll>;
  updatePoll(id: number, poll: Partial<InsertPoll>): Promise<Poll>;
  deletePoll(id: number): Promise<void>;
  
  // Poll option operations
  getPollOptions(pollId: number): Promise<PollOption[]>;
  createPollOption(option: InsertPollOption): Promise<PollOption>;
  deletePollOption(id: number): Promise<void>;
  
  // Poll vote operations
  getPollVotes(pollId: number): Promise<PollVote[]>;
  getUserVote(pollId: number, userId: string): Promise<PollVote | undefined>;
  createPollVote(vote: InsertPollVote): Promise<PollVote>;
  deletePollVote(id: number): Promise<void>;
  getPollResults(pollId: number): Promise<{ optionId: number; text: string; votes: number }[]>;
  
  // Discord channel operations
  getDiscordChannels(guildId?: string): Promise<DiscordChannel[]>;
  getDiscordChannelByType(guildId: string, channelType: string): Promise<DiscordChannel | undefined>;
  createDiscordChannel(channel: InsertDiscordChannel): Promise<DiscordChannel>;
  updateDiscordChannel(id: number, channel: Partial<InsertDiscordChannel>): Promise<DiscordChannel>;
  deleteDiscordChannel(id: number): Promise<void>;
  
  // User role operations
  getUserRoles(userId: string, guildId?: string): Promise<UserRole[]>;
  getUserRole(userId: string, guildId?: string): Promise<UserRole | undefined>;
  createUserRole(role: InsertUserRole): Promise<UserRole>;
  updateUserRole(id: number, role: Partial<InsertUserRole>): Promise<UserRole>;
  deleteUserRole(id: number): Promise<void>;
  
  // Moderation log operations
  getModerationLogs(limit?: number, targetUserId?: string, moderatorId?: string): Promise<ModerationLog[]>;
  getModerationLog(id: number): Promise<ModerationLog | undefined>;
  createModerationLog(log: InsertModerationLog): Promise<ModerationLog>;
  updateModerationLog(id: number, log: Partial<InsertModerationLog>): Promise<ModerationLog>;
  
  // Content filter operations
  getContentFilters(guildId?: string): Promise<ContentFilter[]>;
  getContentFilter(id: number): Promise<ContentFilter | undefined>;
  createContentFilter(filter: InsertContentFilter): Promise<ContentFilter>;
  updateContentFilter(id: number, filter: Partial<InsertContentFilter>): Promise<ContentFilter>;
  deleteContentFilter(id: number): Promise<void>;
  
  // Report operations
  getReports(status?: string, assignedTo?: string): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<InsertReport>): Promise<Report>;
  deleteReport(id: number): Promise<void>;
  
  // Automation rule operations
  getAutomationRules(guildId?: string): Promise<AutomationRule[]>;
  getAutomationRule(id: number): Promise<AutomationRule | undefined>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: number, rule: Partial<InsertAutomationRule>): Promise<AutomationRule>;
  deleteAutomationRule(id: number): Promise<void>;
  triggerAutomationRule(id: number): Promise<AutomationRule>;
  
  // Auto-role operations
  getAutoRoles(guildId?: string): Promise<AutoRole[]>;
  getAutoRole(id: number): Promise<AutoRole | undefined>;
  createAutoRole(autoRole: InsertAutoRole): Promise<AutoRole>;
  updateAutoRole(id: number, autoRole: Partial<InsertAutoRole>): Promise<AutoRole>;
  deleteAutoRole(id: number): Promise<void>;
  
  // User auto-role tracking
  getUserAutoRoles(userId: string, guildId?: string): Promise<UserAutoRole[]>;
  assignUserAutoRole(assignment: InsertUserAutoRole): Promise<UserAutoRole>;
  removeUserAutoRole(userId: string, autoRoleId: number): Promise<void>;
  
  // Logging configuration operations
  getLoggingConfigs(guildId?: string): Promise<LoggingConfig[]>;
  getLoggingConfig(id: number): Promise<LoggingConfig | undefined>;
  createLoggingConfig(config: InsertLoggingConfig): Promise<LoggingConfig>;
  updateLoggingConfig(id: number, config: Partial<InsertLoggingConfig>): Promise<LoggingConfig>;
  deleteLoggingConfig(id: number): Promise<void>;
  
  // Alt detection rule operations
  getAltDetectionRules(guildId?: string): Promise<AltDetectionRule[]>;
  getAltDetectionRule(id: number): Promise<AltDetectionRule | undefined>;
  createAltDetectionRule(rule: InsertAltDetectionRule): Promise<AltDetectionRule>;
  updateAltDetectionRule(id: number, rule: Partial<InsertAltDetectionRule>): Promise<AltDetectionRule>;
  deleteAltDetectionRule(id: number): Promise<void>;
  triggerAltDetectionRule(id: number): Promise<AltDetectionRule>;
  
  // Standard bot and subscription operations
  getBotFeatures(): Promise<BotFeature[]>;
  getStandardBotConfig(): Promise<StandardBot | undefined>;
  updateStandardBotToken(token: string): Promise<StandardBot>;
  
  // Embed color settings operations
  getEmbedColorSettings(ownerId: string): Promise<EmbedColorSettings | undefined>;
  upsertEmbedColorSettings(settings: InsertEmbedColorSettings): Promise<EmbedColorSettings>;
  
  // Personal access token operations
  getPersonalAccessTokens(userId: string): Promise<PersonalAccessToken[]>;
  getPersonalAccessToken(token: string): Promise<PersonalAccessToken | undefined>;
  createPersonalAccessToken(tokenData: InsertPersonalAccessToken): Promise<PersonalAccessToken>;
  updatePersonalAccessToken(id: string, tokenData: Partial<InsertPersonalAccessToken>): Promise<PersonalAccessToken>;
  deletePersonalAccessToken(id: string): Promise<void>;
  validateAccessToken(token: string): Promise<PersonalAccessToken | undefined>;
  
  // Discord OAuth operations
  getDiscordConnection(userId: string): Promise<DiscordConnection | undefined>;
  upsertDiscordConnection(connection: InsertDiscordConnection): Promise<DiscordConnection>;
  deleteDiscordConnection(userId: string): Promise<void>;
  getDiscordServers(userId: string): Promise<DiscordServer[]>;
  upsertDiscordServer(server: InsertDiscordServer): Promise<DiscordServer>;
  setSelectedDiscordServer(userId: string, serverId: string): Promise<void>;
  getSelectedDiscordServer(userId: string): Promise<DiscordServer | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Bot operations
  async getBots(ownerId: string): Promise<Bot[]> {
    return await db
      .select()
      .from(bots)
      .where(and(eq(bots.ownerId, ownerId), eq(bots.isActive, true)))
      .orderBy(desc(bots.createdAt));
  }

  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }

  async createBot(bot: InsertBot): Promise<Bot> {
    const [newBot] = await db.insert(bots).values(bot).returning();
    return newBot;
  }

  async updateBot(id: number, bot: Partial<InsertBot>): Promise<Bot> {
    const [updatedBot] = await db
      .update(bots)
      .set({ ...bot, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return updatedBot;
  }

  async deleteBot(id: number): Promise<void> {
    await db.update(bots).set({ isActive: false }).where(eq(bots.id, id));
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updatedEvent] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  // Activity log operations
  async getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  // Leaderboard operations
  async getLeaderboard(category: string): Promise<LeaderboardEntry[]> {
    return await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.category, category))
      .orderBy(desc(leaderboardEntries.score))
      .limit(50);
  }

  async updateLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    const [existingEntry] = await db
      .select()
      .from(leaderboardEntries)
      .where(
        and(
          eq(leaderboardEntries.userId, entry.userId),
          eq(leaderboardEntries.category, entry.category)
        )
      );

    if (existingEntry) {
      const [updatedEntry] = await db
        .update(leaderboardEntries)
        .set({ ...entry, updatedAt: new Date() })
        .where(eq(leaderboardEntries.id, existingEntry.id))
        .returning();
      return updatedEntry;
    } else {
      const [newEntry] = await db
        .insert(leaderboardEntries)
        .values(entry)
        .returning();
      return newEntry;
    }
  }

  // Poll operations
  async getPolls(category?: string): Promise<Poll[]> {
    const query = db.select().from(polls);
    if (category) {
      query.where(eq(polls.category, category));
    }
    return await query.orderBy(desc(polls.createdAt));
  }

  async getPoll(id: number): Promise<Poll | undefined> {
    const [poll] = await db.select().from(polls).where(eq(polls.id, id));
    return poll;
  }

  async createPoll(poll: InsertPoll): Promise<Poll> {
    const [newPoll] = await db.insert(polls).values(poll).returning();
    return newPoll;
  }

  async updatePoll(id: number, poll: Partial<InsertPoll>): Promise<Poll> {
    const [updatedPoll] = await db
      .update(polls)
      .set({ ...poll, updatedAt: new Date() })
      .where(eq(polls.id, id))
      .returning();
    return updatedPoll;
  }

  async deletePoll(id: number): Promise<void> {
    await db.delete(polls).where(eq(polls.id, id));
  }

  // Poll option operations
  async getPollOptions(pollId: number): Promise<PollOption[]> {
    return await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.pollId, pollId))
      .orderBy(asc(pollOptions.order));
  }

  async createPollOption(option: InsertPollOption): Promise<PollOption> {
    const [newOption] = await db.insert(pollOptions).values(option).returning();
    return newOption;
  }

  async deletePollOption(id: number): Promise<void> {
    await db.delete(pollOptions).where(eq(pollOptions.id, id));
  }

  // Poll vote operations
  async getPollVotes(pollId: number): Promise<PollVote[]> {
    return await db.select().from(pollVotes).where(eq(pollVotes.pollId, pollId));
  }

  async getUserVote(pollId: number, userId: string): Promise<PollVote | undefined> {
    const [vote] = await db
      .select()
      .from(pollVotes)
      .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, userId)));
    return vote;
  }

  async createPollVote(vote: InsertPollVote): Promise<PollVote> {
    const [newVote] = await db.insert(pollVotes).values(vote).returning();
    return newVote;
  }

  async deletePollVote(id: number): Promise<void> {
    await db.delete(pollVotes).where(eq(pollVotes.id, id));
  }

  async getPollResults(pollId: number): Promise<{ optionId: number; text: string; votes: number }[]> {
    const results = await db
      .select({
        optionId: pollOptions.id,
        text: pollOptions.text,
        votes: sql<number>`count(${pollVotes.id})::int`,
      })
      .from(pollOptions)
      .leftJoin(pollVotes, eq(pollOptions.id, pollVotes.optionId))
      .where(eq(pollOptions.pollId, pollId))
      .groupBy(pollOptions.id, pollOptions.text)
      .orderBy(asc(pollOptions.order));
    
    return results;
  }

  // Discord channel operations
  async getDiscordChannels(guildId?: string): Promise<DiscordChannel[]> {
    const query = db.select().from(discordChannels);
    if (guildId) {
      return query.where(eq(discordChannels.guildId, guildId));
    }
    return query;
  }

  async getDiscordChannelByType(guildId: string, channelType: string): Promise<DiscordChannel | undefined> {
    const [channel] = await db
      .select()
      .from(discordChannels)
      .where(and(
        eq(discordChannels.guildId, guildId),
        eq(discordChannels.channelType, channelType),
        eq(discordChannels.isActive, true)
      ));
    return channel;
  }

  async createDiscordChannel(channel: InsertDiscordChannel): Promise<DiscordChannel> {
    const [newChannel] = await db
      .insert(discordChannels)
      .values(channel)
      .returning();
    return newChannel;
  }

  async updateDiscordChannel(id: number, channel: Partial<InsertDiscordChannel>): Promise<DiscordChannel> {
    const [updatedChannel] = await db
      .update(discordChannels)
      .set({ ...channel, updatedAt: new Date() })
      .where(eq(discordChannels.id, id))
      .returning();
    return updatedChannel;
  }

  async deleteDiscordChannel(id: number): Promise<void> {
    await db.delete(discordChannels).where(eq(discordChannels.id, id));
  }

  // User role operations
  async getUserRoles(userId: string, guildId?: string): Promise<UserRole[]> {
    const conditions = [eq(userRoles.userId, userId), eq(userRoles.isActive, true)];
    if (guildId) {
      conditions.push(eq(userRoles.guildId, guildId));
    }
    return await db.select().from(userRoles).where(and(...conditions));
  }

  async getUserRole(userId: string, guildId?: string): Promise<UserRole | undefined> {
    const conditions = [eq(userRoles.userId, userId), eq(userRoles.isActive, true)];
    if (guildId) {
      conditions.push(eq(userRoles.guildId, guildId));
    }
    const [role] = await db.select().from(userRoles).where(and(...conditions));
    return role;
  }

  async createUserRole(role: InsertUserRole): Promise<UserRole> {
    const [newRole] = await db.insert(userRoles).values(role).returning();
    return newRole;
  }

  async updateUserRole(id: number, role: Partial<InsertUserRole>): Promise<UserRole> {
    const [updatedRole] = await db
      .update(userRoles)
      .set(role)
      .where(eq(userRoles.id, id))
      .returning();
    return updatedRole;
  }

  async deleteUserRole(id: number): Promise<void> {
    await db.delete(userRoles).where(eq(userRoles.id, id));
  }

  // Moderation log operations
  async getModerationLogs(limit: number = 50, targetUserId?: string, moderatorId?: string): Promise<ModerationLog[]> {
    const conditions = [eq(moderationLogs.isActive, true)];
    if (targetUserId) {
      conditions.push(eq(moderationLogs.targetUserId, targetUserId));
    }
    if (moderatorId) {
      conditions.push(eq(moderationLogs.moderatorId, moderatorId));
    }
    return await db
      .select()
      .from(moderationLogs)
      .where(and(...conditions))
      .orderBy(desc(moderationLogs.createdAt))
      .limit(limit);
  }

  async getModerationLog(id: number): Promise<ModerationLog | undefined> {
    const [log] = await db.select().from(moderationLogs).where(eq(moderationLogs.id, id));
    return log;
  }

  async createModerationLog(log: InsertModerationLog): Promise<ModerationLog> {
    const [newLog] = await db.insert(moderationLogs).values(log).returning();
    return newLog;
  }

  async updateModerationLog(id: number, log: Partial<InsertModerationLog>): Promise<ModerationLog> {
    const [updatedLog] = await db
      .update(moderationLogs)
      .set(log)
      .where(eq(moderationLogs.id, id))
      .returning();
    return updatedLog;
  }

  // Content filter operations
  async getContentFilters(guildId?: string): Promise<ContentFilter[]> {
    const conditions = [eq(contentFilters.isActive, true)];
    if (guildId) {
      conditions.push(eq(contentFilters.guildId, guildId));
    }
    return await db.select().from(contentFilters).where(and(...conditions));
  }

  async getContentFilter(id: number): Promise<ContentFilter | undefined> {
    const [filter] = await db.select().from(contentFilters).where(eq(contentFilters.id, id));
    return filter;
  }

  async createContentFilter(filter: InsertContentFilter): Promise<ContentFilter> {
    const [newFilter] = await db.insert(contentFilters).values(filter).returning();
    return newFilter;
  }

  async updateContentFilter(id: number, filter: Partial<InsertContentFilter>): Promise<ContentFilter> {
    const [updatedFilter] = await db
      .update(contentFilters)
      .set({ ...filter, updatedAt: new Date() })
      .where(eq(contentFilters.id, id))
      .returning();
    return updatedFilter;
  }

  async deleteContentFilter(id: number): Promise<void> {
    await db.delete(contentFilters).where(eq(contentFilters.id, id));
  }

  // Report operations
  async getReports(status?: string, assignedTo?: string): Promise<Report[]> {
    const conditions = [];
    if (status) {
      conditions.push(eq(reports.status, status));
    }
    if (assignedTo) {
      conditions.push(eq(reports.assignedTo, assignedTo));
    }
    return await db
      .select()
      .from(reports)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(reports.createdAt));
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async updateReport(id: number, report: Partial<InsertReport>): Promise<Report> {
    const [updatedReport] = await db
      .update(reports)
      .set(report)
      .where(eq(reports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteReport(id: number): Promise<void> {
    await db.delete(reports).where(eq(reports.id, id));
  }

  // Automation rule operations
  async getAutomationRules(guildId?: string): Promise<AutomationRule[]> {
    const conditions = [eq(automationRules.isActive, true)];
    if (guildId) {
      conditions.push(eq(automationRules.guildId, guildId));
    }
    return await db
      .select()
      .from(automationRules)
      .where(and(...conditions))
      .orderBy(desc(automationRules.priority), desc(automationRules.createdAt));
  }

  async getAutomationRule(id: number): Promise<AutomationRule | undefined> {
    const [rule] = await db.select().from(automationRules).where(eq(automationRules.id, id));
    return rule;
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const [newRule] = await db.insert(automationRules).values(rule).returning();
    return newRule;
  }

  async updateAutomationRule(id: number, rule: Partial<InsertAutomationRule>): Promise<AutomationRule> {
    const [updatedRule] = await db
      .update(automationRules)
      .set({ ...rule, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteAutomationRule(id: number): Promise<void> {
    await db.delete(automationRules).where(eq(automationRules.id, id));
  }

  async triggerAutomationRule(id: number): Promise<AutomationRule> {
    const [triggeredRule] = await db
      .update(automationRules)
      .set({ 
        lastTriggered: new Date(),
        triggerCount: sql`${automationRules.triggerCount} + 1`
      })
      .where(eq(automationRules.id, id))
      .returning();
    return triggeredRule;
  }

  // Auto-role operations
  async getAutoRoles(guildId?: string): Promise<AutoRole[]> {
    const conditions = [eq(autoRoles.isActive, true)];
    if (guildId) {
      conditions.push(eq(autoRoles.guildId, guildId));
    }
    return await db
      .select()
      .from(autoRoles)
      .where(and(...conditions))
      .orderBy(desc(autoRoles.priority), desc(autoRoles.createdAt));
  }

  async getAutoRole(id: number): Promise<AutoRole | undefined> {
    const [autoRole] = await db.select().from(autoRoles).where(eq(autoRoles.id, id));
    return autoRole;
  }

  async createAutoRole(autoRole: InsertAutoRole): Promise<AutoRole> {
    const [newAutoRole] = await db.insert(autoRoles).values(autoRole).returning();
    return newAutoRole;
  }

  async updateAutoRole(id: number, autoRole: Partial<InsertAutoRole>): Promise<AutoRole> {
    const [updatedAutoRole] = await db
      .update(autoRoles)
      .set({ ...autoRole, updatedAt: new Date() })
      .where(eq(autoRoles.id, id))
      .returning();
    return updatedAutoRole;
  }

  async deleteAutoRole(id: number): Promise<void> {
    await db.delete(autoRoles).where(eq(autoRoles.id, id));
  }

  // User auto-role tracking
  async getUserAutoRoles(userId: string, guildId?: string): Promise<UserAutoRole[]> {
    const conditions = [eq(userAutoRoles.userId, userId), eq(userAutoRoles.isActive, true)];
    if (guildId) {
      conditions.push(eq(userAutoRoles.guildId, guildId));
    }
    return await db.select().from(userAutoRoles).where(and(...conditions));
  }

  async assignUserAutoRole(assignment: InsertUserAutoRole): Promise<UserAutoRole> {
    const [newAssignment] = await db.insert(userAutoRoles).values(assignment).returning();
    
    // Increment assignment count for the auto-role
    await db
      .update(autoRoles)
      .set({ assignedCount: sql`${autoRoles.assignedCount} + 1` })
      .where(eq(autoRoles.id, assignment.autoRoleId));
    
    return newAssignment;
  }

  async removeUserAutoRole(userId: string, autoRoleId: number): Promise<void> {
    await db
      .update(userAutoRoles)
      .set({ isActive: false })
      .where(and(
        eq(userAutoRoles.userId, userId),
        eq(userAutoRoles.autoRoleId, autoRoleId)
      ));
  }

  // Logging configuration operations
  async getLoggingConfigs(guildId?: string): Promise<LoggingConfig[]> {
    const query = db.select().from(loggingConfigs);
    
    if (guildId) {
      return await query.where(eq(loggingConfigs.guildId, guildId));
    }
    
    return await query;
  }

  async getLoggingConfig(id: number): Promise<LoggingConfig | undefined> {
    const [config] = await db.select().from(loggingConfigs).where(eq(loggingConfigs.id, id));
    return config;
  }

  async createLoggingConfig(config: InsertLoggingConfig): Promise<LoggingConfig> {
    const [newConfig] = await db
      .insert(loggingConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async updateLoggingConfig(id: number, config: Partial<InsertLoggingConfig>): Promise<LoggingConfig> {
    const [updatedConfig] = await db
      .update(loggingConfigs)
      .set({
        ...config,
        updatedAt: new Date(),
      })
      .where(eq(loggingConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  async deleteLoggingConfig(id: number): Promise<void> {
    await db.delete(loggingConfigs).where(eq(loggingConfigs.id, id));
  }

  // Alt detection rule operations
  async getAltDetectionRules(guildId?: string): Promise<AltDetectionRule[]> {
    const query = db.select().from(altDetectionRules);
    if (guildId) {
      return query.where(eq(altDetectionRules.guildId, guildId)).orderBy(desc(altDetectionRules.priority));
    }
    return query.orderBy(desc(altDetectionRules.priority));
  }

  async getAltDetectionRule(id: number): Promise<AltDetectionRule | undefined> {
    const [rule] = await db.select().from(altDetectionRules).where(eq(altDetectionRules.id, id));
    return rule;
  }

  async createAltDetectionRule(rule: InsertAltDetectionRule): Promise<AltDetectionRule> {
    const [newRule] = await db
      .insert(altDetectionRules)
      .values(rule)
      .returning();
    return newRule;
  }

  async updateAltDetectionRule(id: number, rule: Partial<InsertAltDetectionRule>): Promise<AltDetectionRule> {
    const [updatedRule] = await db
      .update(altDetectionRules)
      .set({
        ...rule,
        updatedAt: new Date(),
      })
      .where(eq(altDetectionRules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteAltDetectionRule(id: number): Promise<void> {
    await db.delete(altDetectionRules).where(eq(altDetectionRules.id, id));
  }

  async triggerAltDetectionRule(id: number): Promise<AltDetectionRule> {
    const [triggeredRule] = await db
      .update(altDetectionRules)
      .set({
        triggerCount: sql`${altDetectionRules.triggerCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(altDetectionRules.id, id))
      .returning();
    return triggeredRule;
  }

  // Standard bot and subscription operations
  async getBotFeatures(): Promise<BotFeature[]> {
    const features = await db.select().from(botFeatures).where(eq(botFeatures.isActive, true));
    return features;
  }

  async getStandardBotConfig(): Promise<StandardBot | undefined> {
    const [config] = await db.select().from(standardBot).where(eq(standardBot.isActive, true));
    return config;
  }

  async updateStandardBotToken(token: string): Promise<StandardBot> {
    const [updatedConfig] = await db
      .update(standardBot)
      .set({
        token,
        updatedAt: new Date(),
      })
      .where(eq(standardBot.isActive, true))
      .returning();
    return updatedConfig;
  }

  // Embed color settings operations
  async getEmbedColorSettings(ownerId: string): Promise<EmbedColorSettings | undefined> {
    const [settings] = await db.select().from(embedColorSettings).where(eq(embedColorSettings.ownerId, ownerId));
    return settings || undefined;
  }

  async upsertEmbedColorSettings(settings: InsertEmbedColorSettings): Promise<EmbedColorSettings> {
    const [result] = await db
      .insert(embedColorSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: embedColorSettings.ownerId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  // Personal access token operations
  async getPersonalAccessTokens(userId: string): Promise<PersonalAccessToken[]> {
    return await db
      .select()
      .from(personalAccessTokens)
      .where(eq(personalAccessTokens.userId, userId))
      .orderBy(desc(personalAccessTokens.createdAt));
  }

  async getPersonalAccessToken(token: string): Promise<PersonalAccessToken | undefined> {
    const [result] = await db
      .select()
      .from(personalAccessTokens)
      .where(eq(personalAccessTokens.token, token));
    return result;
  }

  async createPersonalAccessToken(tokenData: InsertPersonalAccessToken): Promise<PersonalAccessToken> {
    const tokenId = randomUUID();
    const [result] = await db
      .insert(personalAccessTokens)
      .values({
        id: tokenId,
        ...tokenData,
      })
      .returning();
    return result;
  }

  async updatePersonalAccessToken(id: string, tokenData: Partial<InsertPersonalAccessToken>): Promise<PersonalAccessToken> {
    const [result] = await db
      .update(personalAccessTokens)
      .set({
        ...tokenData,
        updatedAt: new Date(),
      })
      .where(eq(personalAccessTokens.id, id))
      .returning();
    return result;
  }

  async deletePersonalAccessToken(id: string): Promise<void> {
    await db
      .delete(personalAccessTokens)
      .where(eq(personalAccessTokens.id, id));
  }

  async validateAccessToken(token: string): Promise<PersonalAccessToken | undefined> {
    const [result] = await db
      .select()
      .from(personalAccessTokens)
      .where(
        and(
          eq(personalAccessTokens.token, token),
          eq(personalAccessTokens.isActive, true),
          or(
            isNull(personalAccessTokens.expiresAt),
            gt(personalAccessTokens.expiresAt, new Date())
          )
        )
      );

    if (result) {
      // Update last used timestamp
      await db
        .update(personalAccessTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(personalAccessTokens.id, result.id));
    }

    return result;
  }

  // Discord OAuth operations
  async getDiscordConnection(userId: string): Promise<DiscordConnection | undefined> {
    const [result] = await db
      .select()
      .from(discordConnections)
      .where(eq(discordConnections.userId, userId));
    return result;
  }

  async upsertDiscordConnection(connection: InsertDiscordConnection): Promise<DiscordConnection> {
    // First try to find existing connection for this user
    const existing = await this.getDiscordConnection(connection.userId);
    
    if (existing) {
      // Update existing connection
      const [result] = await db
        .update(discordConnections)
        .set({
          ...connection,
          updatedAt: new Date(),
        })
        .where(eq(discordConnections.userId, connection.userId))
        .returning();
      return result;
    } else {
      // Insert new connection
      const [result] = await db
        .insert(discordConnections)
        .values(connection)
        .returning();
      return result;
    }
  }

  async deleteDiscordConnection(userId: string): Promise<void> {
    // First delete all associated Discord servers
    await db
      .delete(discordServers)
      .where(eq(discordServers.userId, userId));
    
    // Then delete the Discord connection
    await db
      .delete(discordConnections)
      .where(eq(discordConnections.userId, userId));
  }

  async getDiscordServers(userId: string): Promise<DiscordServer[]> {
    return await db
      .select()
      .from(discordServers)
      .where(eq(discordServers.userId, userId))
      .orderBy(desc(discordServers.updatedAt));
  }

  async upsertDiscordServer(server: InsertDiscordServer): Promise<DiscordServer> {
    // First try to find existing server for this user
    const existing = await db
      .select()
      .from(discordServers)
      .where(and(
        eq(discordServers.userId, server.userId),
        eq(discordServers.serverId, server.serverId)
      ));
    
    if (existing.length > 0) {
      // Update existing server
      const [result] = await db
        .update(discordServers)
        .set({
          ...server,
          updatedAt: new Date(),
        })
        .where(and(
          eq(discordServers.userId, server.userId),
          eq(discordServers.serverId, server.serverId)
        ))
        .returning();
      return result;
    } else {
      // Insert new server
      const [result] = await db
        .insert(discordServers)
        .values(server)
        .returning();
      return result;
    }
  }

  async setSelectedDiscordServer(userId: string, serverId: string): Promise<void> {
    // First, unselect all servers for this user
    await db
      .update(discordServers)
      .set({ isSelected: false })
      .where(eq(discordServers.userId, userId));
    
    // Then select the specified server
    await db
      .update(discordServers)
      .set({ isSelected: true })
      .where(
        and(
          eq(discordServers.userId, userId),
          eq(discordServers.serverId, serverId)
        )
      );
  }

  async getSelectedDiscordServer(userId: string): Promise<DiscordServer | undefined> {
    const [result] = await db
      .select()
      .from(discordServers)
      .where(
        and(
          eq(discordServers.userId, userId),
          eq(discordServers.isSelected, true)
        )
      );
    return result;
  }
}

export const storage = new DatabaseStorage();
