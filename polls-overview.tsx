import { FaPoll, FaVoteYea, FaChartBar, FaArrowRight } from "react-icons/fa";

export default function PollsOverview() {
  return (
    <div className="bg-[hsl(230,10%,12%)] border border-[hsl(30,3%,22%)] rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[hsl(160,84%,39%)] rounded-lg flex items-center justify-center mr-4">
          <FaPoll className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Polls Overview</h3>
          <p className="text-gray-400">Gather community feedback and opinions</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Polls</span>
            <FaVoteYea className="text-[hsl(160,84%,39%)]" />
          </div>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Votes</span>
            <FaChartBar className="text-[hsl(258,84%,67%)]" />
          </div>
          <p className="text-2xl font-bold text-white">89</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">📊 Favorite Game Mode</span>
          <span className="text-[hsl(160,84%,39%)]">45 votes</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🎯 Event Schedule Preference</span>
          <span className="text-[hsl(258,84%,67%)]">32 votes</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">⭐ Server Feature Request</span>
          <span className="text-yellow-500">12 votes</span>
        </div>
      </div>
      
      <button 
        className="w-full bg-[hsl(160,84%,39%)] hover:bg-[hsl(160,84%,39%)]/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center"
        onClick={() => window.location.href = '/polls'}
      >
        Manage Polls <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}