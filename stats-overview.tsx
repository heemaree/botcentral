import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FaRobot, FaServer, FaUsers, FaTerminal } from "react-icons/fa";

interface DashboardStats {
  activeBots: number;
  totalServers: number;
  activeUsers: number;
  commandsPerDay: number;
  upcomingEvents: any[];
  recentActivity: any[];
}

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const statCards = [
    {
      title: "Active Bots",
      value: stats?.activeBots || 0,
      change: "+2 this month",
      icon: FaRobot,
      color: "gaming-emerald",
    },
    {
      title: "Total Servers",
      value: stats?.totalServers || 0,
      change: "+15 this week",
      icon: FaServer,
      color: "discord-primary",
    },
    {
      title: "Active Users",
      value: `${((stats?.activeUsers || 0) / 1000).toFixed(1)}K`,
      change: "+1.2K today",
      icon: FaUsers,
      color: "gaming-purple",
    },
    {
      title: "Commands/Day",
      value: `${((stats?.commandsPerDay || 0) / 1000).toFixed(1)}K`,
      change: "+312 vs yesterday",
      icon: FaTerminal,
      color: "gaming-cyan",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="gaming-card border-[hsl(var(--gaming-border))]">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-24"></div>
                    <div className="h-8 bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="gaming-card border-[hsl(var(--gaming-border))] hover:border-[hsl(var(--discord-primary))] transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-[hsl(var(--gaming-emerald))] text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-[hsl(var(--${stat.color}))]/20 rounded-lg flex items-center justify-center`}>
                  <Icon className={`text-[hsl(var(--${stat.color}))] text-xl`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
