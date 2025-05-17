import { Patient } from '@/types/patient';
import { Karteieintrag } from '@/types/karteieintrag';

/**
 * Druck-Utilities für die Anwendung
 */

/**
 * Formatiert ein Datum für die Ausgabe im deutschen Format
 * @param dateString - Ein Datum als ISO-String
 * @returns Formatiertes Datum als DD.MM.YYYY
 */
export function formatDateForPrint(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatiert eine Adresse für den Druck
 * @param anschrift - Anschriftenobjekt eines Patienten
 * @returns Formatierte Adresszeile
 */
export function formatAddress(anschrift: Patient['anschrift']): string {
  if (!anschrift) return '';
  
  const { adresse, hausnummer, plz, ort, adresseZusatz } = anschrift;
  let formattedAddress = `${adresse} ${hausnummer}, ${plz} ${ort}`;
  
  if (adresseZusatz) {
    formattedAddress += `, ${adresseZusatz}`;
  }
  
  return formattedAddress;
}

/**
 * Bereitet Patientendaten für den Druck vor
 * @param patient - Patientenobjekt
 * @returns HTML-String für den Druck
 */
export function preparePrintPatientData(patient: Patient): string {
  const { vorname, nachname, geburtsdatum, geschlecht, versicherung, anschrift, kontakt } = patient;
  
  const html = `
    <div class="patient-header">
      <h2>${nachname}, ${vorname}</h2>
      <div class="patient-meta">
        <div>Geburtsdatum: ${formatDateForPrint(geburtsdatum)}</div>
        <div>Geschlecht: ${geschlecht || '-'}</div>
        <div>Versicherung: ${versicherung}</div>
      </div>
      <div class="patient-contact">
        <div>Anschrift: ${formatAddress(anschrift)}</div>
        ${kontakt?.telefon ? `<div>Telefon: ${kontakt.telefon}</div>` : ''}
        ${kontakt?.mobil ? `<div>Mobil: ${kontakt.mobil}</div>` : ''}
        ${kontakt?.email ? `<div>E-Mail: ${kontakt.email}</div>` : ''}
      </div>
    </div>
  `;
  
  return html;
}

/**
 * Bereitet Karteieinträge für den Druck vor
 * @param eintraege - Array von Karteieinträgen
 * @param icdMap - Map von ICD10-Einträgen für Diagnosen
 * @returns HTML-String für den Druck
 */
export function preparePrintHealthRecords(eintraege: Karteieintrag[], icdMap?: Map<string, any>): string {
  if (!eintraege || eintraege.length === 0) {
    return '<div class="no-records">Keine Einträge vorhanden</div>';
  }
  
  const recordsHtml = eintraege.map(eintrag => {
    const { datum, diagnosen = [], notiz } = eintrag;
    
    const diagnosenHtml = diagnosen.map(id => {
      const diagnose = icdMap?.get(id);
      return diagnose 
        ? `<div class="diagnosis-item">${diagnose.code} – ${diagnose.titel}</div>` 
        : `<div class="diagnosis-item">${id}</div>`;
    }).join('');
    
    return `
      <div class="health-record">
        <div class="record-date">${formatDateForPrint(datum)}</div>
        ${diagnosen.length > 0 ? `<div class="diagnoses">${diagnosenHtml}</div>` : ''}
        <div class="record-notes">${notiz || ''}</div>
      </div>
    `;
  }).join('<hr>');
  
  return `
    <div class="health-records">
      <h3>Patientenakte</h3>
      ${recordsHtml}
    </div>
  `;
}

/**
 * Öffnet ein Druckfenster mit den formatierten Patientendaten
 * @param patient - Patientenobjekt
 * @param eintraege - Optional: Karteieinträge des Patienten
 * @param icdMap - Optional: Map von ICD10-Einträgen für Diagnosen
 */
export function printPatientData(patient: Patient, eintraege?: Karteieintrag[], icdMap?: Map<string, any>): void {
  const patientHtml = preparePrintPatientData(patient);
  const recordsHtml = eintraege ? preparePrintHealthRecords(eintraege, icdMap) : '';
  
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    console.error('Druckfenster konnte nicht geöffnet werden. Bitte Pop-ups erlauben.');
    return;
  }
  
  const currentDate = new Date().toLocaleDateString('de-DE');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Patientendaten: ${patient.nachname}, ${patient.vorname}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          margin: 2cm;
        }
        .print-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2cm;
          border-bottom: 1px solid #ccc;
          padding-bottom: 0.5cm;
        }
        .patient-header h2 {
          margin-bottom: 0.5cm;
        }
        .patient-meta, .patient-contact {
          margin-bottom: 0.5cm;
        }
        .health-records {
          margin-top: 1cm;
        }
        .health-record {
          margin-bottom: 1cm;
        }
        .record-date {
          font-weight: bold;
          margin-bottom: 0.2cm;
        }
        .diagnoses {
          margin-bottom: 0.3cm;
        }
        .diagnosis-item {
          color: #264a42;
        }
        hr {
          border: none;
          border-top: 1px dashed #ccc;
          margin: 1cm 0;
        }
        .footer {
          margin-top: 2cm;
          text-align: center;
          font-size: 0.8em;
          color: #666;
        }
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div>
          <h1>Naturheilpraxis</h1>
        </div>
        <div>
          Datum: ${currentDate}
        </div>
      </div>
      
      ${patientHtml}
      
      ${recordsHtml}
      
      <div class="footer">
        Vertrauliche Patienteninformationen - Nicht weitergeben
      </div>
      
      <div class="no-print" style="margin-top: 2cm; text-align: center;">
        <button onclick="window.print();" style="padding: 10px 20px;">Drucken</button>
        <button onclick="window.close();" style="padding: 10px 20px; margin-left: 10px;">Schließen</button>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
}