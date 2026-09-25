import React from 'react';
import CourseDetailClient from './CourseDetailClient';

export async function generateStaticParams() {
  return [
    { id: 'course-dsa-101' },
    { id: 'course-fullstack-202' },
    { id: 'course-ai-303' },
    { id: 'course-systems-404' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ];
}

export default function CourseDetailPage({ params }) {
  const resolvedId = params?.id || 'course-dsa-101';
  return <CourseDetailClient initialId={resolvedId} />;
}
