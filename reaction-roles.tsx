import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserTag, FaEye, FaCog, FaHashtag, FaCrown, FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";

export default function ReactionRoles() {
  return (
    <Card className="bg-[hsl(230,10%,12%)] border-[hsl(30,3%,22%)] text-white">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FaUserTag className="mr-3 text-[hsl(258,84%,67%)]" />
          Reaction Roles
          <span className="ml-auto text-sm bg-[hsl(160,84%,39%)]/20 text-[hsl(160,84%,39%)] px-2 py-1 rounded-full">
            Free Plan - 2/3 Used
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-400">
          Create interactive embeds where users can react with emojis to automatically receive Discord roles. Perfect for self-assignable roles, team selection, and community organization.
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
              <div className="bg-[hsl(220,13%,18%)] border-l-4 border-[hsl(258,84%,67%)] rounded-r-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[hsl(258,84%,67%)] rounded-full flex items-center justify-center">
                    <FaUserTag className="text-white text-sm" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-[hsl(258,84%,67%)]">🎮 Choose Your Roles</h5>
                    <p className="text-xs text-gray-400">React to get your roles!</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    React with the emojis below to assign yourself roles:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">🎮</span>
                      <span className="text-blue-400">@Gamer</span>
                      <span className="text-gray-400">- Gaming enthusiast</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">🎨</span>
                      <span className="text-green-400">@Artist</span>
                      <span className="text-gray-400">- Creative community member</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-lg">🔔</span>
                      <span className="text-yellow-400">@Notifications</span>
                      <span className="text-gray-400">- Get event updates</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reaction buttons simulation */}
              <div className="flex items-center space-x-2 bg-[hsl(220,13%,18%)] rounded-lg p-2">
                <span className="text-lg opacity-60">🎮</span>
                <span className="text-lg opacity-60">🎨</span>
                <span className="text-lg opacity-60">🔔</span>
                <span className="text-xs text-gray-500 ml-2">React to assign roles</span>
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
                <label className="text-sm font-medium text-gray-300 mb-1 block">Target Channel</label>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-[hsl(235,86%,65%)] text-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)] hover:text-white"
                >
                  <FaHashtag className="mr-2" />
                  Select Channel
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Embed Title</label>
                <input 
                  type="text"
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white"
                  placeholder="🎮 Choose Your Roles"
                  defaultValue="🎮 Choose Your Roles"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Embed Description</label>
                <textarea 
                  className="w-full bg-[hsl(220,13%,18%)] border border-[hsl(235,86%,65%)] rounded-lg p-2 text-sm text-white resize-none"
                  rows={3}
                  placeholder="React with the emojis below to assign yourself roles:"
                  defaultValue="React with the emojis below to assign yourself roles:"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Role Assignments</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="flex items-center space-x-2 bg-[hsl(220,13%,18%)] rounded p-2">
                    <span className="text-lg">🎮</span>
                    <span className="text-sm text-blue-400">@Gamer</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-400 hover:text-white">
                      <FaTrash className="text-xs" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 bg-[hsl(220,13%,18%)] rounded p-2">
                    <span className="text-lg">🎨</span>
                    <span className="text-sm text-green-400">@Artist</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-400 hover:text-white">
                      <FaTrash className="text-xs" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 bg-[hsl(220,13%,18%)] rounded p-2">
                    <span className="text-lg">🔔</span>
                    <span className="text-sm text-yellow-400">@Notifications</span>
                    <Button variant="ghost" size="sm" className="ml-auto text-red-400 hover:text-white">
                      <FaTrash className="text-xs" />
                    </Button>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 border-[hsl(258,84%,67%)] text-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)] hover:text-white"
                >
                  <FaPlus className="mr-1 text-xs" />
                  Add Role Assignment
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Existing Reaction Roles */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white">Your Reaction Roles (2/3)</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-[hsl(220,13%,18%)] rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[hsl(258,84%,67%)] rounded flex items-center justify-center">
                  <FaUserTag className="text-white text-xs" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">🎮 Choose Your Roles</h5>
                  <p className="text-xs text-gray-400">#roles • 3 role assignments</p>
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
                <div className="w-8 h-8 bg-[hsl(160,84%,39%)] rounded flex items-center justify-center">
                  <FaUserTag className="text-white text-xs" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">🔔 Notification Preferences</h5>
                  <p className="text-xs text-gray-400">#general • 2 role assignments</p>
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
          
          <div className="text-center py-4 border-2 border-dashed border-[hsl(258,84%,67%)]/30 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">1 more reaction role available (2/3)</p>
            <Button 
              variant="outline" 
              className="border-[hsl(258,84%,67%)] text-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)] hover:text-white"
            >
              <FaPlus className="mr-2" />
              Create New Reaction Role
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button className="flex-1 bg-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)]/80 text-white">
            <FaSave className="mr-2" />
            Save Reaction Role
          </Button>
          <Button className="flex-1 bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,65%)]/80 text-white">
            <FaUserTag className="mr-2" />
            Deploy to Channel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}