export type CurveFamily = 'linear' | 'quadratic';
export function curveValue(family: CurveFamily, coefficients: number[], x: number) {
  return family === 'linear' ? coefficients[0] * x + coefficients[1] : coefficients[0] * x * x + coefficients[1] * x + coefficients[2];
}
export function readCoefficients(value: string, family: CurveFamily): number[] {
  const fallback = family === 'linear' ? [0, 0] : [1, 0, 0];
  if (!value.trim()) return fallback;
  const values = value.split(',').map(Number);
  return values.length === fallback.length && values.every(Number.isFinite) ? values : fallback;
}
export function curveEquation(family: CurveFamily, coefficients: number[]) {
  const powers = family === 'linear' ? ['x', ''] : ['x²', 'x', ''];
  const terms = coefficients.flatMap((n, i) => {
    if (!n) return [];
    const magnitude = Math.abs(n);
    const term = `${magnitude === 1 && powers[i] ? '' : magnitude}${powers[i]}`;
    return [{ negative: n < 0, term }];
  });
  return `y = ${terms.length ? terms.map((t, i) => `${i ? t.negative ? ' − ' : ' + ' : t.negative ? '−' : ''}${t.term}`).join('') : '0'}`;
}
