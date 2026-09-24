import React from 'react';
import ProblemSolverClient from './ProblemSolverClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ];
}

export default function ProblemSolverPage({ params }) {
  const resolvedId = params?.id || '1';
  return <ProblemSolverClient initialId={resolvedId} />;
}
