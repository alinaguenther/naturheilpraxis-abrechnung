import { Patient } from '@/types/patient';
import Link from 'next/link';

interface PatientTableProps {
  patients: Patient[];
  sortKey: keyof Patient;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Patient) => void;
  onEdit: (patient: Patient) => void;
  formatDate: (date: string) => string;
}

export function PatientTable({ patients, sortKey, sortOrder, onSort, onEdit, formatDate }: PatientTableProps) {
  return (
    <table className="min-w-full text-sm bg-white">
      <thead className="bg-blue-50 sticky top-0 z-10">
        <tr>
          {/* ...table headers... */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {patients.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">{p.nachname}, {p.vorname}</td>
            <td className="px-4 py-3">{p.geschlecht}</td>
            <td className="px-4 py-3">{formatDate(p.geburtsdatum)}</td>
            <td className="px-4 py-3">{p.adresse}</td>
            <td className="px-4 py-3">{p.plz}</td>
            <td className="px-4 py-3">{p.ort}</td>
            <td className="px-4 py-3">{p.email}</td>
            <td className="px-4 py-3">{p.telefon}</td>
            <td className="px-4 py-3">{p.mobil}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(p)} 
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Bearbeiten
                </button>
                <Link 
                  href={`/patienten/${p.id}/kartei`} 
                  className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                >
                  Kartei
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}