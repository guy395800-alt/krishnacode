export interface TestCase {
  id: number | string;
  input: string;
  expected: string;
  explanation?: string;
  is_public?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  description: string;
  functionName?: string;
  templates: {
    python?: string;
    cpp?: string;
    java?: string;
    javascript?: string;
    c?: string;
    [key: string]: string | undefined;
  };
  testCases: TestCase[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'problem' | 'reading';
  notes?: string;
  problem?: Problem;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  department: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  totalStudents: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  tags: string[];
  description: string;
  isPublished: boolean;
  modules: Module[];
}
