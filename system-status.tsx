import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SystemStatus() {
  // Mock system health data - in a real app this would come from monitoring APIs
  const systemHealth = {
    api: 'operational',
    database: 'operational',
    discord: 'operational',
  };

  const uptime = 99.98;
  const memoryUsage = 68;

  const statusItems = [
    { name: "API Gateway", status: systemHealth.api },
    { name: "Database", status: systemHealth.database },
    { name: "Discord API", status: systemHealth.discord },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'status-online';
      case 'degraded': return 'status-idle';
      default: return 'status-offline';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card className="gaming-card border-[hsl(var(--gaming-border))]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 gaming-bg rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 bg-[hsl(var(--${getStatusColor(item.status)}))] rounded-full`}></div>
                <span className="text-white">{item.name}</span>
              </div>
              <span className={`text-sm font-medium text-[hsl(var(--${getStatusColor(item.status)}))]`}>
                {getStatusText(item.status)}
              </span>
            </div>
          ))}

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Server Uptime</span>
              <span className="text-sm text-white font-mono">{uptime}%</span>
            </div>
            <div className="w-full gaming-bg rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[hsl(var(--gaming-emerald))] to-[hsl(var(--gaming-cyan))] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uptime}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Memory Usage</span>
              <span className="text-sm text-white font-mono">{memoryUsage}%</span>
            </div>
            <div className="w-full gaming-bg rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[hsl(var(--gaming-amber))] to-[hsl(var(--gaming-emerald))] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
