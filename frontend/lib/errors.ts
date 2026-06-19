const DEFAULT_ERROR_MESSAGE = 'เกิดข้อผิดพลาด';

export function getErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE) {
  return error instanceof Error ? error.message : fallback;
}
