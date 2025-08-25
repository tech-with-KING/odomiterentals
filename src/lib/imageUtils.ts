/**
 * Image upload utilities for product management
 */

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
}

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Validates image files for upload
 * @param files - FileList or File array to validate
 * @returns validation result with errors if any
 */
export function validateImageFiles(files: FileList | File[]): ImageValidationResult {
  const errors: string[] = [];
  const fileArray = Array.from(files);

  if (fileArray.length === 0) {
    errors.push('No files selected');
    return { isValid: false, errors };
  }

  // Check file sizes
  const oversizedFiles = fileArray.filter(file => file.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    errors.push(`${oversizedFiles.length} file(s) exceed the 10MB limit`);
  }

  // Check file types
  const invalidTypeFiles = fileArray.filter(file => 
    !SUPPORTED_IMAGE_TYPES.includes(file.type as any)
  );
  if (invalidTypeFiles.length > 0) {
    errors.push(`${invalidTypeFiles.length} file(s) have unsupported formats. Only JPEG, PNG, GIF, and WebP are allowed`);
  }

  // Check for empty files
  const emptyFiles = fileArray.filter(file => file.size === 0);
  if (emptyFiles.length > 0) {
    errors.push(`${emptyFiles.length} file(s) are empty`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Formats file size for display
 * @param bytes - file size in bytes
 * @returns formatted string like "2.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Gets the accept attribute value for image file inputs
 * @returns comma-separated string of supported MIME types
 */
export function getImageAcceptTypes(): string {
  return SUPPORTED_IMAGE_TYPES.join(',');
}

/**
 * Checks if a file is a supported image type
 * @param file - File to check
 * @returns true if file type is supported
 */
export function isSupportedImageType(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type as any);
}

/**
 * Gets a human-readable list of supported image formats
 * @returns string like "JPEG, PNG, GIF, WebP"
 */
export function getSupportedFormatsString(): string {
  return SUPPORTED_IMAGE_TYPES
    .map(type => type.replace('image/', '').toUpperCase())
    .join(', ');
}
