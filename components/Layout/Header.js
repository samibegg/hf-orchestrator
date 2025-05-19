// components/Layout/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left side: Logo and Brand */}
      <div className="flex items-center space-x-2">
        <img src="/images/logo.png" alt="ForgeMission Logo" className="h-11" />
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
          ForgeMission
        </Link>
      </div>

      {/* Right side: Navigation and Auth Actions */}
      <div className="flex items-center space-x-6">
        <nav className="hidden sm:flex space-x-6 text-sm sm:text-base">
          <span className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors">
            Hugging Face <span className="text-indigo-400">Model Lab</span>
          </span>
          {/* Add other nav links here */}
        </nav>
      </div>
    </header>
  );
};

export default Header;

