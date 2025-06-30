import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Event } from "@shared/schema";
import { FaCalendarPlus, FaTrophy, FaFilm, FaHandshake, FaUsers } from "react-icons/fa";

export default function UpcomingEvents() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const getEventIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("tournament") || titleLower.includes("competition")) {
      return <FaTrophy className="text-[hsl(var(--gaming-amber))]" />;
    }
    if (titleLower.includes("movie") || titleLower.includes("film")) {
      return <FaFilm className="text-[hsl(var(--gaming-purple))]" />;
    }
    if (titleLower.includes("meetup") || titleLower.includes("community")) {
      return <FaHandshake className="text-[hsl(var(--gaming-emerald))]" />;
    }
    return <FaTrophy className="text-[hsl(var(--gaming-cyan))]" />;
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }
    
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const upcomingEvents = events?.filter(event => new Date(event.date) > new Date()).slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card className="gaming-card border-[hsl(var(--gaming-border))]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 gaming-bg rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-700 rounded w-24"></div>
                    <div className="h-3 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
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
          <CardTitle className="text-xl font-semibold text-white">Upcoming Events</CardTitle>
          <Button variant="ghost" className="text-[hsl(var(--discord-primary))] hover:text-[hsl(var(--discord-light))] transition-colors">
            <FaCalendarPlus />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 gaming-bg rounded-lg border border-[hsl(var(--gaming-border))] hover:border-[hsl(var(--gaming-cyan))] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">{formatEventDate(event.date)}</p>
                    <div className="flex items-center mt-2">
                      <FaUsers className="text-[hsl(var(--gaming-cyan))] text-sm mr-1" />
                      <span className="text-sm text-gray-400">{event.attendeeCount || 0} attending</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-[hsl(var(--gaming-cyan))]/20 rounded-lg flex items-center justify-center">
                    {getEventIcon(event.title)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FaCalendarPlus className="text-4xl text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No upcoming events</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
