import React from 'react';
import ExamInstructionClient from './ExamInstructionClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default function ExamInstructionPage({ params }) {
  const resolvedId = params?.id || '1';
  return <ExamInstructionClient initialId={resolvedId} />;
}
