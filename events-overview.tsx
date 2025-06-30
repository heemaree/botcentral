import { FaCalendarAlt, FaUsers, FaClock, FaArrowRight } from "react-icons/fa";

export default function EventsOverview() {
  return (
    <div className="bg-[hsl(230,10%,12%)] border border-[hsl(30,3%,22%)] rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-[hsl(258,84%,67%)] rounded-lg flex items-center justify-center mr-4">
          <FaCalendarAlt className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Events Overview</h3>
          <p className="text-gray-400">Manage community events and tournaments</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Events</span>
            <FaClock className="text-[hsl(258,84%,67%)]" />
          </div>
          <p className="text-2xl font-bold text-white">3</p>
        </div>
        
        <div className="bg-[hsl(237,71%,7%)] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Participants</span>
            <FaUsers className="text-[hsl(160,84%,39%)]" />
          </div>
          <p className="text-2xl font-bold text-white">147</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🎮 Gaming Tournament</span>
          <span className="text-[hsl(258,84%,67%)]">Tonight 8PM</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🎊 Community Meetup</span>
          <span className="text-[hsl(160,84%,39%)]">Tomorrow 6PM</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">🏆 Weekly Competition</span>
          <span className="text-yellow-500">Friday 7PM</span>
        </div>
      </div>
      
      <button 
        className="w-full bg-[hsl(258,84%,67%)] hover:bg-[hsl(258,84%,67%)]/80 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center"
        onClick={() => window.location.href = '/events'}
      >
        Manage Events <FaArrowRight className="ml-2" />
      </button>
    </div>
  );
}