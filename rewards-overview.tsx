import { FaGift, FaStar, FaLevelUpAlt, FaArrowRight } from "react-icons/fa";

export default function RewardsOverview() {
  return (
    <div className="bg-[hsl(230,10%,12%)] border border-[hsl(30,3%,22%)] rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[hsl(45,100%,60%)] rounded-lg flex items-center justify-center mr-4">
          <FaGift className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Rewards & Engagement</h3>
          <p className="text-gray-400">Level system and message rewards</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Rewards</span>
            <FaStar className="text-[hsl(45,100%,60%)]" />
          </div>
          <p className="text-2xl font-bold text-white">8</p>
        </div>
        
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Top Level</span>
            <FaLevelUpAlt className="text-[hsl(258,84%,67%)]" />
          </div>
          <p className="text-2xl font-bold text-white">47</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🎖️ Level Role Rewards</span>
          <span className="text-[hsl(45,100%,60%)]">5 tiers</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">💬 Message Rewards</span>
          <span className="text-[hsl(160,84%,39%)]">XP + coins</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🏆 Achievement System</span>
          <span className="text-[hsl(258,84%,67%)]">12 badges</span>
        </div>
      </div>
      
      <button 
        className="w-full bg-[hsl(45,100%,60%)] hover:bg-[hsl(45,100%,60%)]/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center"
        onClick={() => window.location.href = '/leaderboards'}
      >
        Manage Rewards <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}