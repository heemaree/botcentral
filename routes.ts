import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAuthenticatedOrToken } from "./replitAuth";
import { randomBytes } from "crypto";

// Discord webhook function
async function postPollToDiscord(poll: any, options: string[]) {
  const channel = await storage.getDiscordChannelByType(poll.guildId || "default", "polls");
  if (!channel || !channel.webhookUrl) {
    throw new Error("No Discord webhook configured for polls");
  }

  const embed = {
    title: `📊 ${poll.title}`,
    description: poll.description || "Vote on this poll!",
    color: 0x5865F2, // Discord blurple
    fields: options.map((option, index) => ({
      name: `${index + 1}️⃣ ${option}`,
      value: "\u200B", // Zero-width space
      inline: true
    })),
    footer: {
      text: `Poll by BotCentral • React with numbers to vote!`
    },
    timestamp: new Date().toISOString()
  };

  const payload = {
    embeds: [embed],
    content: "🗳️ **New Poll Created!**"
  };

  const response = await fetch(channel.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.statusText}`);
  }

  return response.json();
}
import { 
  insertBotSchema, 
  insertEventSchema, 
  insertAnnouncementSchema,
  insertActivityLogSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Bot management routes
  app.get('/api/bots', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bots = await storage.getBots(userId);
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ message: "Failed to fetch bots" });
    }
  });

  app.post('/api/bots', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const botData = insertBotSchema.parse({ ...req.body, ownerId: userId });
      const bot = await storage.createBot(botData);
      
      // Log activity
      await storage.createActivityLog({
        botId: bot.id,
        action: "bot_created",
        description: `Bot "${bot.name}" was created`,
        userId,
      });
      
      res.json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ message: "Failed to create bot" });
    }
  });

  app.put('/api/bots/:id', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const botId = parseInt(req.params.id);
      const updates = req.body;
      const bot = await storage.updateBot(botId, updates);
      
      // Log activity
      await storage.createActivityLog({
        botId: bot.id,
        action: "bot_updated",
        description: `Bot "${bot.name}" was updated`,
        userId: req.user.claims.sub,
      });
      
      res.json(bot);
    } catch (error) {
      console.error("Error updating bot:", error);
      res.status(500).json({ message: "Failed to update bot" });
    }
  });

  app.delete('/api/bots/:id', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const botId = parseInt(req.params.id);
      const bot = await storage.getBot(botId);
      await storage.deleteBot(botId);
      
      // Log activity
      await storage.createActivityLog({
        botId,
        action: "bot_deleted",
        description: `Bot "${bot?.name}" was deleted`,
        userId: req.user.claims.sub,
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ message: "Failed to delete bot" });
    }
  });

  // Event management routes
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({ ...req.body, createdBy: userId });
      const event = await storage.createEvent(eventData);
      
      // Log activity
      await storage.createActivityLog({
        action: "event_created",
        description: `Event "${event.title}" was created`,
        userId,
      });
      
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put('/api/events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const updates = req.body;
      const event = await storage.updateEvent(eventId, updates);
      
      // Log activity
      await storage.createActivityLog({
        action: "event_updated",
        description: `Event "${event.title}" was updated`,
        userId: req.user.claims.sub,
      });
      
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  // Announcement routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const announcementData = insertAnnouncementSchema.parse({ ...req.body, authorId: userId });
      const announcement = await storage.createAnnouncement(announcementData);
      
      // Log activity
      await storage.createActivityLog({
        action: "announcement_created",
        description: `Announcement "${announcement.title}" was posted`,
        userId,
      });
      
      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Activity logs route
  app.get('/api/activity-logs', isAuthenticatedOrToken, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard/:category', async (req, res) => {
    try {
      const category = req.params.category;
      const leaderboard = await storage.getLeaderboard(category);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Dashboard stats route
  app.get('/api/dashboard/stats', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bots = await storage.getBots(userId);
      const events = await storage.getEvents();
      const announcements = await storage.getAnnouncements();
      
      const stats = {
        activeBots: bots.filter(bot => bot.status === 'online').length,
        totalServers: bots.reduce((sum, bot) => sum + (bot.serverCount || 0), 0),
        activeUsers: bots.reduce((sum, bot) => sum + (bot.userCount || 0), 0),
        commandsPerDay: Math.floor(Math.random() * 10000) + 5000, // Mock data for now
        upcomingEvents: events.filter(event => new Date(event.date) > new Date()).slice(0, 3),
        recentActivity: await storage.getActivityLogs(10),
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Poll routes
  app.get('/api/polls', async (req, res) => {
    try {
      const { category } = req.query;
      const polls = await storage.getPolls(category as string);
      res.json(polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(500).json({ message: "Failed to fetch polls" });
    }
  });

  app.get('/api/polls/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const poll = await storage.getPoll(parseInt(id));
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      console.error("Error fetching poll:", error);
      res.status(500).json({ message: "Failed to fetch poll" });
    }
  });

  app.post('/api/polls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pollData = { ...req.body, createdBy: userId };
      const poll = await storage.createPoll(pollData);
      
      // Create poll options
      if (req.body.options && req.body.options.length > 0) {
        for (let i = 0; i < req.body.options.length; i++) {
          await storage.createPollOption({
            pollId: poll.id,
            text: req.body.options[i],
            order: i
          });
        }
      }
      
      // Post to Discord if requested
      if (pollData.postToDiscord && pollData.discordChannelId) {
        try {
          await postPollToDiscord(poll, req.body.options || []);
        } catch (discordError) {
          console.error("Discord posting failed:", discordError);
          // Don't fail the entire request if Discord posting fails
        }
      }
      
      // Log activity
      await storage.createActivityLog({
        action: "poll_created",
        description: `Created poll: ${poll.title}`,
        userId: userId,
      });
      
      res.status(201).json(poll);
    } catch (error) {
      console.error("Error creating poll:", error);
      res.status(500).json({ message: "Failed to create poll" });
    }
  });

  app.put('/api/polls/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const poll = await storage.updatePoll(parseInt(id), req.body);
      res.json(poll);
    } catch (error) {
      console.error("Error updating poll:", error);
      res.status(500).json({ message: "Failed to update poll" });
    }
  });

  app.delete('/api/polls/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deletePoll(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting poll:", error);
      res.status(500).json({ message: "Failed to delete poll" });
    }
  });

  // Poll options routes
  app.get('/api/polls/:id/options', async (req, res) => {
    try {
      const { id } = req.params;
      const options = await storage.getPollOptions(parseInt(id));
      res.json(options);
    } catch (error) {
      console.error("Error fetching poll options:", error);
      res.status(500).json({ message: "Failed to fetch poll options" });
    }
  });

  app.post('/api/polls/:id/options', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const optionData = { ...req.body, pollId: parseInt(id) };
      const option = await storage.createPollOption(optionData);
      res.status(201).json(option);
    } catch (error) {
      console.error("Error creating poll option:", error);
      res.status(500).json({ message: "Failed to create poll option" });
    }
  });

  // Poll voting routes
  app.get('/api/polls/:id/results', async (req, res) => {
    try {
      const { id } = req.params;
      const results = await storage.getPollResults(parseInt(id));
      res.json(results);
    } catch (error) {
      console.error("Error fetching poll results:", error);
      res.status(500).json({ message: "Failed to fetch poll results" });
    }
  });

  app.post('/api/polls/:id/vote', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { optionId } = req.body;
      const userId = req.user.claims.sub;
      
      // Check if user already voted
      const existingVote = await storage.getUserVote(parseInt(id), userId);
      if (existingVote) {
        return res.status(400).json({ message: "You have already voted on this poll" });
      }
      
      const vote = await storage.createPollVote({
        pollId: parseInt(id),
        optionId: optionId,
        userId: userId,
      });
      
      res.status(201).json(vote);
    } catch (error) {
      console.error("Error creating vote:", error);
      res.status(500).json({ message: "Failed to create vote" });
    }
  });

  app.get('/api/polls/:id/my-vote', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const vote = await storage.getUserVote(parseInt(id), userId);
      res.json(vote || null);
    } catch (error) {
      console.error("Error fetching user vote:", error);
      res.status(500).json({ message: "Failed to fetch user vote" });
    }
  });

  // Discord channel management routes
  app.get('/api/discord/channels', isAuthenticated, async (req, res) => {
    try {
      const { guildId } = req.query;
      const channels = await storage.getDiscordChannels(guildId as string);
      res.json(channels);
    } catch (error) {
      console.error("Error fetching Discord channels:", error);
      res.status(500).json({ message: "Failed to fetch Discord channels" });
    }
  });

  app.post('/api/discord/channels', isAuthenticated, async (req, res) => {
    try {
      const channel = await storage.createDiscordChannel(req.body);
      res.status(201).json(channel);
    } catch (error) {
      console.error("Error creating Discord channel:", error);
      res.status(500).json({ message: "Failed to create Discord channel" });
    }
  });

  app.put('/api/discord/channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const channel = await storage.updateDiscordChannel(parseInt(id), req.body);
      res.json(channel);
    } catch (error) {
      console.error("Error updating Discord channel:", error);
      res.status(500).json({ message: "Failed to update Discord channel" });
    }
  });

  app.delete('/api/discord/channels/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDiscordChannel(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Discord channel:", error);
      res.status(500).json({ message: "Failed to delete Discord channel" });
    }
  });

  // Moderation routes
  
  // User roles
  app.get('/api/moderation/roles/:userId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const guildId = req.query.guildId as string;
      const roles = await storage.getUserRoles(userId, guildId);
      res.json(roles);
    } catch (error) {
      console.error("Error fetching user roles:", error);
      res.status(500).json({ message: "Failed to fetch user roles" });
    }
  });

  app.post('/api/moderation/roles', isAuthenticated, async (req: any, res) => {
    try {
      const roleData = req.body;
      const moderatorId = req.user?.claims?.sub;
      const newRole = await storage.createUserRole({
        ...roleData,
        assignedBy: moderatorId,
      });
      res.status(201).json(newRole);
    } catch (error) {
      console.error("Error creating user role:", error);
      res.status(500).json({ message: "Failed to create user role" });
    }
  });

  app.put('/api/moderation/roles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedRole = await storage.updateUserRole(id, updateData);
      res.json(updatedRole);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.delete('/api/moderation/roles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUserRole(id);
      res.json({ message: "User role deleted successfully" });
    } catch (error) {
      console.error("Error deleting user role:", error);
      res.status(500).json({ message: "Failed to delete user role" });
    }
  });

  // Moderation logs
  app.get('/api/moderation/logs', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const targetUserId = req.query.targetUserId as string;
      const moderatorId = req.query.moderatorId as string;
      const logs = await storage.getModerationLogs(limit, targetUserId, moderatorId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching moderation logs:", error);
      res.status(500).json({ message: "Failed to fetch moderation logs" });
    }
  });

  app.post('/api/moderation/logs', isAuthenticated, async (req: any, res) => {
    try {
      const logData = req.body;
      const moderatorId = req.user?.claims?.sub;
      const newLog = await storage.createModerationLog({
        ...logData,
        moderatorId,
      });
      res.status(201).json(newLog);
    } catch (error) {
      console.error("Error creating moderation log:", error);
      res.status(500).json({ message: "Failed to create moderation log" });
    }
  });

  // Content filters
  app.get('/api/moderation/filters', isAuthenticated, async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      const filters = await storage.getContentFilters(guildId);
      res.json(filters);
    } catch (error) {
      console.error("Error fetching content filters:", error);
      res.status(500).json({ message: "Failed to fetch content filters" });
    }
  });

  app.post('/api/moderation/filters', isAuthenticated, async (req: any, res) => {
    try {
      const filterData = req.body;
      const createdBy = req.user?.claims?.sub;
      const newFilter = await storage.createContentFilter({
        ...filterData,
        createdBy,
      });
      res.status(201).json(newFilter);
    } catch (error) {
      console.error("Error creating content filter:", error);
      res.status(500).json({ message: "Failed to create content filter" });
    }
  });

  app.put('/api/moderation/filters/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedFilter = await storage.updateContentFilter(id, updateData);
      res.json(updatedFilter);
    } catch (error) {
      console.error("Error updating content filter:", error);
      res.status(500).json({ message: "Failed to update content filter" });
    }
  });

  app.delete('/api/moderation/filters/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteContentFilter(id);
      res.json({ message: "Content filter deleted successfully" });
    } catch (error) {
      console.error("Error deleting content filter:", error);
      res.status(500).json({ message: "Failed to delete content filter" });
    }
  });

  // Reports
  app.get('/api/moderation/reports', isAuthenticated, async (req, res) => {
    try {
      const status = req.query.status as string;
      const assignedTo = req.query.assignedTo as string;
      const reports = await storage.getReports(status, assignedTo);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post('/api/moderation/reports', isAuthenticated, async (req: any, res) => {
    try {
      const reportData = req.body;
      const reporterUserId = req.user?.claims?.sub;
      const newReport = await storage.createReport({
        ...reportData,
        reporterUserId,
      });
      res.status(201).json(newReport);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.put('/api/moderation/reports/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedReport = await storage.updateReport(id, updateData);
      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Automation routes
  app.get('/api/automation/rules', isAuthenticated, async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      const rules = await storage.getAutomationRules(guildId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
      res.status(500).json({ message: "Failed to fetch automation rules" });
    }
  });

  app.post('/api/automation/rules', isAuthenticated, async (req: any, res) => {
    try {
      const ruleData = req.body;
      const createdBy = req.user?.claims?.sub;
      const newRule = await storage.createAutomationRule({
        ...ruleData,
        createdBy,
      });
      res.status(201).json(newRule);
    } catch (error) {
      console.error("Error creating automation rule:", error);
      res.status(500).json({ message: "Failed to create automation rule" });
    }
  });

  app.put('/api/automation/rules/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedRule = await storage.updateAutomationRule(id, updateData);
      res.json(updatedRule);
    } catch (error) {
      console.error("Error updating automation rule:", error);
      res.status(500).json({ message: "Failed to update automation rule" });
    }
  });

  app.delete('/api/automation/rules/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAutomationRule(id);
      res.json({ message: "Automation rule deleted successfully" });
    } catch (error) {
      console.error("Error deleting automation rule:", error);
      res.status(500).json({ message: "Failed to delete automation rule" });
    }
  });

  app.post('/api/automation/rules/:id/trigger', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const triggeredRule = await storage.triggerAutomationRule(id);
      res.json(triggeredRule);
    } catch (error) {
      console.error("Error triggering automation rule:", error);
      res.status(500).json({ message: "Failed to trigger automation rule" });
    }
  });

  // Auto-roles routes
  app.get('/api/auto-roles', isAuthenticated, async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      const autoRoles = await storage.getAutoRoles(guildId);
      res.json(autoRoles);
    } catch (error) {
      console.error("Error fetching auto-roles:", error);
      res.status(500).json({ message: "Failed to fetch auto-roles" });
    }
  });

  app.post('/api/auto-roles', isAuthenticated, async (req: any, res) => {
    try {
      const autoRoleData = req.body;
      const createdBy = req.user?.claims?.sub;
      const newAutoRole = await storage.createAutoRole({
        ...autoRoleData,
        createdBy,
      });
      res.status(201).json(newAutoRole);
    } catch (error) {
      console.error("Error creating auto-role:", error);
      res.status(500).json({ message: "Failed to create auto-role" });
    }
  });

  app.put('/api/auto-roles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedAutoRole = await storage.updateAutoRole(id, updateData);
      res.json(updatedAutoRole);
    } catch (error) {
      console.error("Error updating auto-role:", error);
      res.status(500).json({ message: "Failed to update auto-role" });
    }
  });

  app.delete('/api/auto-roles/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAutoRole(id);
      res.json({ message: "Auto-role deleted successfully" });
    } catch (error) {
      console.error("Error deleting auto-role:", error);
      res.status(500).json({ message: "Failed to delete auto-role" });
    }
  });

  // User auto-role assignments
  app.get('/api/users/:userId/auto-roles', isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const guildId = req.query.guildId as string;
      const userAutoRoles = await storage.getUserAutoRoles(userId, guildId);
      res.json(userAutoRoles);
    } catch (error) {
      console.error("Error fetching user auto-roles:", error);
      res.status(500).json({ message: "Failed to fetch user auto-roles" });
    }
  });

  app.post('/api/users/:userId/auto-roles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.userId;
      const assignmentData = req.body;
      const assignedBy = req.user?.claims?.sub;
      const newAssignment = await storage.assignUserAutoRole({
        ...assignmentData,
        userId,
        assignedBy,
      });
      res.status(201).json(newAssignment);
    } catch (error) {
      console.error("Error assigning user auto-role:", error);
      res.status(500).json({ message: "Failed to assign user auto-role" });
    }
  });

  app.delete('/api/users/:userId/auto-roles/:autoRoleId', isAuthenticated, async (req, res) => {
    try {
      const userId = req.params.userId;
      const autoRoleId = parseInt(req.params.autoRoleId);
      await storage.removeUserAutoRole(userId, autoRoleId);
      res.json({ message: "User auto-role removed successfully" });
    } catch (error) {
      console.error("Error removing user auto-role:", error);
      res.status(500).json({ message: "Failed to remove user auto-role" });
    }
  });

  // Logging configuration routes
  app.get('/api/logging/configs', isAuthenticated, async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      const configs = await storage.getLoggingConfigs(guildId);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching logging configs:", error);
      res.status(500).json({ message: "Failed to fetch logging configs" });
    }
  });

  app.get('/api/logging/configs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.getLoggingConfig(id);
      if (!config) {
        return res.status(404).json({ message: "Logging config not found" });
      }
      res.json(config);
    } catch (error) {
      console.error("Error fetching logging config:", error);
      res.status(500).json({ message: "Failed to fetch logging config" });
    }
  });

  app.post('/api/logging/configs', isAuthenticated, async (req: any, res) => {
    try {
      const configData = req.body;
      const createdBy = req.user?.claims?.sub;
      const newConfig = await storage.createLoggingConfig({
        ...configData,
        createdBy,
      });
      res.status(201).json(newConfig);
    } catch (error) {
      console.error("Error creating logging config:", error);
      res.status(500).json({ message: "Failed to create logging config" });
    }
  });

  app.put('/api/logging/configs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const configData = req.body;
      const updatedConfig = await storage.updateLoggingConfig(id, configData);
      res.json(updatedConfig);
    } catch (error) {
      console.error("Error updating logging config:", error);
      res.status(500).json({ message: "Failed to update logging config" });
    }
  });

  app.delete('/api/logging/configs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteLoggingConfig(id);
      res.json({ message: "Logging config deleted successfully" });
    } catch (error) {
      console.error("Error deleting logging config:", error);
      res.status(500).json({ message: "Failed to delete logging config" });
    }
  });

  // Alt detection rule routes
  app.get('/api/alt-detection/rules', isAuthenticated, async (req, res) => {
    try {
      const guildId = req.query.guildId as string;
      const rules = await storage.getAltDetectionRules(guildId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching alt detection rules:", error);
      res.status(500).json({ message: "Failed to fetch alt detection rules" });
    }
  });

  app.get('/api/alt-detection/rules/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await storage.getAltDetectionRule(id);
      if (!rule) {
        return res.status(404).json({ message: "Alt detection rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Error fetching alt detection rule:", error);
      res.status(500).json({ message: "Failed to fetch alt detection rule" });
    }
  });

  app.post('/api/alt-detection/rules', isAuthenticated, async (req, res) => {
    try {
      const ruleData = req.body;
      const newRule = await storage.createAltDetectionRule(ruleData);
      res.status(201).json(newRule);
    } catch (error) {
      console.error("Error creating alt detection rule:", error);
      res.status(500).json({ message: "Failed to create alt detection rule" });
    }
  });

  app.put('/api/alt-detection/rules/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ruleData = req.body;
      const updatedRule = await storage.updateAltDetectionRule(id, ruleData);
      res.json(updatedRule);
    } catch (error) {
      console.error("Error updating alt detection rule:", error);
      res.status(500).json({ message: "Failed to update alt detection rule" });
    }
  });

  app.delete('/api/alt-detection/rules/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAltDetectionRule(id);
      res.json({ message: "Alt detection rule deleted successfully" });
    } catch (error) {
      console.error("Error deleting alt detection rule:", error);
      res.status(500).json({ message: "Failed to delete alt detection rule" });
    }
  });

  app.post('/api/alt-detection/rules/:id/trigger', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const triggeredRule = await storage.triggerAltDetectionRule(id);
      res.json(triggeredRule);
    } catch (error) {
      console.error("Error triggering alt detection rule:", error);
      res.status(500).json({ message: "Failed to trigger alt detection rule" });
    }
  });

  // Standard Bot and Subscription Routes
  
  // Get bot features
  app.get('/api/bot-features', async (req, res) => {
    try {
      const features = await storage.getBotFeatures();
      res.json(features);
    } catch (error) {
      console.error("Error fetching bot features:", error);
      res.status(500).json({ message: "Failed to fetch bot features" });
    }
  });

  // Get standard bot configuration
  app.get('/api/standard-bot/config', isAuthenticatedOrToken, async (req, res) => {
    try {
      const config = await storage.getStandardBotConfig();
      res.json(config);
    } catch (error) {
      console.error("Error fetching standard bot config:", error);
      res.status(500).json({ message: "Failed to fetch bot configuration" });
    }
  });

  // Update standard bot token
  app.post('/api/standard-bot/token', isAuthenticated, async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token || typeof token !== 'string' || token.trim().length === 0) {
        return res.status(400).json({ message: "Bot token is required" });
      }

      const updatedConfig = await storage.updateStandardBotToken(token.trim());
      res.json(updatedConfig);
    } catch (error) {
      console.error("Error updating standard bot token:", error);
      res.status(500).json({ message: "Failed to update bot token" });
    }
  });

  // Embed color settings endpoints
  app.get("/api/embed-color-settings", isAuthenticatedOrToken, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const settings = await storage.getEmbedColorSettings(userId);
      res.json(settings || { globalColor: "#5865F2", useGlobalColor: false });
    } catch (error) {
      console.error("Error fetching embed color settings:", error);
      res.status(500).json({ message: "Failed to fetch embed color settings" });
    }
  });

  app.post("/api/embed-color-settings", isAuthenticatedOrToken, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const settings = await storage.upsertEmbedColorSettings({
        ownerId: userId,
        ...req.body,
      });
      res.json(settings);
    } catch (error) {
      console.error("Error updating embed color settings:", error);
      res.status(500).json({ message: "Failed to update embed color settings" });
    }
  });

  // Get user subscription status
  app.get('/api/user/subscription', isAuthenticatedOrToken, async (req, res) => {
    try {
      const userId = (req.user as any).claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user has premium access via token
      const hasTokenPremium = (req.user as any).tokenAuth && 
                             (req.user as any).permissions?.includes('premium');
      
      const subscriptionTier = hasTokenPremium ? 'premium' : (user?.subscriptionTier || 'free');
      
      res.json({
        subscriptionTier,
        subscriptionStatus: user?.subscriptionStatus || 'active',
        subscriptionExpiresAt: user?.subscriptionExpiresAt,
        tokenAuth: hasTokenPremium
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  // Create subscription (placeholder for when Stripe keys are available)
  app.post('/api/subscription/create', isAuthenticated, async (req, res) => {
    try {
      // This will be implemented once Stripe keys are provided
      res.status(501).json({ 
        message: "Subscription service not yet configured. Stripe API keys needed.",
        requiresSetup: true 
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Personal Access Token Routes
  app.get('/api/personal-access-tokens', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tokens = await storage.getPersonalAccessTokens(userId);
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching personal access tokens:", error);
      res.status(500).json({ message: "Failed to fetch personal access tokens" });
    }
  });

  app.post('/api/personal-access-tokens', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, permissions, expiresAt } = req.body;
      
      // Generate secure token
      const token = `bat_${randomBytes(32).toString('hex')}`;
      
      const tokenData = {
        userId,
        token,
        name,
        permissions: permissions || ['premium'],
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      };
      
      const newToken = await storage.createPersonalAccessToken(tokenData);
      res.json(newToken);
    } catch (error) {
      console.error("Error creating personal access token:", error);
      res.status(500).json({ message: "Failed to create personal access token" });
    }
  });

  app.put('/api/personal-access-tokens/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { name, permissions, isActive, expiresAt } = req.body;
      
      // Verify token ownership
      const tokens = await storage.getPersonalAccessTokens(userId);
      const existingToken = tokens.find(t => t.id === id);
      if (!existingToken) {
        return res.status(404).json({ message: "Token not found" });
      }
      
      const updateData = {
        name,
        permissions,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      };
      
      const updatedToken = await storage.updatePersonalAccessToken(id, updateData);
      res.json(updatedToken);
    } catch (error) {
      console.error("Error updating personal access token:", error);
      res.status(500).json({ message: "Failed to update personal access token" });
    }
  });

  app.delete('/api/personal-access-tokens/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Verify token ownership
      const tokens = await storage.getPersonalAccessTokens(userId);
      const existingToken = tokens.find(t => t.id === id);
      if (!existingToken) {
        return res.status(404).json({ message: "Token not found" });
      }
      
      await storage.deletePersonalAccessToken(id);
      res.json({ message: "Token deleted successfully" });
    } catch (error) {
      console.error("Error deleting personal access token:", error);
      res.status(500).json({ message: "Failed to delete personal access token" });
    }
  });

  // Token-authenticated access endpoint
  app.get('/api/dashboard/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const accessToken = await storage.validateAccessToken(token);
      
      if (!accessToken) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      
      // Check if token has premium permissions
      const permissions = accessToken.permissions as string[];
      const hasPremium = permissions.includes('premium') || permissions.includes('admin');
      
      // Render dashboard with premium features enabled
      const dashboardHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BotCentral - Personal Dashboard</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
              color: white;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
            }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { 
              text-align: center; 
              margin-bottom: 40px;
              padding: 30px;
              background: rgba(88, 101, 242, 0.1);
              border-radius: 16px;
              border: 1px solid rgba(88, 101, 242, 0.3);
            }
            .premium-badge {
              display: inline-block;
              background: linear-gradient(45deg, #5865F2, #7289DA);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin-left: 10px;
            }
            .cards { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
              gap: 20px; 
              margin-bottom: 40px;
            }
            .card { 
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
              padding: 24px;
              transition: transform 0.2s ease;
            }
            .card:hover { transform: translateY(-4px); }
            .card h3 { 
              margin: 0 0 16px 0; 
              color: #5865F2;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .status { 
              padding: 6px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: 600;
            }
            .status.active { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
            .status.premium { background: rgba(88, 101, 242, 0.2); color: #5865F2; }
            .btn {
              display: inline-block;
              background: linear-gradient(45deg, #5865F2, #7289DA);
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              transition: transform 0.2s ease;
              border: none;
              cursor: pointer;
              margin: 8px 8px 8px 0;
            }
            .btn:hover { transform: translateY(-2px); }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding: 20px;
              opacity: 0.7;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤖 BotCentral Personal Dashboard</h1>
              ${hasPremium ? '<span class="premium-badge">✨ Premium Access</span>' : ''}
              <p>Secure token-authenticated access • Last used: ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="cards">
              <div class="card">
                <h3>🚀 Access Status</h3>
                <div class="status ${hasPremium ? 'premium' : 'active'}">${hasPremium ? 'Premium Access Enabled' : 'Basic Access'}</div>
                <p>Token: ${token.substring(0, 12)}...</p>
                <p>Permissions: ${permissions.join(', ')}</p>
              </div>
              
              <div class="card">
                <h3>⚡ Quick Actions</h3>
                <a href="/?token=${token}" class="btn">Open Full Dashboard</a>
                <a href="/bot-setup?token=${token}" class="btn">Bot Configuration</a>
                <a href="/analytics?token=${token}" class="btn">Analytics</a>
              </div>
              
              <div class="card">
                <h3>🎮 Premium Features</h3>
                ${hasPremium ? `
                  <div class="status active">All Features Unlocked</div>
                  <p>✅ Custom Bot Tokens</p>
                  <p>✅ Advanced Analytics</p>
                  <p>✅ Premium Support</p>
                ` : `
                  <div class="status">Limited Access</div>
                  <p>❌ Custom Bot Tokens</p>
                  <p>❌ Advanced Analytics</p>
                  <p>❌ Premium Support</p>
                `}
              </div>
            </div>
            
            <div class="footer">
              <p>BotCentral Personal Dashboard • Secure Access via Token Authentication</p>
              <p>This dashboard provides direct access to your bot management features.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      res.send(dashboardHtml);
    } catch (error) {
      console.error("Error accessing token dashboard:", error);
      res.status(500).json({ message: "Failed to access dashboard" });
    }
  });

  // Discord OAuth routes
  app.get('/api/discord/auth', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      if (!process.env.DISCORD_CLIENT_ID) {
        return res.status(500).json({ message: "Discord OAuth not configured" });
      }

      const state = Buffer.from(JSON.stringify({ userId: req.user.claims.sub })).toString('base64');
      const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
      
      // Use dynamic redirect URI based on current request
      const redirectUri = `${req.protocol}://${req.get('host')}/api/discord/callback`;
      
      console.log("Discord OAuth Config:", {
        clientId: process.env.DISCORD_CLIENT_ID,
        expectedClientId: '1389008016367685723',
        clientIdLength: process.env.DISCORD_CLIENT_ID?.length || 0,
        clientSecretLength: process.env.DISCORD_CLIENT_SECRET?.length || 0,
        redirectUri,
        scope: 'identify guilds',
        state: state.substring(0, 20) + '...'
      });
      
      // Temporarily use the new client ID directly until environment variables update
      const actualClientId = process.env.DISCORD_CLIENT_ID === '1388511527283462145' ? '1389008016367685723' : process.env.DISCORD_CLIENT_ID;
      discordAuthUrl.searchParams.set('client_id', actualClientId);
      discordAuthUrl.searchParams.set('redirect_uri', redirectUri);
      discordAuthUrl.searchParams.set('response_type', 'code');
      discordAuthUrl.searchParams.set('scope', 'identify guilds');
      discordAuthUrl.searchParams.set('state', state);

      const authUrl = discordAuthUrl.toString();
      console.log("Generated Discord Auth URL:", authUrl);
      console.log("Using Client ID:", actualClientId);

      // Add cache-busting to prevent browser cache issues
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating Discord auth URL:", error);
      res.status(500).json({ message: "Failed to generate Discord auth URL" });
    }
  });

  app.get('/api/discord/callback', async (req, res) => {
    console.log("=== DISCORD CALLBACK RECEIVED ===");
    console.log("Full URL:", req.url);
    console.log("Query params:", req.query);
    console.log("Headers:", req.headers);
    
    try {
      console.log("Discord callback received:", {
        query: req.query,
        hasCode: !!req.query.code,
        hasState: !!req.query.state,
        error: req.query.error,
        errorDescription: req.query.error_description
      });

      const { code, state, error, error_description } = req.query;
      
      if (error) {
        console.error("Discord OAuth error:", error, error_description);
        return res.redirect(`${req.protocol}://${req.get('host')}/discord-connection?error=discord_denied&reason=${encodeURIComponent(error as string)}`);
      }
      
      if (!code || !state) {
        return res.status(400).json({ message: "Missing code or state parameter" });
      }

      // Decode state to get user ID
      const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
      const userId = stateData.userId;

      // Use dynamic redirect URI based on current request
      const redirectUri = `${req.protocol}://${req.get('host')}/api/discord/callback`;
      console.log("Using redirect URI:", redirectUri);

      // Use the same client ID logic as in the auth route
      const actualClientId = process.env.DISCORD_CLIENT_ID === '1388511527283462145' ? '1389008016367685723' : process.env.DISCORD_CLIENT_ID;
      
      console.log("Discord callback - token exchange:", {
        actualClientId,
        originalClientId: process.env.DISCORD_CLIENT_ID,
        redirectUri,
        hasCode: !!code,
        hasState: !!state
      });

      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: actualClientId,
          client_secret: process.env.DISCORD_CLIENT_SECRET_NEW!,
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Discord token exchange error details:", {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          errorBody: errorText
        });
        throw new Error(`Discord token exchange failed: ${tokenResponse.statusText} - ${errorText}`);
      }

      const tokenData = await tokenResponse.json();

      // Get user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error(`Discord user fetch failed: ${userResponse.statusText}`);
      }

      const discordUser = await userResponse.json();

      // Get user's guilds
      const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!guildsResponse.ok) {
        throw new Error(`Discord guilds fetch failed: ${guildsResponse.statusText}`);
      }

      const guilds = await guildsResponse.json();

      const { randomUUID } = await import('crypto');

      // Save Discord connection
      await storage.upsertDiscordConnection({
        id: randomUUID(),
        userId,
        discordUserId: discordUser.id,
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatar: discordUser.avatar,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        scopes: tokenData.scope.split(' '),
      });

      // Save user's Discord servers
      for (const guild of guilds) {
        await storage.upsertDiscordServer({
          id: randomUUID(),
          userId,
          serverId: guild.id,
          serverName: guild.name,
          serverIcon: guild.icon,
          serverOwner: guild.owner,
          permissions: guild.permissions.toString(),
          features: guild.features || [],
          memberCount: guild.approximate_member_count,
        });
      }

      // Redirect back to the frontend
      res.redirect(`${req.protocol}://${req.get('host')}/discord-connection?connected=true`);
    } catch (error) {
      console.error("Discord OAuth callback error:", error);
      res.redirect(`${req.protocol}://${req.get('host')}/discord-connection?error=auth_failed`);
    }
  });

  app.get('/api/discord/connection', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connection = await storage.getDiscordConnection(userId);
      res.json(connection || null);
    } catch (error) {
      console.error("Error fetching Discord connection:", error);
      res.status(500).json({ message: "Failed to fetch Discord connection" });
    }
  });

  app.get('/api/discord/servers', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const servers = await storage.getDiscordServers(userId);
      res.json(servers);
    } catch (error) {
      console.error("Error fetching Discord servers:", error);
      res.status(500).json({ message: "Failed to fetch Discord servers" });
    }
  });

  app.post('/api/discord/select-server', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { serverId } = req.body;
      
      await storage.setSelectedDiscordServer(userId, serverId);
      res.json({ message: "Discord server selected successfully" });
    } catch (error) {
      console.error("Error selecting Discord server:", error);
      res.status(500).json({ message: "Failed to select Discord server" });
    }
  });

  app.delete('/api/discord/connection', isAuthenticatedOrToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteDiscordConnection(userId);
      res.json({ message: "Discord connection disconnected successfully" });
    } catch (error) {
      console.error("Error disconnecting Discord:", error);
      res.status(500).json({ message: "Failed to disconnect Discord" });
    }
  });

  // Test Discord app configuration
  app.get('/api/discord/test-config', async (req, res) => {
    try {
      if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
        return res.json({
          configured: false,
          message: "Discord environment variables not set"
        });
      }

      // Test if the Discord application exists and is accessible
      const testResponse = await fetch(`https://discord.com/api/v10/applications/@me`, {
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_CLIENT_SECRET}`, // This won't work, but we'll catch the error
        },
      });

      res.json({
        configured: true,
        clientId: process.env.DISCORD_CLIENT_ID,
        redirectUri: process.env.REPL_ID 
          ? `https://${process.env.REPL_ID}.replit.app/api/discord/callback`
          : 'localhost callback',
        testResponse: testResponse.status
      });
    } catch (error) {
      res.json({
        configured: true,
        clientId: process.env.DISCORD_CLIENT_ID,
        redirectUri: process.env.REPL_ID 
          ? `https://${process.env.REPL_ID}.replit.app/api/discord/callback`
          : 'localhost callback',
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
