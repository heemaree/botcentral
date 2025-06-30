import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Bot } from "@shared/schema";
import { FaRobot, FaPlus, FaCog, FaFileAlt, FaUsers, FaServer } from "react-icons/fa";

export default function BotStatusCards() {
  const { data: bots, isLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[hsl(var(--status-online))]';
      case 'idle': return 'bg-[hsl(var(--status-idle))]';
      default: return 'bg-[hsl(var(--status-offline))]';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getAvatarForBot = (botName: string) => {
    // Return different placeholder images based on bot type
    if (botName.toLowerCase().includes('mod')) {
      return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
    }
    if (botName.toLowerCase().includes('event')) {
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
    }
    if (botName.toLowerCase().includes('music')) {
      return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
    }
    return "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&w=100&h=100&fit=crop";
  };

  if (isLoading) {
    return (
      <Card className="gaming-card border-[hsl(var(--gaming-border))]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Bot Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 gaming-bg rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-x-2 flex">
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                  <div className="w-8 h-8 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gaming-card border-[hsl(var(--gaming-border))]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">Bot Status</CardTitle>
          <Button className="bg-[hsl(var(--discord-primary))] hover:bg-[hsl(var(--discord-dark))] text-white glow-effect">
            <FaPlus className="mr-2" />
            Add Bot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bots && bots.length > 0 ? (
            bots.slice(0, 3).map((bot) => (
              <div key={bot.id} className="flex items-center justify-between p-4 gaming-bg rounded-lg border border-[hsl(var(--gaming-border))] hover:border-[hsl(var(--discord-primary))] transition-all">
                <div className="flex items-center space-x-4">
                  <img 
                    src={bot.avatarUrl || getAvatarForBot(bot.name)} 
                    alt={`${bot.name} avatar`} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                  <div>
                    <h4 className="font-semibold text-white">{bot.name}</h4>
                    <p className="text-sm text-gray-400">{bot.description || "No description"}</p>
                    <div className="flex items-center mt-1 space-x-4">
                      <div className="flex items-center space-x-1">
                        <FaServer className="text-xs text-gray-400" />
                        <span className="text-xs text-gray-400">{bot.serverCount || 0} servers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaUsers className="text-xs text-gray-400" />
                        <span className="text-xs text-gray-400">{bot.userCount || 0} users</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse-slow ${getStatusColor(bot.status)}`}></div>
                    <span className={`text-sm font-medium ${
                      bot.status === 'online' ? 'text-[hsl(var(--status-online))]' :
                      bot.status === 'idle' ? 'text-[hsl(var(--status-idle))]' :
                      'text-[hsl(var(--status-offline))]'
                    }`}>
                      {getStatusText(bot.status)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-white transition-colors">
                      <FaCog />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-[hsl(var(--gaming-amber))] transition-colors">
                      <FaFileAlt />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FaRobot className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Bots Found</h3>
              <p className="text-gray-400 mb-4">Create your first bot to get started</p>
              <Button className="bg-[hsl(var(--discord-primary))] hover:bg-[hsl(var(--discord-dark))] text-white">
                <FaPlus className="mr-2" />
                Create Bot
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
