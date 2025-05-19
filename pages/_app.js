// pages/_app.js
import '../styles/globals.css';
import Layout from '../components/Layout'; // Import the Layout component

function MyApp({ Component, pageProps }) {
  return (
    <Layout> {/* Wrap the Component with Layout */}
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

