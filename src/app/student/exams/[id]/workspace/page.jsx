import React from 'react';
import ExamWorkspaceClient from './ExamWorkspaceClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

export default function ExamWorkspacePage({ params }) {
  const resolvedId = params?.id || '1';
  return <ExamWorkspaceClient initialId={resolvedId} />;
}
