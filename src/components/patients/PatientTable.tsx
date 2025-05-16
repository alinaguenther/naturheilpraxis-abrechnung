import { Patient } from '@/types/patient';
import { Button } from '@/components/layout/Button';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiFolder, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';
import { Card } from '@/components/layout/Card';

interface PatientTableProps {
  patients: Patient[];
  sortKey: keyof Patient;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

// Reduzierte Hauptspalten
const COLUMNS = [
  { key: 'nachname', label: 'Name' },
  { key: 'geburtsdatum', label: 'Geburtsdatum' },
  { key: 'telefon', label: 'Telefon' },
  { key: 'email', label: 'E-Mail' }
] as const;

function PatientRow({ patient, sortKey, onEdit, onDelete, formatDate }: {
  patient: Patient;
  sortKey: keyof Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="table-text px-2 py-2">
          <Button 
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            className="flex items-center gap-2 w-full text-left"
          >
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            <div>
              <div>{patient.nachname}, {patient.vorname}</div>
              <div className="text-xs text-gray-500">{patient.geschlecht}</div>
            </div>
          </Button>
        </td>
        <td className="table-text px-2 py-2">{formatDate(patient.geburtsdatum)}</td>
        <td className="table-text px-2 py-2">{patient.telefon}</td>
        <td className="table-text px-2 py-2">{patient.email}</td>
        <td className="px-2 py-2 whitespace-nowrap">
          <div className="flex gap-1">
            <Button 
              onClick={() => onEdit(patient)}
              variant="ghost"
              size="icon"
              title="Bearbeiten"
            >
              <FiEdit2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(patient.id)}
              variant="ghost"
              size="icon"
              title="Löschen"
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
            <Link href={`/patienten/${patient.id}/kartei`} passHref>
              <Button
                variant="ghost"
                size="icon"
                title="Kartei öffnen"
                as="a"
              >
                <FiFolder className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan={5} className="px-4 py-3">
            <Card>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Adresse</h4>
                <p className="table-text">{patient.adresse}</p>
                <p className="table-text">{patient.plz} {patient.ort}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Kontakt</h4>
                <p className="table-text">Telefon: {patient.telefon}</p>
                <p className="table-text">Mobil: {patient.mobil}</p>
                <p className="table-text">Email: {patient.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Weitere Informationen</h4>
                <p className="table-text">Geschlecht: {patient.geschlecht}</p>
                <p className="table-text">Geburtsdatum: {formatDate(patient.geburtsdatum)}</p>
                <p className="table-text">Versicherung: {patient.versicherung}</p>
              </div>
            </div> 
            </Card>
          </td>
        </tr>
      )}
    </>
  );
}

export function PatientTable({ 
  patients, 
  sortKey,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  formatDate 
}: PatientTableProps) {
  return (
    <div className="table-container">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => onSort(key as keyof Patient)}
                className="table-text px-2 py-2 text-left font-medium cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-1">
                  {label}
                  {sortKey === key && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="table-text px-2 py-2 text-left font-medium w-24">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              sortKey={sortKey}
              onEdit={onEdit}
              onDelete={onDelete}
              formatDate={formatDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}