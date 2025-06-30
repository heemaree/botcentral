import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaChartLine, FaDiscord, FaCheck, FaCrown } from "react-icons/fa";

export default function ChannelStatsConfig() {
  return (
    <Card className="bg-[hsl(230,10%,12%)] border-[hsl(30,3%,22%)] text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FaChartLine className="mr-3 text-[hsl(235,86%,65%)]" />
          Channel Statistics Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-400">
          Configure which channel should display server statistics. Select from voice channels, text channels, or categories to show member counts, online status, and server activity.
        </p>
        
        <div className="bg-[hsl(25,95%,53%)]/10 border border-[hsl(25,95%,53%)]/20 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <FaDiscord className="text-[hsl(235,86%,65%)] mt-1" />
            <div>
              <h5 className="font-semibold text-white mb-1">Premium Feature Preview</h5>
              <p className="text-sm text-gray-300">
                This is a preview of channel statistics configuration. Upgrade to Premium to select your server and enable this functionality.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center">
              <FaDiscord className="mr-2 text-[hsl(235,86%,65%)]" />
              Voice Channel <span className="ml-2 text-sm text-[hsl(160,84%,39%)]">(Recommended)</span>
            </h4>
            <p className="text-sm text-gray-400">
              Display live member count and online status in a voice channel name. Updates automatically and is always visible.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] opacity-60 cursor-not-allowed"
              disabled
            >
              Select Voice Channel (Premium)
            </Button>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center">
              <FaDiscord className="mr-2 text-blue-400" />
              Text Channel
            </h4>
            <p className="text-sm text-gray-400">
              Show server statistics in a text channel description or periodic messages with detailed analytics.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-blue-400 text-blue-400 opacity-60 cursor-not-allowed"
              disabled
            >
              Select Text Channel (Premium)
            </Button>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-white flex items-center">
              <FaDiscord className="mr-2 text-gray-400" />
              Category
            </h4>
            <p className="text-sm text-gray-400">
              Use a category name to display basic server information like total members or server boosters.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-gray-400 text-gray-400 opacity-60 cursor-not-allowed"
              disabled
            >
              Select Category (Premium)
            </Button>
          </div>
        </div>
        
        <div className="bg-[hsl(235,86%,65%)]/10 border border-[hsl(235,86%,65%)]/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FaCheck className="text-[hsl(160,84%,39%)] mt-1" />
            <div>
              <h5 className="font-semibold text-white mb-1">Pro Tip: Voice Channel Statistics</h5>
              <p className="text-sm text-gray-300">
                Voice channels are recommended because they update in real-time and don't clutter your text channels. 
                The bot will rename the channel to show live stats like "👥 Members: 1,247" or "🟢 Online: 89".
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)]/80 text-white"
            onClick={() => window.location.href = '/premium-plan'}
          >
            <FaCrown className="mr-2" />
            Get Premium Access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}