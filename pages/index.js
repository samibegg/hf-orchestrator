// pages/index.js
import Head from 'next/head';
import HuggingFaceOrchestrator from '../components/HuggingFaceOrchestrator/HuggingFaceOrchestrator';

export default function HomePage() {
  return (
    <> {/* Using a fragment as the main div is now in Layout.js */}
      <Head>
        <title>Hugging Face Model Lab | Orchestrator</title>
        <meta name="description" content="Orchestrate Hugging Face models for inference and fine-tuning" />
        <link rel="icon" href="/favicon.ico" /> {/* Make sure to add a favicon.ico to your public folder */}
      </Head>

      {/* The HuggingFaceOrchestrator is the main content for this page */}
      {/* The max-w-4xl and centering will be handled by the Layout's main tag or you can add it here if specific to this page */}
      <div className="w-full max-w-4xl mx-auto"> {/* Centering the orchestrator component */}
        <HuggingFaceOrchestrator />
      </div>
    </>
  );
}

