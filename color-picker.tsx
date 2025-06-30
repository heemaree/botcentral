import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
}

// Basic color palette
const basicColors = [
  "#5865F2", // Discord Blue
  "#57F287", // Green
  "#FEE75C", // Yellow
  "#ED4245", // Red
  "#EB459E", // Pink
  "#9146FF", // Purple
  "#00D166", // Emerald
  "#1ABC9C", // Turquoise
  "#E67E22", // Orange
  "#95A5A6", // Gray
  "#34495E", // Dark Gray
  "#2C3E50", // Darker Gray
];

export function ColorPicker({ value, onChange, label, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-gray-200">{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full h-10 bg-[hsl(237,71%,7%)] border-[hsl(30,3%,22%)] text-white hover:bg-[hsl(230,10%,12%)] flex items-center gap-3"
          >
            <div
              className="w-5 h-5 rounded border border-gray-600"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-[hsl(230,10%,12%)] border-[hsl(30,3%,22%)] text-white p-4">
          <div className="space-y-4">
            {/* Basic Colors */}
            <div>
              <Label className="text-gray-200 text-sm mb-2 block">Basic Colors</Label>
              <div className="grid grid-cols-6 gap-2">
                {basicColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                      value === color ? 'border-white' : 'border-gray-600'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div>
              <Label className="text-gray-200 text-sm mb-2 block">Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  placeholder="#FFFFFF"
                  className="bg-[hsl(237,71%,7%)] border-[hsl(30,3%,22%)] text-white font-mono"
                />
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-10 h-10 border border-gray-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-gray-200 text-sm mb-2 block">Preview</Label>
              <div className="w-full h-12 rounded border border-gray-600 flex items-center justify-center text-white text-sm font-medium"
                   style={{ backgroundColor: customColor }}>
                Sample Embed Color
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}