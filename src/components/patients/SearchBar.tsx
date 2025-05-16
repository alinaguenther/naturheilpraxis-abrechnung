import { Button } from '@/components/layout/Button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onNewPatient: () => void;
}

export function SearchBar({ value, onChange, onNewPatient }: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔍 Suche nach Name oder E-Mail"
        className="flex-1 border rounded-md px-4 py-2 shadow-sm focus:outline-none"
        data-lastpass-ignore="true"
      />
      <Button
        onClick={onNewPatient}
        variant="primary"
        type="button"
      >
        Neuer Patient
      </Button>
    </div>
  );
}