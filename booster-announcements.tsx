import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaRocket, FaEye, FaCog, FaHashtag, FaSave, FaPlay, FaCrown } from "react-icons/fa";

export default function BoosterAnnouncements() {
  return (
    <Card className="bg-[hsl(230,10%,12%)] border-[hsl(30,3%,22%)] text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FaRocket className="mr-3 text-[hsl(314,100%,76%)]" />
          Booster Announcements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-400">
          Automatically thank your server boosters with beautiful embedded announcements. Customize messages, colors, and rewards to show appreciation for your community supporters.
        </p>
        
        <div className="bg-[hsl(314,100%,76%)]/10 border border-[hsl(314,100%,76%)]/20 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <FaRocket className="text-[hsl(314,100%,76%)] mt-1" />
            <div>
              <h5 className="font-semibold text-white mb-1">Premium Feature Preview</h5>
              <p className="text-sm text-gray-300">
                This is a preview of booster announcements configuration. Upgrade to Premium to select your server and enable this functionality.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview Embed */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center">
              <FaEye className="mr-2 text-[hsl(235,86%,65%)]" />
              Embed Preview
            </h4>
            <div className="space-y-2">
              {/* User ping outside embed */}
              <p className="text-sm text-blue-400">
                🚀 <strong>@Username</strong> boosted the server!
              </p>
              
              {/* Embed preview */}
              <div className="bg-[hsl(220,13%,18%)] border-l-4 border-[hsl(314,100%,76%)] rounded-r-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[hsl(314,100%,76%)] rounded-full flex items-center justify-center">
                    <FaRocket className="text-white text-sm" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[hsl(314,100%,76%)]">🎉 Thank You for Boosting!</h5>
                    <p className="text-xs text-gray-400">Your support means everything to us</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    Thanks for supporting our community! You now have access to exclusive channels and perks.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mt-3">
                    <span>💎 Boost Level 2</span>
                    <span>🎁 Rewards unlocked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Configuration Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center">
              <FaCog className="mr-2 text-[hsl(235,86%,65%)]" />
              Configuration
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Announcement Channel</label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] opacity-60 cursor-not-allowed"
                  disabled
                >
                  <FaHashtag className="mr-2" />
                  Select Channel (Premium)
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Embed Color</label>
                <div className="flex space-x-2 opacity-60">
                  <div className="w-8 h-8 bg-[hsl(314,100%,76%)] rounded border-2 border-white cursor-not-allowed"></div>
                  <div className="w-8 h-8 bg-[hsl(235,86%,65%)] rounded border cursor-not-allowed"></div>
                  <div className="w-8 h-8 bg-[hsl(160,84%,39%)] rounded border cursor-not-allowed"></div>
                  <div className="w-8 h-8 bg-[hsl(25,95%,53%)] rounded border cursor-not-allowed"></div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Embed Title</label>
                <input 
                  type="text"
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white opacity-60 cursor-not-allowed"
                  placeholder="🎉 Thank You for Boosting!"
                  value="🎉 Thank You for Boosting!"
                  disabled
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Embed Description</label>
                <input 
                  type="text"
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white opacity-60 cursor-not-allowed"
                  placeholder="Your support means everything to us"
                  value="Your support means everything to us"
                  disabled
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Custom Message</label>
                <textarea 
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white resize-none opacity-60 cursor-not-allowed"
                  rows={3}
                  placeholder="Thanks for boosting {server_name}! You're amazing, {user_mention}!"
                  value="Thanks for supporting our community! You now have access to exclusive channels and perks."
                  disabled
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">User Ping Message (Outside Embed)</label>
                <input 
                  type="text"
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white opacity-60 cursor-not-allowed"
                  placeholder="🚀 {user_mention} boosted the server!"
                  value="🚀 @Username boosted the server!"
                  disabled
                />
              </div>
              
              <div className="flex items-center space-x-2 opacity-60">
                <input type="checkbox" className="rounded border-[hsl(235,86%,65%)]" checked disabled />
                <label className="text-sm text-gray-300">Include boost level in message</label>
              </div>
              
              <div className="flex items-center space-x-2 opacity-60">
                <input type="checkbox" className="rounded border-[hsl(235,86%,65%)]" checked disabled />
                <label className="text-sm text-gray-300">Mention user in announcement</label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[hsl(314,100%,76%)]/10 border border-[hsl(314,100%,76%)]/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FaRocket className="text-[hsl(314,100%,76%)] mt-1" />
            <div>
              <h5 className="font-semibold text-white mb-1">Boost Your Community</h5>
              <p className="text-sm text-gray-300">
                Booster announcements help recognize your most dedicated members and encourage others to support your server. 
                Use variables like {"{user_mention}"}, {"{server_name}"}, and {"{boost_level}"} to personalize messages.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-[hsl(314,100%,76%)] hover:bg-[hsl(314,100%,76%)]/80 text-white"
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