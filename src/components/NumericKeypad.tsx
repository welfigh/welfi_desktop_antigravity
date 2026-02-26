import { Delete, Plus } from "lucide-react";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onDecimal: () => void;
}

export function NumericKeypad({ onNumberClick, onDelete, onDecimal }: NumericKeypadProps) {
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-[370px] mx-auto">
      <div className="grid grid-cols-3 gap-4">
        {numbers.map((row, rowIndex) => (
          row.map((num) => (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              className="h-16 flex items-center justify-center text-2xl font-normal text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {num}
            </button>
          ))
        ))}
        
        {/* Bottom row */}
        <button
          onClick={onDelete}
          className="h-16 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Delete className="size-6 text-gray-800" />
        </button>
        
        <button
          onClick={() => onNumberClick('0')}
          className="h-16 flex items-center justify-center text-2xl font-normal text-gray-800 hover:bg-gray-50 rounded-xl transition-colors"
        >
          0
        </button>
        
        <button
          onClick={onDecimal}
          className="h-16 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-colors"
        >
          <Plus className="size-6 text-gray-800" />
        </button>
      </div>
    </div>
  );
}
