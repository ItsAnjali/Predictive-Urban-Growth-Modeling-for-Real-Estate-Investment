import { parse } from 'csv-parse/sync';
import { ZoneInput, zoneInputSchema } from '../schemas/zone';

export interface IngestResult {
  valid: ZoneInput[];
  errors: { row: number; error: string }[];
}

export const parseZonePayload = (buffer: Buffer, fileName: string): IngestResult => {
  const isJson = fileName.toLowerCase().endsWith('.json');
  const records: any[] = isJson
    ? JSON.parse(buffer.toString('utf-8'))
    : parse(buffer, { columns: true, skip_empty_lines: true, trim: true });

  if (!Array.isArray(records)) {
    throw new Error('JSON must be an array of zone objects. See sample-data/zones.json.');
  }

  const valid: ZoneInput[] = [];
  const errors: { row: number; error: string }[] = [];

  records.forEach((raw, idx) => {
    const parsed = zoneInputSchema.safeParse(raw);
    if (parsed.success) valid.push(parsed.data);
    else errors.push({ row: idx + 1, error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ') });
  });

  return { valid, errors };
};
