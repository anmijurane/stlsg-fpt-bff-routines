// utils/base64.ts
export function decodeBase64(data: string): string {
  return Buffer.from(data, 'base64').toString('utf-8');
}
