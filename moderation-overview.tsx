import { FaUserShield, FaGavel, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

export default function ModerationOverview() {
  return (
    <div className="bg-[hsl(230,10%,12%)] border border-[hsl(30,3%,22%)] rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[hsl(0,84%,67%)] rounded-lg flex items-center justify-center mr-4">
          <FaUserShield className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Moderation Overview</h3>
          <p className="text-gray-400">Keep your server safe and organized</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Reports</span>
            <FaExclamationTriangle className="text-[hsl(0,84%,67%)]" />
          </div>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Actions Today</span>
            <FaGavel className="text-[hsl(258,84%,67%)]" />
          </div>
          <p className="text-2xl font-bold text-white">7</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🛡️ Auto-Moderation Rules</span>
          <span className="text-[hsl(160,84%,39%)]">5 active</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">⚠️ Content Filters</span>
          <span className="text-[hsl(258,84%,67%)]">3 enabled</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">👮 Moderator Actions</span>
          <span className="text-yellow-500">12 this week</span>
        </div>
      </div>
      
      <button 
        className="w-full bg-[hsl(0,84%,67%)] hover:bg-[hsl(0,84%,67%)]/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center"
        onClick={() => window.location.href = '/moderation'}
      >
        Manage Moderation <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}