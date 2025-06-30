import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ColorPicker } from "@/components/ui/color-picker";
import { useQuery } from "@tanstack/react-query";
import { FaCode, FaEye, FaCog, FaHashtag, FaPlus, FaEdit, FaTrash, FaSave, FaUser, FaAt, FaLock } from "react-icons/fa";

export default function CustomEmbeds() {
  const [embedData, setEmbedData] = useState({
    title: "📢 Server Announcement",
    description: "Welcome to our community! Here are some important guidelines and updates for all members.\n\nSpecial thanks to @admin and @moderator for their hard work!",
    color: "#10b981", // green
    channel: "",
    taggedUsers: [
      { id: "123456789", username: "admin", displayName: "ServerAdmin" },
      { id: "987654321", username: "moderator", displayName: "ModTeam" }
    ]
  });

  // Fetch global color settings
  const { data: colorSettings } = useQuery({
    queryKey: ["/api/embed-color-settings"],
  });

  // Update embed color based on global settings
  useEffect(() => {
    if (colorSettings?.useGlobalColor && colorSettings.globalColor) {
      setEmbedData(prev => ({
        ...prev,
        color: colorSettings.globalColor
      }));
    }
  }, [colorSettings]);

  const [newUserTag, setNewUserTag] = useState("");

  const addUserTag = () => {
    if (newUserTag.trim() && !embedData.taggedUsers.find(user => user.username === newUserTag.trim())) {
      const newUser = {
        id: Date.now().toString(),
        username: newUserTag.trim(),
        displayName: newUserTag.trim()
      };
      setEmbedData(prev => ({
        ...prev,
        taggedUsers: [...prev.taggedUsers, newUser]
      }));
      setNewUserTag("");
    }
  };

  const removeUserTag = (userId: string) => {
    setEmbedData(prev => ({
      ...prev,
      taggedUsers: prev.taggedUsers.filter(user => user.id !== userId)
    }));
  };

  const insertUserMention = (username: string) => {
    const mention = `@${username}`;
    setEmbedData(prev => ({
      ...prev,
      description: prev.description + ` ${mention}`
    }));
  };

  // Function to render text with user mentions highlighted
  const renderTextWithMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) { // This is a username
        const user = embedData.taggedUsers.find(u => u.username === part);
        if (user) {
          return (
            <span 
              key={index} 
              className="bg-[hsl(235,86%,65%)] text-white px-1 rounded cursor-pointer hover:bg-[hsl(235,86%,75%)] transition-colors"
              title={`Click to view ${user.displayName}'s profile`}
            >
              @{part}
            </span>
          );
        }
        return `@${part}`;
      }
      return part;
    });
  };

  return (
    <Card className="bg-[hsl(230,10%,12%)] border-[hsl(30,3%,22%)] text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FaCode className="mr-3 text-[hsl(160,84%,39%)]" />
          Custom Embeds
          <span className="ml-auto text-sm bg-[hsl(160,84%,39%)]/20 text-[hsl(160,84%,39%)] px-2 py-1 rounded-full">
            Free Plan - 3/3 Used
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-400">
          Create beautiful, rich embeds with user mentions for announcements, information displays, and engaging content. Free plan includes 3 custom embeds.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Embed Preview */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white flex items-center">
              <FaEye className="mr-2 text-[hsl(235,86%,65%)]" />
              Embed Preview
            </h4>
            <div className="space-y-2">
              {/* Embed preview */}
              <div className="bg-[hsl(220,13%,18%)] border-l-4 rounded-r-lg p-4 space-y-3" style={{ borderLeftColor: embedData.color }}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: embedData.color }}>
                    <FaCode className="text-white text-sm" />
                  </div>
                  <div>
                    <h5 className="font-semibold" style={{ color: colorSettings?.useCustomTitleColor ? colorSettings.titleColor : '#FFFFFF' }}>{embedData.title}</h5>
                    <p className="text-xs text-gray-400">Important information</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">
                    {renderTextWithMentions(embedData.description)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[hsl(220,13%,25%)] rounded p-2">
                      <span style={{ color: embedData.color }}>📝 Rules</span>
                      <p className="text-gray-400">Read #rules</p>
                    </div>
                    <div className="bg-[hsl(220,13%,25%)] rounded p-2">
                      <span className="text-[hsl(235,86%,65%)]">🎮 Events</span>
                      <p className="text-gray-400">Join our events</p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 border-t border-gray-600 pt-2">
                  BotCentral • Today at 12:00 PM
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
            <div className="space-y-4">
              <div>
                <Label className="text-white">Target Channel</Label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)] hover:text-white"
                >
                  <FaHashtag className="mr-2" />
                  Select Channel
                </Button>
              </div>
              
              <div>
                <ColorPicker
                  value={embedData.color}
                  onChange={(color) => setEmbedData(prev => ({ ...prev, color }))}
                  label="Embed Color"
                  disabled={colorSettings?.useGlobalColor}
                />
                {colorSettings?.useGlobalColor && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Color is controlled by global settings. Go to Settings to change.
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-white">Embed Title</Label>
                <Input
                  value={embedData.title}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] text-white"
                  placeholder="📢 Server Announcement"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    Title color: Automatic white
                  </p>
                  <div className="flex items-center space-x-2">
                    <FaLock className="text-yellow-500 text-xs" />
                    <span className="text-xs text-yellow-400">Premium: Custom title colors</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={embedData.description}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] text-white h-24"
                  placeholder="Enter your embed description here. Use @username to mention users."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tip: Type @username to mention users. They'll be clickable in Discord!
                </p>
              </div>

              {/* User Tagging Section */}
              <div>
                <Label className="text-white flex items-center">
                  <FaAt className="mr-2" />
                  User Tags
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newUserTag}
                      onChange={(e) => setNewUserTag(e.target.value)}
                      placeholder="Enter username"
                      className="bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] text-white"
                      onKeyPress={(e) => e.key === 'Enter' && addUserTag()}
                    />
                    <Button onClick={addUserTag} size="sm" className="bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,75%)]">
                      <FaPlus />
                    </Button>
                  </div>
                  
                  {/* Tagged Users List */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Tagged Users:</p>
                    <div className="flex flex-wrap gap-2">
                      {embedData.taggedUsers.map((user) => (
                        <Badge 
                          key={user.id}
                          className="bg-[hsl(235,86%,65%)] text-white flex items-center gap-2 px-3 py-1"
                        >
                          <FaUser className="text-xs" />
                          @{user.username}
                          <button 
                            onClick={() => removeUserTag(user.id)}
                            className="ml-1 text-xs hover:text-red-300"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Quick Insert Buttons */}
                    {embedData.taggedUsers.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-2">Quick insert:</p>
                        <div className="flex flex-wrap gap-1">
                          {embedData.taggedUsers.map((user) => (
                            <Button
                              key={user.id}
                              onClick={() => insertUserMention(user.username)}
                              size="sm"
                              variant="outline"
                              className="text-xs border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)] hover:text-white"
                            >
                              @{user.username}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button className="flex-1 bg-[hsl(160,84%,39%)] hover:bg-[hsl(160,84%,39%)]/80 text-white">
                  <FaSave className="mr-2" />
                  Save Embed
                </Button>
                <Button className="flex-1 bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)]/80 text-white">
                  <FaCode className="mr-2" />
                  Send to Channel
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Existing Embeds */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Your Custom Embeds (3/3)</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-[hsl(220,13%,18%)] rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(160,84%,39%)] rounded flex items-center justify-center">
                  <FaCode className="text-white text-xs" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">📢 Server Announcement</h5>
                  <p className="text-xs text-gray-400">#announcements • Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-[hsl(235,86%,65%)] hover:text-white">
                  <FaEdit className="text-xs" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-white">
                  <FaTrash className="text-xs" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[hsl(220,13%,18%)] rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(235,86%,65%)] rounded flex items-center justify-center">
                  <FaCode className="text-white text-xs" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">📋 Server Rules</h5>
                  <p className="text-xs text-gray-400">#rules • Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-[hsl(235,86%,65%)] hover:text-white">
                  <FaEdit className="text-xs" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-white">
                  <FaTrash className="text-xs" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-[hsl(220,13%,18%)] rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(314,100%,76%)] rounded flex items-center justify-center">
                  <FaCode className="text-white text-xs" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">🎉 Welcome Message</h5>
                  <p className="text-xs text-gray-400">#welcome • Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-[hsl(235,86%,65%)] hover:text-white">
                  <FaEdit className="text-xs" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-white">
                  <FaTrash className="text-xs" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center py-4 border-2 border-dashed border-gray-600 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Free plan limit reached (3/3)</p>
            <Button 
              variant="outline" 
              className="border-[hsl(160,84%,39%)] text-[hsl(160,84%,39%)] hover:bg-[hsl(160,84%,39%)] hover:text-white"
              onClick={() => window.location.href = '/premium-plan'}
            >
              Upgrade for Unlimited Embeds
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}