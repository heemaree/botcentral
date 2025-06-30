import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import BotManagement from "@/pages/bot-management";
import StandardBot from "@/pages/standard-bot";
import Community from "@/pages/community";
import Events from "@/pages/events";
import Polls from "@/pages/polls";
import Leaderboards from "@/pages/leaderboards";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import DiscordSettings from "@/pages/discord-settings";
import Moderation from "@/pages/moderation";
import FreeFeatures from "@/pages/free-features";
import CommunityManagement from "@/pages/community-management";
import ServerManagement from "@/pages/server-management";

import PremiumPlans from "@/pages/premium-plans";
import CustomEmbedsPage from "@/pages/custom-embeds";
import ReactionRolesPage from "@/pages/reaction-roles";
import TicketsPage from "@/pages/tickets";
import Rewards from "@/pages/rewards";
import LevelSystem from "@/pages/level-system";
import MessageRewards from "@/pages/message-rewards";
import InviteRewards from "@/pages/invite-rewards";
import ChannelStats from "@/pages/channel-stats";
import BoosterAnnouncements from "@/pages/booster-announcements";
import BotSetup from "@/pages/bot-setup";
import DiscordConnection from "@/pages/discord-connection";

import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/custom-embeds" component={CustomEmbedsPage} />
          <Route path="/reaction-roles" component={ReactionRolesPage} />
          <Route path="/channel-stats" component={ChannelStats} />
          <Route path="/booster-announcements" component={BoosterAnnouncements} />
          <Route path="/tickets" component={TicketsPage} />
          <Route path="/community-management" component={CommunityManagement} />
          <Route path="/moderation-management" component={ServerManagement} />

          <Route path="/premium-plans" component={PremiumPlans} />
          <Route path="/bots" component={BotManagement} />
          <Route path="/standard-bot" component={StandardBot} />
          <Route path="/premium-plan" component={StandardBot} />
          <Route path="/bot-setup" component={BotSetup} />

          <Route path="/community" component={Community} />
          <Route path="/events" component={Events} />
          <Route path="/polls" component={Polls} />
          <Route path="/leaderboards" component={Leaderboards} />
          <Route path="/rewards" component={Rewards} />
          <Route path="/level-system" component={LevelSystem} />
          <Route path="/message-rewards" component={MessageRewards} />
          <Route path="/invite-rewards" component={InviteRewards} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/moderation" component={Moderation} />
          <Route path="/settings" component={Settings} />
          <Route path="/discord" component={DiscordSettings} />
          <Route path="/discord-connection" component={DiscordConnection} />
          <Route path="/discord-settings" component={DiscordConnection} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
