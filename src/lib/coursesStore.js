// Centralized Course Management Data Store for NexgenCode
// Supports dynamic Admin Course Creation, Editing, Deletion, and Student Enrollment

const INITIAL_COURSES = [
  {
    id: 'course-dsa-101',
    title: 'Data Structures & Algorithms Masterclass (2026)',
    instructor: 'Prof. Arvind Sharma',
    instructorRole: 'Head of CS & Ex-Google Staff Engineer',
    department: 'Computer Science & Engineering',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    duration: '12 Weeks (60 Hours)',
    totalStudents: 1420,
    rating: 4.9,
    reviewsCount: 384,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    tags: ['DSA', 'Python', 'C++', 'Interview Prep', 'LeetCode'],
    description: 'A comprehensive, placement-focused course covering core data structures, algorithms, asymptotic analysis, and FAANG coding patterns with live practice arenas.',
    isPublished: true,
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Time & Space Complexity Analysis (Big-O)',
        lessons: [
          { id: 'l1', title: 'Asymptotic Notations & Big-O Intuition', duration: '25 min', type: 'video' },
          { id: 'l2', title: 'Analyzing Loops & Recursion Tree', duration: '30 min', type: 'video' },
          { id: 'l3', title: 'Problem Set: Big-O Complexity Calculations', duration: '45 min', type: 'practice' }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Arrays, Two-Pointers & Sliding Window',
        lessons: [
          { id: 'l4', title: 'Two-Sum and Three-Sum Optimization Patterns', duration: '35 min', type: 'video' },
          { id: 'l5', title: 'Sliding Window Maximum & Subarray Sums', duration: '40 min', type: 'video' },
          { id: 'l6', title: 'Lab Assessment: 10 Sliding Window Problems', duration: '60 min', type: 'practice' }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Linked Lists & Fast-Slow Pointers',
        lessons: [
          { id: 'l7', title: 'Singly & Doubly Linked List Internals', duration: '30 min', type: 'video' },
          { id: 'l8', title: 'Cycle Detection (Floyd Algorithm) & Inversions', duration: '35 min', type: 'video' },
          { id: 'l9', title: 'Lab Challenge: Reverse Nodes in k-Group', duration: '50 min', type: 'practice' }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Binary Trees, BST & Tree Traversals',
        lessons: [
          { id: 'l10', title: 'Preorder, Inorder, Postorder & Level-Order BFS', duration: '45 min', type: 'video' },
          { id: 'l11', title: 'Lowest Common Ancestor & Diameter of Tree', duration: '40 min', type: 'video' },
          { id: 'l12', title: 'Practice Arena: Balanced Binary Search Trees', duration: '60 min', type: 'practice' }
        ]
      },
      {
        id: 'mod-5',
        title: 'Module 5: Dynamic Programming & Memoization',
        lessons: [
          { id: 'l13', title: '0/1 Knapsack & Unbounded Knapsack', duration: '50 min', type: 'video' },
          { id: 'l14', title: 'Longest Common Subsequence & Edit Distance', duration: '45 min', type: 'video' },
          { id: 'l15', title: 'Capstone Assessment: DP Matrix Chains', duration: '75 min', type: 'practice' }
        ]
      }
    ]
  },
  {
    id: 'course-fullstack-202',
    title: 'Full-Stack Web Engineering with Next.js & FastAPI',
    instructor: 'Dr. Neha Verma',
    instructorRole: 'Associate Professor & Cloud Architect',
    department: 'Information Technology',
    category: 'Full-Stack',
    difficulty: 'Advanced',
    duration: '10 Weeks (48 Hours)',
    totalStudents: 980,
    rating: 4.8,
    reviewsCount: 210,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    tags: ['Next.js', 'React', 'FastAPI', 'PostgreSQL', 'Docker'],
    description: 'End-to-end full-stack web development building production microservices, secure authentication, database query optimization, and automated CI/CD deployment pipelines.',
    isPublished: true,
    modules: [
      {
        id: 'mod-fs-1',
        title: 'Module 1: Modern Frontend Architecture & Next.js 14',
        lessons: [
          { id: 'l-fs-1', title: 'Server vs Client Components Architecture', duration: '35 min', type: 'video' },
          { id: 'l-fs-2', title: 'State Management & Tailwind CSS Systems', duration: '40 min', type: 'video' }
        ]
      },
      {
        id: 'mod-fs-2',
        title: 'Module 2: High-Speed Backend APIs with FastAPI & Python',
        lessons: [
          { id: 'l-fs-3', title: 'Pydantic Schemas, JWT Auth & Dependency Injection', duration: '45 min', type: 'video' },
          { id: 'l-fs-4', title: 'PostgreSQL Relational Modelling & Async SQLAlchemy', duration: '50 min', type: 'video' }
        ]
      }
    ]
  },
  {
    id: 'course-ai-303',
    title: 'Applied AI & LLM Systems for Software Engineers',
    instructor: 'Prof. K. R. Ramanujan',
    instructorRole: 'AI Research Director',
    department: 'Artificial Intelligence & Data Science',
    category: 'AI & Data',
    difficulty: 'Intermediate',
    duration: '8 Weeks (40 Hours)',
    totalStudents: 750,
    rating: 4.95,
    reviewsCount: 165,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60',
    tags: ['AI', 'Python', 'Embeddings', 'Vector DB', 'LangChain'],
    description: 'Build enterprise AI agents, semantic vector search engines with pgvector, and automated coding evaluation pipelines using modern LLMs.',
    isPublished: true,
    modules: [
      {
        id: 'mod-ai-1',
        title: 'Module 1: Vector Embeddings & Similarity Search',
        lessons: [
          { id: 'l-ai-1', title: 'High-Dimensional Vectors & Cosine Distance', duration: '30 min', type: 'video' },
          { id: 'l-ai-2', title: 'Building a RAG Pipeline with pgvector', duration: '45 min', type: 'video' }
        ]
      }
    ]
  },
  {
    id: 'course-systems-404',
    title: 'Systems Programming & Operating System Internals',
    instructor: 'Prof. Rajesh Khanna',
    instructorRole: 'Senior Systems Architect',
    department: 'Computer Science',
    category: 'Systems',
    difficulty: 'Advanced',
    duration: '10 Weeks (50 Hours)',
    totalStudents: 620,
    rating: 4.85,
    reviewsCount: 142,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
    tags: ['C++', 'Linux', 'Concurrency', 'Memory Safety', 'Sockets'],
    description: 'Deep dive into C/C++ memory allocation, multi-threading primitives, kernel system calls, and high-performance network sockets.',
    isPublished: true,
    modules: [
      {
        id: 'mod-sys-1',
        title: 'Module 1: Linux System Calls & Memory Management',
        lessons: [
          { id: 'l-sys-1', title: 'Virtual Memory, Page Tables & malloc()', duration: '40 min', type: 'video' },
          { id: 'l-sys-2', title: 'POSIX Threads & Mutex Synchronization', duration: '50 min', type: 'video' }
        ]
      }
    ]
  }
];

const STORAGE_KEY = 'nexgen_courses';
const ENROLLED_KEY = 'nexgen_enrolled_courses';

export const getCourses = () => {
  if (typeof window === 'undefined') return INITIAL_COURSES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load courses from localStorage', err);
    return INITIAL_COURSES;
  }
};

export const getCourseById = (id) => {
  const courses = getCourses();
  return courses.find((c) => c.id === id) || null;
};

export const saveCourse = (courseData) => {
  if (typeof window === 'undefined') return courseData;
  const courses = getCourses();
  let updated;

  if (courseData.id) {
    // Edit existing
    updated = courses.map((c) => (c.id === courseData.id ? { ...c, ...courseData } : c));
  } else {
    // Create new
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      totalStudents: 0,
      rating: 5.0,
      reviewsCount: 0,
      isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
      modules: courseData.modules || [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Introduction & Fundamentals',
          lessons: [
            { id: `l-${Date.now()}`, title: 'Course Overview & Setup', duration: '20 min', type: 'video' }
          ]
        }
      ]
    };
    updated = [newCourse, ...courses];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCourse = (id) => {
  if (typeof window === 'undefined') return;
  const courses = getCourses();
  const updated = courses.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getEnrolledCourses = () => {
  if (typeof window === 'undefined') return ['course-dsa-101'];
  try {
    const saved = localStorage.getItem(ENROLLED_KEY);
    if (!saved) {
      const defaultEnrolled = ['course-dsa-101'];
      localStorage.setItem(ENROLLED_KEY, JSON.stringify(defaultEnrolled));
      return defaultEnrolled;
    }
    return JSON.parse(saved);
  } catch (err) {
    return ['course-dsa-101'];
  }
};

export const enrollInCourse = (courseId) => {
  if (typeof window === 'undefined') return;
  const enrolled = getEnrolledCourses();
  if (!enrolled.includes(courseId)) {
    const updated = [...enrolled, courseId];
    localStorage.setItem(ENROLLED_KEY, JSON.stringify(updated));
    return updated;
  }
  return enrolled;
};
