import { Button } from '../layout/Button';
import { FiPlus, FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onNewPatient: () => void;
}

export function SearchBar({ value, onChange, onNewPatient }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6" role="search">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Patienten suchen..."
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          aria-label="Patienten suchen"
        />
      </div>
      <Button 
        onClick={onNewPatient}
        className="flex items-center justify-center gap-2"
      >
        <FiPlus aria-hidden="true" />
        <span>Neuer Patient</span>
      </Button>
    </div>
  );
}