import numeral from 'numeral';

export const parsePlayerValue = (value: string): number => {
  const cleanedValue = value.replace(/[^0-9.MK]/g, '');
  const multiplier = cleanedValue.includes('M') ? 1000000 : cleanedValue.includes('K') ? 1000 : 1;
  const numericValue = parseFloat(cleanedValue.replace(/[MK]/g, ''));

  if (isNaN(numericValue)) {
    return 0;
  }

  return numericValue * multiplier;
};