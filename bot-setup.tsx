import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaRobot, FaDiscord, FaCheckCircle, FaPlusCircle, FaExternalLinkAlt, FaMagic, FaCrown } from "react-icons/fa";
import { Link } from "wouter";

export default function BotSetup() {
  const { data: botConfig } = useQuery({
    queryKey: ["/api/standard-bot/config"],
  });

  const { data: subscription } = useQuery({
    queryKey: ["/api/user/subscription"],
  });

  const isPremium = subscription?.subscriptionTier === "premium";

  const inviteUrl = botConfig?.clientId 
    ? `https://discord.com/api/oauth2/authorize?client_id=${botConfig.clientId}&permissions=8&scope=bot`
    : "#";

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Bot Setup</h2>
        <p className="text-gray-400">Get started with BotCentral for your Discord server</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standard Bot Setup */}
        <Card className="bg-[hsl(230,12%,9%)] border-[hsl(30,3%,22%)]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FaRobot className="mr-3 text-[hsl(258,84%,67%)]" />
              Standard Bot (Free)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(142,76%,36%)] text-sm" />
                <span className="text-white text-sm">Basic moderation tools</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(142,76%,36%)] text-sm" />
                <span className="text-white text-sm">Welcome messages</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(142,76%,36%)] text-sm" />
                <span className="text-white text-sm">Reaction roles (3 embeds)</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(142,76%,36%)] text-sm" />
                <span className="text-white text-sm">Custom embeds (3 embeds)</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(142,76%,36%)] text-sm" />
                <span className="text-white text-sm">Level system</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[hsl(30,3%,22%)]">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Bot Name:</span>
                  <span className="text-white text-sm">{botConfig?.name || "BotCentral"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status:</span>
                  <Badge variant="secondary" className="bg-[hsl(142,76%,36%)]/20 text-[hsl(142,76%,36%)]">
                    Ready
                  </Badge>
                </div>
              </div>

              <Button
                asChild
                className="w-full bg-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)]/80 text-white"
              >
                <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
                  <FaDiscord className="mr-2" />
                  Add to Discord
                  <FaExternalLinkAlt className="ml-2 text-xs" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium Bot Setup */}
        <Card className="bg-[hsl(230,12%,9%)] border-[hsl(258,84%,67%)]/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FaCrown className="mr-3 text-[hsl(258,84%,67%)]" />
              Custom Bot (Premium)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(258,84%,67%)] text-sm" />
                <span className="text-white text-sm">All free features</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(258,84%,67%)] text-sm" />
                <span className="text-white text-sm">Custom bot name & avatar</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(258,84%,67%)] text-sm" />
                <span className="text-white text-sm">Unlimited embeds & roles</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(258,84%,67%)] text-sm" />
                <span className="text-white text-sm">Advanced moderation</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-[hsl(258,84%,67%)] text-sm" />
                <span className="text-white text-sm">Server analytics</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[hsl(30,3%,22%)]">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Plan:</span>
                  <Badge 
                    variant={isPremium ? "secondary" : "outline"} 
                    className={isPremium 
                      ? "bg-[hsl(258,84%,67%)]/20 text-[hsl(258,84%,67%)]" 
                      : "border-[hsl(30,3%,22%)] text-gray-400"
                    }
                  >
                    {isPremium ? "Premium Active" : "Free Plan"}
                  </Badge>
                </div>
                {isPremium && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status:</span>
                    <Badge variant="secondary" className="bg-[hsl(142,76%,36%)]/20 text-[hsl(142,76%,36%)]">
                      Ready to Configure
                    </Badge>
                  </div>
                )}
              </div>

              {isPremium ? (
                <Button
                  asChild
                  className="w-full bg-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)]/80 text-white"
                >
                  <Link href="/premium-plans">
                    <FaMagic className="mr-2" />
                    Configure Custom Bot
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-[hsl(258,84%,67%)] text-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)]/10"
                >
                  <Link href="/premium-plans">
                    <FaPlusCircle className="mr-2" />
                    Upgrade to Premium
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Setup Guide */}
      <Card className="bg-[hsl(230,12%,9%)] border-[hsl(30,3%,22%)]">
        <CardHeader>
          <CardTitle className="text-white">Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[hsl(258,84%,67%)]/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-[hsl(258,84%,67%)] font-bold">1</span>
              </div>
              <h4 className="text-white font-medium">Add Bot to Server</h4>
              <p className="text-gray-400 text-sm">Click "Add to Discord" and select your server</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[hsl(258,84%,67%)]/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-[hsl(258,84%,67%)] font-bold">2</span>
              </div>
              <h4 className="text-white font-medium">Configure Features</h4>
              <p className="text-gray-400 text-sm">Set up your welcome messages, roles, and moderation</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[hsl(258,84%,67%)]/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-[hsl(258,84%,67%)] font-bold">3</span>
              </div>
              <h4 className="text-white font-medium">Enjoy!</h4>
              <p className="text-gray-400 text-sm">Your Discord server is now enhanced with BotCentral</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}