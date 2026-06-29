import type { Role, SchoolType, FileType, FileStatus, ContentType, ContentStatus, QuestionType, Difficulty, ArchiveType, AdPosition } from '@prisma/client';

export type { Role, SchoolType, FileType, FileStatus, ContentType, ContentStatus, QuestionType, Difficulty, ArchiveType, AdPosition };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FileWithRelations {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: FileType;
  mimeType: string;
  thumbnail?: string | null;
  schoolTypes: SchoolType[];
  tags: string[];
  status: FileStatus;
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  isFeatured: boolean;
  isPremium: boolean;
  createdAt: Date;
  publishedAt?: Date | null;
  author: { id: string; name: string | null; image: string | null };
  category?: { id: string; name: string; slug: string } | null;
  subject?: { id: string; name: string; slug: string; color: string | null } | null;
  grade?: { id: string; name: string; level: number } | null;
}

export interface NewsWithAuthor {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image?: string | null;
  type: ContentType;
  status: ContentStatus;
  tags: string[];
  viewCount: number;
  isFeatured: boolean;
  isPinned: boolean;
  isAiGenerated: boolean;
  sourceUrl?: string | null;
  sourceName?: string | null;
  publishedAt?: Date | null;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
}

export interface QuestionWithRelations {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  options?: Record<string, unknown> | null;
  answer?: string | null;
  explanation?: string | null;
  schoolTypes: SchoolType[];
  tags: string[];
  isApproved: boolean;
  useCount: number;
  createdAt: Date;
  author: { id: string; name: string | null };
  subject?: { id: string; name: string; color: string | null } | null;
  grade?: { id: string; name: string } | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalFiles: number;
  totalDownloads: number;
  totalNews: number;
  totalQuestions: number;
  newUsersToday: number;
  downloadsToday: number;
  activeAds: number;
  pendingFiles: number;
  recentActivity: Array<{
    type: string;
    description: string;
    createdAt: Date;
  }>;
}

export interface FilterOptions {
  schoolType?: SchoolType;
  gradeId?: string;
  subjectId?: string;
  categoryId?: string;
  fileType?: FileType;
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
