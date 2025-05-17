import { Patient } from '@/types/patient';
import { Button } from '@/components/layout/Button';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiFolder, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';

type SortOrder = 'asc' | 'desc';

interface PatientTableProps {
  patients: Patient[];
  sortKey: keyof Patient;
  sortOrder: SortOrder;
  onSort: (key: keyof Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

// Im COLUMNS Array - stelle sicher, dass die Schlüssel korrekt sind
const COLUMNS: Array<{key: keyof Patient; label: string}> = [
  { key: 'nachname', label: 'Name' },
  { key: 'geburtsdatum', label: 'Geburtsdatum' },
  { key: 'anschrift', label: 'Anschrift' }, // Dies ist tricky, da anschrift ein Objekt ist
  { key: 'versicherung', label: 'Versicherung' }
];

// Konstanten für wiederverwendbare Style-Klassen
const TABLE_CELL_CLASSES = "px-4 py-3";
const TABLE_HEADER_CLASSES = `${TABLE_CELL_CLASSES} text-left font-medium text-gray-700`;
const INTERACTIVE_ELEMENT_CLASSES = "cursor-pointer hover:text-primary-600";

const PatientRow = React.memo(function PatientRow({ 
  patient, 
  onEdit, 
  onDelete, 
  formatDate,
  isOpen,
  toggleOpen
}: {
  patient: Patient;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  isOpen: boolean;
  toggleOpen: (id: string) => void;
}) {
  const detailsId = `details-${patient.id}`;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleOpen(patient.id);
    } else if (e.key === 'Escape' && isOpen) {
      toggleOpen(patient.id);
    }
  };

  // Adresse formatieren
  const fullAddress = `${patient.anschrift?.adresse || ''} ${patient.anschrift?.hausnummer || ''}, 
  ${patient.anschrift?.plz || ''} ${patient.anschrift?.ort || ''}`;

  return (
    <>
      <tr className="hover:bg-gray-50 border-b border-gray-200">
        <td className={TABLE_CELL_CLASSES}>
          <div 
            onClick={() => toggleOpen(patient.id)}
            className="flex items-center gap-2 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-controls={detailsId}
          >
            {isOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
            <span className="sr-only">{isOpen ? 'Details ausblenden' : 'Details anzeigen'}</span>
            <div>
              <div>{patient.nachname}, {patient.vorname}</div>
              <div className="text-xs text-gray-500">{patient.geschlecht}</div>
            </div>
          </div>
        </td>
        <td className={TABLE_CELL_CLASSES}>{formatDate(patient.geburtsdatum)}</td>
        <td className={TABLE_CELL_CLASSES}>{fullAddress}</td>
        <td className={TABLE_CELL_CLASSES}>{patient.versicherung}</td>
        <td className={`${TABLE_CELL_CLASSES} whitespace-nowrap`}>
          <div 
            className="flex gap-1" 
            role="group" 
            aria-label={`Aktionen für ${patient.vorname} ${patient.nachname}`}
          >
            <Button 
              onClick={() => onEdit(patient)}
              variant="ghost"
              size="icon"
              aria-label={`${patient.vorname} ${patient.nachname} bearbeiten`}
            >
              <FiEdit2 className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              onClick={() => onDelete(patient.id)}
              variant="ghost"
              size="icon"
              aria-label={`${patient.vorname} ${patient.nachname} löschen`}
            >
              <FiTrash2 className="w-4 h-4" aria-hidden="true" />
            </Button>
            <ActionLink 
              href={`/patienten/${patient.id}/kartei`}
              label={`Kartei von ${patient.vorname} ${patient.nachname} öffnen`}
              icon={<FiFolder className="w-4 h-4" aria-hidden="true" />}
            />
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-gray-50">
          <td colSpan={5} className={TABLE_CELL_CLASSES}>
            <div 
              id={detailsId}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              role="region"
              aria-label={`Weitere Details zu ${patient.vorname} ${patient.nachname}`}
            >
              <div>
                <h3 className="text-sm font-medium mb-1">Adresse</h3>
                <p className="table-text">{patient.anschrift?.adresse} {patient.anschrift?.hausnummer}</p>
                {patient.anschrift?.adresseZusatz && (
                  <p className="table-text">{patient.anschrift.adresseZusatz}</p>
                )}
                <p className="table-text">{patient.anschrift?.plz} {patient.anschrift?.ort}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Kontakt</h3>
                {patient.kontakt?.telefon && <p className="table-text">Telefon: {patient.kontakt.telefon}</p>}
                {patient.kontakt?.mobil && <p className="table-text">Mobil: {patient.kontakt.mobil}</p>}
                {patient.kontakt?.email && <p className="table-text">E-Mail: {patient.kontakt.email}</p>}
                {!patient.kontakt?.telefon && !patient.kontakt?.mobil && !patient.kontakt?.email && 
                  <p className="table-text text-gray-500">Keine Kontaktdaten vorhanden</p>
                }
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Weitere Informationen</h3>
                <p className="table-text">Geschlecht: {patient.geschlecht || '-'}</p>
                <p className="table-text">Geburtsdatum: {formatDate(patient.geburtsdatum)}</p>
                <p className="table-text">Versicherung: {patient.versicherung}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Prüfung zum Vermeiden unnötiger Rerenders
  return prevProps.patient.id === nextProps.patient.id && 
         prevProps.isOpen === nextProps.isOpen;
});

function ActionLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center justify-center p-1.5 rounded text-gray-700 hover:bg-gray-100 transition-colors">
      <span className="sr-only">{label}</span>
      {icon}
    </Link>
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
  // State für aktuell geöffnete Zeile
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  
  // Toggle Funktion, die andere Zeilen schließt
  const toggleOpenRow = (id: string) => {
    setOpenRowId(openRowId === id ? null : id);
  };

  // Wenn sich die Patienten ändern (z.B. nach Bearbeitung), aktuelle Zeile schließen
  useEffect(() => {
    setOpenRowId(null);
  }, [patients]);
  
  // Barrierefreiheit: Hilfsfunktion für aria-sort Attribute
  const getAriaSortValue = (column: keyof Patient): 'none' | 'ascending' | 'descending' => {
    if (sortKey === column) {
      return sortOrder === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  };

  return (
    <div className="table-container overflow-x-auto">
      {patients.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow" role="status">
          <p className="text-gray-600">Keine Patienten gefunden.</p>
          <p className="text-sm text-gray-500 mt-2">
            Um einen neuen Patienten anzulegen, klicken Sie auf "Neuer Patient".
          </p>
        </div>
      ) : (
        <table 
          className="min-w-full divide-y divide-gray-200" 
          aria-label="Patientenliste"
          aria-describedby="patient-table-desc" // Ergänzung
        >
          <caption id="patient-table-desc" className="sr-only">
            Liste aller Patienten mit Namen, Geburtsdatum, Anschrift und Versicherung sowie Aktionen zum Bearbeiten, Löschen und Öffnen der Patientenakte.
          </caption>
          <thead>
            <tr className="border-b border-gray-200">
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className={TABLE_HEADER_CLASSES}
                  aria-sort={getAriaSortValue(key)}
                >
                  <div 
                    onClick={() => onSort(key)}
                    className="flex items-center cursor-pointer hover:text-primary-600"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSort(key);
                      }
                    }}
                    aria-label={`${label} sortieren, aktuell ${getAriaSortValue(key) !== 'none' ? getAriaSortValue(key) : 'nicht sortiert'}`}
                  >
                    <span className="flex-1">{label}</span>
                    {/* Verwende den gleichen Chevron-Pfeil wie bei den Detailzeilen */}
                    {sortKey === key && (
                      <span aria-hidden="true" className="ml-1 inline-flex items-center">
                        {sortOrder === 'asc' ? 
                          <FiChevronUp className="w-4 h-4" aria-hidden="true" /> : 
                          <FiChevronDown className="w-4 h-4" aria-hidden="true" />
                        }
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th 
                className={TABLE_HEADER_CLASSES}
                scope="col"
              >
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <PatientRow
                key={patient.id}
                patient={patient}
                onEdit={onEdit}
                onDelete={onDelete}
                formatDate={formatDate}
                isOpen={openRowId === patient.id}
                toggleOpen={toggleOpenRow}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}