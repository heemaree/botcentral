import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type ActivityLog } from "@shared/schema";
import { FaArrowRight } from "react-icons/fa";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
  });

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'bot_created':
      case 'bot_updated':
        return 'gaming-emerald';
      case 'event_created':
        return 'gaming-cyan';
      case 'bot_deleted':
        return 'status-offline';
      case 'announcement_created':
        return 'gaming-purple';
      default:
        return 'gaming-amber';
    }
  };

  if (isLoading) {
    return (
      <Card className="gaming-card border-[hsl(var(--gaming-border))]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3 p-3 gaming-bg rounded-lg">
                <div className="w-2 h-2 bg-gray-700 rounded-full mt-2"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
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
          <CardTitle className="text-xl font-semibold text-white">Recent Activity</CardTitle>
          <Button variant="ghost" className="text-[hsl(var(--discord-primary))] hover:text-[hsl(var(--discord-light))] transition-colors text-sm font-medium">
            View All <FaArrowRight className="ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 gaming-bg rounded-lg">
                <div className={`w-2 h-2 bg-[hsl(var(--${getActivityColor(activity.action)}))] rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
