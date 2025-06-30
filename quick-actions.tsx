import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FaPlus, FaCogs, FaDownload, FaChartBar } from "react-icons/fa";

export default function QuickActions() {
  const { toast } = useToast();

  const handleAction = (actionName: string) => {
    toast({
      title: "Action Triggered",
      description: `${actionName} functionality would be implemented here`,
    });
  };

  const actions = [
    {
      name: "Create New Bot",
      icon: FaPlus,
      action: () => handleAction("Create New Bot"),
      primary: true,
    },
    {
      name: "Bulk Configuration",
      icon: FaCogs,
      action: () => handleAction("Bulk Configuration"),
    },
    {
      name: "Export Logs",
      icon: FaDownload,
      action: () => handleAction("Export Logs"),
    },
    {
      name: "View Analytics",
      icon: FaChartBar,
      action: () => handleAction("View Analytics"),
    },
  ];

  return (
    <Card className="gaming-card border-[hsl(var(--gaming-border))]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                className={`w-full py-3 px-4 transition-all flex items-center justify-center space-x-2 ${
                  action.primary
                    ? "bg-[hsl(var(--discord-primary))] hover:bg-[hsl(var(--discord-dark))] text-white glow-effect"
                    : "gaming-bg hover:bg-[hsl(var(--gaming-hover))] text-white border border-[hsl(var(--gaming-border))] hover:border-[hsl(var(--discord-primary))]"
                }`}
                variant={action.primary ? "default" : "outline"}
              >
                <Icon />
                <span>{action.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
