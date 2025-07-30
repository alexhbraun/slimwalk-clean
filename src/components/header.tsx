import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 py-1 sm:py-2 px-4 sm:px-6 md:px-8 bg-background shadow-sm">
      <div className="w-full max-w-4xl mx-auto">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SlimWalk Logo"
            width={105}
            height={35}
            className="mx-auto"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
