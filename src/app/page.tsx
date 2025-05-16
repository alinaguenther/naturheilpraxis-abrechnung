'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text font-sans">
      {/* Hero Section */}
      <section className="bg-white shadow-md py-12 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <Image
            src="/pictures/logo.svg"
            alt="Logo"
            width={220}
            height={220}
            className="rounded-full"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Naturheilpraxis Abrechnungssoftware
            </h1>
            <p className="text-gray-700 max-w-xl">
              Verwalte deine Patienten, Termine und Rechnungen digital – effizient, sicher und modern.
              Die intuitive Softwarelösung für Heilpraktiker:innen.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/patienten"
                className="bg-primary hover:bg-primaryDark text-white px-5 py-2 rounded shadow"
              >
                Patienten öffnen
              </Link>
              <Link
                href="/rechnungen"
                className="bg-primary hover:bg-primaryDark text-white px-5 py-2 rounded shadow"
              >
                Rechnungsübersicht
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 md:px-12 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-10">Funktionen im Überblick</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: 'Patientenkartei',
                desc: 'Digitale Akten mit Diagnosen, Notizen, Gesprächsverläufen und Spracherkennung.',
              },
              {
                title: 'ICD-10 Integration',
                desc: 'Diagnoseauswahl mit intelligenter Suche und Autovervollständigung.',
              },
              {
                title: 'Rechnungsverwaltung',
                desc: 'PDF-Rechnungserstellung gemäß GebüH – schnell und rechtssicher.',
              },
              {
                title: 'Datenspeicherung lokal',
                desc: 'Alle Daten werden lokal gespeichert (JSON-Dateien) – DSGVO-konform.',
              },
              {
                title: 'Responsive Design',
                desc: 'Optimiert für Desktop & Mobil – nutze die Software auch unterwegs.',
              },
              {
                title: 'Open Source',
                desc: 'Volle Kontrolle über deinen Code. Anpassbar, erweiterbar und kostenlos.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-primary">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Naturheilpraxis Claudia Holtkamp – Abrechnungssoftware
      </footer>
    </main>
  );
}
