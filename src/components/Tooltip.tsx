import { HelpCircle } from "lucide-react";
import { useState } from "react";

export function Tooltip({ term, definition }: { term: string; definition: string }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        aria-label={`Definição de ${term}`}
      >
        <HelpCircle className="w-4 h-4 ml-1" />
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
          <div className="font-semibold mb-1">{term}</div>
          <div className="text-gray-200">{definition}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  );
}
