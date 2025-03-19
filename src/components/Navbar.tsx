import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <Link href="/contacto" className="hover:text-blue-500">Contacto</Link>
        </li>
        <li>
          <Link href="/about-us" className="hover:text-blue-500">About Us</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 