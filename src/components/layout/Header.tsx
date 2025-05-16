import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/pictures/logo.svg"
              alt="Logo"
              width={150}
              height={150}
              priority
            />
          </Link>
        </div>
        <nav>
          <Link 
            href="/"
            className="px-3 py-2 rounded-md"
          >
            Startseite
          </Link>
        </nav>
      </div>
    </header>
  );
}