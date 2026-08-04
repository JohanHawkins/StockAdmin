import { describe, it, expect } from 'vitest';
import {
  detectDelimiter,
  parseCSV,
  csvToObjects,
  toNumber,
  serializeCSV,
} from './csv';

describe('detectDelimiter', () => {
  it('detecta coma cuando hay más comas', () => {
    expect(detectDelimiter('a,b,c\n1,2,3')).toBe(',');
  });

  it('detecta punto y coma cuando hay más punto y coma', () => {
    expect(detectDelimiter('a;b;c\n1;2;3')).toBe(';');
  });

  it('con empate usa coma', () => {
    expect(detectDelimiter('a,b\n1,2')).toBe(',');
  });
});

describe('parseCSV', () => {
  it('parsea filas simples con salto de línea final', () => {
    expect(parseCSV('a,b\n1,2\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('soporta CRLF', () => {
    expect(parseCSV('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('respeta campos entre comillas con separador interno', () => {
    expect(parseCSV('a,"b,c"\n')).toEqual([['a', 'b,c']]);
  });

  it('desescapa comillas dobles internas', () => {
    expect(parseCSV('"dijo ""hola"""\n')).toEqual([['dijo "hola"']]);
  });

  it('omite líneas vacías', () => {
    expect(parseCSV('a,b\n\n\n1,2\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('captura la última celda sin salto de línea final', () => {
    expect(parseCSV('a,b\n1,2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
});

describe('csvToObjects', () => {
  it('mapea encabezados conocidos sin importar mayúsculas', () => {
    const rows = csvToObjects('CODIGO,NOMBRE,PRECIO\nP001,Teclado,12.50');
    expect(rows).toEqual([{ code: 'P001', name: 'Teclado', price: '12.50' }]);
  });

  it('normaliza encabezados con acentos y espacios', () => {
    const rows = csvToObjects('Código Categoria,Stock Mínimo\nP001,3');
    expect(rows).toEqual([{ categoryCode: 'P001', minStock: '3' }]);
  });

  it('ignora encabezados desconocidos', () => {
    const rows = csvToObjects('foo,code\nx,P001');
    expect(rows).toEqual([{ code: 'P001' }]);
  });
});

describe('toNumber', () => {
  it('devuelve 0 para vacío', () => {
    expect(toNumber('')).toBe(0);
  });

  it('devuelve 0 para texto inválido', () => {
    expect(toNumber('abc')).toBe(0);
  });

  it('parsea enteros', () => {
    expect(toNumber('10')).toBe(10);
  });

  it('parsea formato es-ES (1.234,56)', () => {
    expect(toNumber('1.234,56')).toBe(1234.56);
  });

  it('parsea formato en-US (1,234.56)', () => {
    expect(toNumber('1,234.56')).toBe(1234.56);
  });
});

describe('serializeCSV', () => {
  it('usa punto y coma como separador', () => {
    expect(serializeCSV(['a', 'b'], [['1', '2']])).toBe('a;b\r\n1;2');
  });

  it('escapa celdas con separador, comilla o salto de línea', () => {
    expect(serializeCSV(['a'], [['x;y']])).toBe('a\r\n"x;y"');
    expect(serializeCSV(['a'], [['dijo "hola"']])).toBe('a\r\n"dijo ""hola"""');
  });
});
