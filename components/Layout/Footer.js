// components/Layout/Footer.js
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-400">
          &copy; {currentYear} AI Model Lab - ForgeMission. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
