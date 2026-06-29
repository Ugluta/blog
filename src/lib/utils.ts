import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: 'tr' });
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bayt';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bayt', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Az önce';
  const intervals = [
    { label: 'yıl', seconds: 31536000 },
    { label: 'ay', seconds: 2592000 },
    { label: 'hafta', seconds: 604800 },
    { label: 'gün', seconds: 86400 },
    { label: 'saat', seconds: 3600 },
    { label: 'dakika', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label} önce`;
  }
  return 'Az önce';
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.includes('pdf')) return '📹';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
  return '📄';
}

export function getFileTypeColor(fileType: string): string {
  const colors: Record<string, string> = {
    PDF: 'bg-red-100 text-red-700',
    WORD: 'bg-blue-100 text-blue-700',
    EXCEL: 'bg-green-100 text-green-700',
    POWERPOINT: 'bg-orange-100 text-orange-700',
    IMAGE: 'bg-purple-100 text-purple-700',
    VIDEO: 'bg-pink-100 text-pink-700',
    ZIP: 'bg-yellow-100 text-yellow-700',
  };
  return colors[fileType] || 'bg-gray-100 text-gray-700';
}

export const SCHOOL_TYPE_LABELS: Record<string, string> = {
  ANAOKULU: 'Anaokulu',
  ILKOKUL: 'İlkokul',
  ORTAOKUL: 'Ortaokul',
  LISE: 'Lise',
  IMAM_HATIP: 'İmam Hatip',
  MESLEK_LISESI: 'Meslek Lisesi',
  OZEL_EGITIM: 'Özel Eğitim',
  UNIVERSITE: 'Üniversite',
  GENEL: 'Genel',
};

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editör',
  MODERATOR: 'Modératör',
  TEACHER: 'Öğretmen',
  ADMIN_STAFF: 'İdareci',
  MEMBER: 'Üye',
  GUEST: 'Ziyaretçi',
};
