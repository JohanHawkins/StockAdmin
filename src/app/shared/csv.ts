export function detectDelimiter(text: string): string {
  const end = text.indexOf('\n');
  const firstLine = text.slice(0, end === -1 ? text.length : end);
  const commas = firstLine.split(',').length - 1;
  const semicolons = firstLine.split(';').length - 1;
  return semicolons > commas ? ';' : ',';
}

export function parseCSV(text: string): string[][] {
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const data = text.replace(/\r/g, '');

  for (let i = 0; i < data.length; i++) {
    const char = data[i];

    if (inQuotes) {
      if (char === '"') {
        if (data[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      field = '';
      if (row.some((cell) => cell.trim() !== '')) {
        rows.push(row);
      }
      row = [];
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== '')) {
      rows.push(row);
    }
  }

  return rows;
}

const HEADER_ALIASES: Record<string, string> = {
  code: 'code',
  codigo: 'code',
  name: 'name',
  nombre: 'name',
  product: 'name',
  producto: 'name',
  description: 'description',
  descripcion: 'description',
  desc: 'description',
  price: 'price',
  precio: 'price',
  preciounitario: 'price',
  stock: 'stock',
  cantidad: 'stock',
  minstock: 'minStock',
  stockminimo: 'minStock',
  stockmin: 'minStock',
  categorycode: 'categoryCode',
  categoria: 'categoryCode',
  category: 'categoryCode',
  codigocategoria: 'categoryCode',
  status: 'status',
  estado: 'status',
};

function resolveHeader(header: string): string | null {
  const normalized = header
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_\-]+/g, '');
  return HEADER_ALIASES[normalized] ?? null;
}

export function csvToObjects(text: string): Array<Record<string, string>> {
  const rows = parseCSV(text);
  if (rows.length === 0) return [];

  const headers = rows[0].map(resolveHeader);

  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (header) {
        obj[header] = (row[index] ?? '').trim();
      }
    });
    return obj;
  });
}

export function toNumber(value: string): number {
  const trimmed = String(value).trim();
  if (!trimmed) return 0;

  const lastComma = trimmed.lastIndexOf(',');
  const lastDot = trimmed.lastIndexOf('.');
  let normalized = trimmed;

  if (lastComma > lastDot) {
    const stripped = trimmed.replace(/\./g, '');
    const commaIndex = stripped.lastIndexOf(',');
    const before = stripped.slice(0, commaIndex).replace(/,/g, '');
    const after = stripped.slice(commaIndex + 1).replace(/,/g, '');
    normalized = before + '.' + after;
  } else if (lastDot > lastComma) {
    normalized = trimmed.replace(/,/g, '');
  }

  return Number(normalized) || 0;
}

export function serializeCSV(headers: string[], rows: unknown[][]): string {
  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (str.includes(';') || str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const lines = [headers.map(escape).join(';')];
  for (const row of rows) {
    lines.push(row.map(escape).join(';'));
  }
  return lines.join('\r\n');
}
