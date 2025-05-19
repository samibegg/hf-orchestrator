// components/Layout.js
import Header from './Layout/Header';
import Footer from './Layout/Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; // Ensure this is a default export

