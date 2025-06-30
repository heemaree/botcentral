import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBell, FaSearch } from "react-icons/fa";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="gaming-card border-b border-[hsl(var(--gaming-border))] px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(var(--gaming-amber))] rounded-full"></span>
          </Button>
          
          {/* Search */}
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="gaming-bg border-[hsl(var(--gaming-border))] text-white placeholder-gray-400 focus:border-[hsl(var(--discord-primary))] pl-10 w-64" 
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    </header>
  );
}
