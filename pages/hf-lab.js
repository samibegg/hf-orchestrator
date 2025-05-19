// pages/hf-lab.js
import Head from 'next/head';
import HuggingFaceOrchestrator from '../components/HuggingFaceOrchestrator/HuggingFaceOrchestrator';

export default function HfLabPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <Head>
        <title>HF Model Lab</title>
      </Head>
      <main>
        <HuggingFaceOrchestrator />
      </main>
    </div>
  );
}
