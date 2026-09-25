// Centralized Course Management Data Store for NexgenCode
// Supports dynamic Admin Course Creation, Editing, Deletion, Student Enrollment, and Integrated Function-Return Coding Challenges

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
          {
            id: 'l1',
            title: 'Asymptotic Notations & Big-O Intuition',
            duration: '25 min',
            type: 'video',
            notes: 'Understand Big-O, Big-Omega, and Big-Theta bounds. Analyze constant, logarithmic, linear, linearithmic, and quadratic time algorithms.'
          },
          {
            id: 'l2',
            title: 'Analyzing Loops & Recursion Tree',
            duration: '30 min',
            type: 'video',
            notes: 'Master the Master Theorem and recursion tree unrolling to evaluate divide-and-conquer runtime complexities.'
          },
          {
            id: 'l3',
            title: 'Coding Problem: Find Maximum Element in Array',
            duration: '45 min',
            type: 'problem',
            problem: {
              id: 'prob-max-element',
              title: 'Find Maximum Element in Array',
              difficulty: 'Easy',
              points: 50,
              description: 'Given a list of integers `nums`, return the largest integer in the array in O(n) time.\n\n### Function Signature Rule:\n**Do NOT read from standard input (no input() / cin / Scanner). Simply implement the function and RETURN the maximum value.**',
              functionName: 'findMaxElement',
              templates: {
                python: `# Return the maximum integer in the list
def findMaxElement(nums: list[int]) -> int:
    if not nums:
        return 0
    max_val = nums[0]
    for n in nums:
        if n > max_val:
            max_val = n
    return max_val
`,
                cpp: `// Return the maximum integer in the vector
#include <vector>
#include <algorithm>
using namespace std;

int findMaxElement(vector<int>& nums) {
    if (nums.empty()) return 0;
    int maxVal = nums[0];
    for (int n : nums) {
        if (n > maxVal) maxVal = n;
    }
    return maxVal;
}
`,
                java: `// Return the maximum integer in the array
public class Solution {
    public int findMaxElement(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int max = nums[0];
        for (int n : nums) {
            if (n > max) max = n;
        }
        return max;
    }
}
`,
                javascript: `// Return the maximum integer in the array
function findMaxElement(nums) {
    if (!nums || nums.length === 0) return 0;
    return Math.max(...nums);
}
`
              },
              testCases: [
                { id: 1, input: 'nums = [3, 7, 2, 9, 5]', expected: '9', explanation: '9 is the largest element in the array' },
                { id: 2, input: 'nums = [-10, -3, -50, -1]', expected: '-1', explanation: '-1 is the largest element among negative integers' },
                { id: 3, input: 'nums = [42]', expected: '42', explanation: 'Single element array' }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Arrays, Two-Pointers & Sliding Window',
        lessons: [
          {
            id: 'l4',
            title: 'Two-Sum and Three-Sum Optimization Patterns',
            duration: '35 min',
            type: 'video',
            notes: 'Learn hash-map complement lookup O(n) vs two-pointer sorted array traversal.'
          },
          {
            id: 'l5',
            title: 'Coding Problem: Two Sum Target Pair Indices',
            duration: '45 min',
            type: 'problem',
            problem: {
              id: 'prob-two-sum',
              title: 'Two Sum Target Pair Indices',
              difficulty: 'Easy',
              points: 50,
              description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n### Function Signature Rule:\n**Do NOT read from standard input. Simply implement the function and RETURN the list of indices `[index1, index2]`.**',
              functionName: 'twoSum',
              templates: {
                python: `# Return list of two indices [i, j] adding up to target
def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
`,
                cpp: `// Return vector<int> containing two indices adding to target
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}
`,
                java: `// Return int[] containing two indices adding to target
import java.util.HashMap;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) return new int[]{map.get(diff), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}
`,
                javascript: `// Return array of two indices [i, j] adding up to target
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) return [map.get(diff), i];
        map.set(nums[i], i);
    }
    return [];
}
`
              },
              testCases: [
                { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1]' },
                { id: 2, input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2]' },
                { id: 3, input: 'nums = [3, 3], target = 6', expected: '[0, 1]', explanation: 'nums[0] + nums[1] == 6, return [0, 1]' }
              ]
            }
          },
          {
            id: 'l6',
            title: 'Coding Problem: Maximum Subarray (Kadane Algorithm)',
            duration: '50 min',
            type: 'problem',
            problem: {
              id: 'prob-max-subarray',
              title: 'Maximum Subarray Sum',
              difficulty: 'Medium',
              points: 75,
              description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\n### Function Signature Rule:\n**Do NOT read from standard input. Simply RETURN the computed maximum subarray sum.**',
              functionName: 'maxSubArray',
              templates: {
                python: `# Return the maximum subarray sum using Kadane's Algorithm
def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum
`,
                cpp: `// Return the maximum subarray sum
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currSum = nums[0];
    for (size_t i = 1; i < nums.size(); i++) {
        currSum = max(nums[i], currSum + nums[i]);
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}
`,
                java: `// Return the maximum subarray sum
public class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0];
        int sum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            sum = Math.max(nums[i], sum + nums[i]);
            max = Math.max(max, sum);
        }
        return max;
    }
}
`,
                javascript: `// Return the maximum subarray sum
function maxSubArray(nums) {
    let max = nums[0];
    let sum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        sum = Math.max(nums[i], sum + nums[i]);
        max = Math.max(max, sum);
    }
    return max;
}
`
              },
              testCases: [
                { id: 1, input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6' },
                { id: 2, input: 'nums = [1]', expected: '1', explanation: 'Single element subarray' },
                { id: 3, input: 'nums = [5, 4, -1, 7, 8]', expected: '23', explanation: 'The whole array sum is 23' }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-3',
        title: 'Module 3: Linked Lists & Fast-Slow Pointers',
        lessons: [
          {
            id: 'l7',
            title: 'Singly & Doubly Linked List Internals',
            duration: '30 min',
            type: 'video',
            notes: 'Node struct memory allocation, pointer manipulation, and boundary checks.'
          },
          {
            id: 'l8',
            title: 'Coding Problem: Valid Palindrome String',
            duration: '40 min',
            type: 'problem',
            problem: {
              id: 'prob-valid-palindrome',
              title: 'Valid Palindrome (Two Pointers)',
              difficulty: 'Easy',
              points: 50,
              description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n### Function Signature Rule:\n**Do NOT read from standard input. Simply RETURN `true` or `false` (`True`/`False` in Python).**',
              functionName: 'isPalindrome',
              templates: {
                python: `# Return True if s is a palindrome, else False
def isPalindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]
`,
                cpp: `// Return true if s is a palindrome, else false
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}
`,
                java: `// Return true if s is a palindrome, else false
public class Solution {
    public boolean isPalindrome(String s) {
        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int l = 0, r = clean.length() - 1;
        while (l < r) {
            if (clean.charAt(l++) != clean.charAt(r--)) return false;
        }
        return true;
    }
}
`,
                javascript: `// Return true if s is a palindrome, else false
function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === clean.split('').reverse().join('');
}
`
              },
              testCases: [
                { id: 1, input: 's = "A man, a plan, a canal: Panama"', expected: 'true', explanation: '"amanaplanacanalpanama" is a palindrome' },
                { id: 2, input: 's = "race a car"', expected: 'false', explanation: '"raceacar" is not a palindrome' },
                { id: 3, input: 's = " "', expected: 'true', explanation: 'An empty string is a valid palindrome' }
              ]
            }
          }
        ]
      },
      {
        id: 'mod-4',
        title: 'Module 4: Dynamic Programming & Recursion',
        lessons: [
          {
            id: 'l9',
            title: 'Coding Problem: Climbing Stairs (Fibonacci DP)',
            duration: '45 min',
            type: 'problem',
            problem: {
              id: 'prob-climbing-stairs',
              title: 'Climbing Stairs DP',
              difficulty: 'Easy',
              points: 50,
              description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n### Function Signature Rule:\n**Do NOT read from standard input. Simply RETURN the total number of distinct ways.**',
              functionName: 'climbStairs',
              templates: {
                python: `# Return the number of distinct ways to climb n steps
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
`,
                cpp: `// Return the number of distinct ways to climb n steps
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
`,
                java: `// Return the number of distinct ways to climb n steps
public class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }
}
`,
                javascript: `// Return the number of distinct ways to climb n steps
function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) {
        const temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
`
              },
              testCases: [
                { id: 1, input: 'n = 2', expected: '2', explanation: 'There are two ways: 1 step + 1 step, or 2 steps' },
                { id: 2, input: 'n = 3', expected: '3', explanation: 'There are three ways: 1+1+1, 1+2, or 2+1' },
                { id: 3, input: 'n = 5', expected: '8', explanation: 'Fibonacci sequence value for 5 steps is 8' }
              ]
            }
          }
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
          {
            id: 'l-fs-1',
            title: 'Server vs Client Components Architecture',
            duration: '35 min',
            type: 'video',
            notes: 'Understanding SSR, SSG, ISR, and React Server Components.'
          },
          {
            id: 'l-fs-2',
            title: 'Coding Problem: Format URL Query Parameter Object',
            duration: '40 min',
            type: 'problem',
            problem: {
              id: 'prob-build-query',
              title: 'Format URL Query Parameter Object',
              difficulty: 'Easy',
              points: 50,
              description: 'Given a dictionary/object of query parameters, return the formatted URL query string prefixed with `?` or empty string if empty.\n\n### Function Signature Rule:\n**Do NOT read standard input. Simply RETURN the formatted query string.**',
              functionName: 'buildQueryString',
              templates: {
                python: `# Return formatted query string e.g. "?page=1&limit=10"
def buildQueryString(params: dict) -> str:
    if not params:
        return ""
    parts = [f"{k}={v}" for k, v in sorted(params.items())]
    return "?" + "&".join(parts)
`,
                javascript: `// Return formatted query string e.g. "?page=1&limit=10"
function buildQueryString(params) {
    if (!params || Object.keys(params).length === 0) return "";
    const parts = Object.keys(params).sort().map(k => \`\${k}=\${params[k]}\`);
    return "?" + parts.join('&');
}
`
              },
              testCases: [
                { id: 1, input: 'params = {"page": 1, "limit": 10}', expected: '"?limit=10&page=1"', explanation: 'Sorted URL encoded query string' },
                { id: 2, input: 'params = {}', expected: '""', explanation: 'Empty parameter object' }
              ]
            }
          }
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
          {
            id: 'l-ai-1',
            title: 'Vector Distance Metrics Lecture',
            duration: '30 min',
            type: 'video',
            notes: 'Euclidean distance, Dot Product, and Cosine Similarity equations.'
          },
          {
            id: 'l-ai-2',
            title: 'Coding Problem: Cosine Similarity of Vectors',
            duration: '45 min',
            type: 'problem',
            problem: {
              id: 'prob-cosine-similarity',
              title: 'Compute Cosine Similarity of Vectors',
              difficulty: 'Medium',
              points: 75,
              description: 'Given two numerical vectors `vecA` and `vecB` of equal dimension, return their cosine similarity rounded to 4 decimal places.\n\n### Function Signature Rule:\n**Do NOT read standard input. Simply RETURN the computed float value.**',
              functionName: 'cosineSimilarity',
              templates: {
                python: `# Return cosine similarity float rounded to 4 decimals
import math

def cosineSimilarity(vecA: list[float], vecB: list[float]) -> float:
    dot = sum(a * b for a, b in zip(vecA, vecB))
    normA = math.sqrt(sum(a * a for a in vecA))
    normB = math.sqrt(sum(b * b for b in vecB))
    if normA == 0 or normB == 0:
        return 0.0
    return round(dot / (normA * normB), 4)
`,
                javascript: `// Return cosine similarity float rounded to 4 decimals
function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0.0;
    return Number((dot / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4));
}
`
              },
              testCases: [
                { id: 1, input: 'vecA = [1.0, 2.0, 3.0], vecB = [1.0, 2.0, 3.0]', expected: '1.0', explanation: 'Identical vectors have similarity 1.0' },
                { id: 2, input: 'vecA = [1.0, 0.0], vecB = [0.0, 1.0]', expected: '0.0', explanation: 'Orthogonal vectors have similarity 0.0' }
              ]
            }
          }
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
          {
            id: 'l-sys-1',
            title: 'Virtual Memory & Page Tables',
            duration: '40 min',
            type: 'video',
            notes: 'Virtual memory translation, MMU architecture, and page faults.'
          },
          {
            id: 'l-sys-2',
            title: 'Coding Problem: Count Number of Set Bits (Hamming Weight)',
            duration: '40 min',
            type: 'problem',
            problem: {
              id: 'prob-count-set-bits',
              title: 'Count Set Bits (Brian Kernighan Algorithm)',
              difficulty: 'Easy',
              points: 50,
              description: 'Given a positive 32-bit integer `n`, return the count of set bits (1s) in its binary representation.\n\n### Function Signature Rule:\n**Do NOT read standard input. Simply RETURN the integer count of set bits.**',
              functionName: 'countSetBits',
              templates: {
                python: `# Return the count of set bits (1s) in n
def countSetBits(n: int) -> int:
    count = 0
    while n > 0:
        n &= (n - 1)
        count += 1
    return count
`,
                cpp: `// Return the count of set bits (1s) in n
int countSetBits(int n) {
    int count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}
`,
                java: `// Return the count of set bits (1s) in n
public class Solution {
    public int countSetBits(int n) {
        int count = 0;
        while (n > 0) {
            n &= (n - 1);
            count++;
        }
        return count;
    }
}
`,
                javascript: `// Return the count of set bits (1s) in n
function countSetBits(n) {
    let count = 0;
    while (n > 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}
`
              },
              testCases: [
                { id: 1, input: 'n = 11', expected: '3', explanation: '11 in binary is 1011 (3 set bits)' },
                { id: 2, input: 'n = 128', expected: '1', explanation: '128 in binary is 10000000 (1 set bit)' },
                { id: 3, input: 'n = 15', expected: '4', explanation: '15 in binary is 1111 (4 set bits)' }
              ]
            }
          }
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
            { id: `l-${Date.now()}`, title: 'Course Overview & Setup', duration: '20 min', type: 'video', notes: 'Welcome to the course.' }
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
