'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="page-container">
      {/* Hero Section */}
      <section className="section-container">
        <div className="content-wrapper flex flex-col md:flex-row items-center gap-10">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={220}
            height={220}
            className="rounded-full"
          />
          <div>
            <h1 className="page-title">
              Naturheilpraxis Abrechnungssoftware
            </h1>
            <p className="text-gray-700 max-w-xl">
              Verwalte deine Patienten, Termine und Rechnungen digital – effizient, sicher und modern.
              Die intuitive Softwarelösung für Heilpraktiker:innen.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="/patienten" className="btn btn-primary">
                Patienten öffnen
              </Link>
              <Link href="/rechnungen" className="btn btn-primary">
                Rechnungsübersicht
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 md:px-12 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="section-title">Funktionen im Überblick</h2>
          <div className="features-grid">
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
              <div key={i} className="card">
                <h3 className="card-title">{f.title}</h3>
                <p className="card-text">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} Naturheilpraxis Claudia Holtkamp – Abrechnungssoftware
      </footer>
    </main>
  );
}
