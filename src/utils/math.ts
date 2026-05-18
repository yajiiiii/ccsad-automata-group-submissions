
import type { SequenceConfig } from '../types';

export interface SequenceResult {
  terms: number[];
  status: 'Valid' | 'Invalid: Too Few' | 'Invalid: Negative' | 'Invalid: Fractional';
  message: string;
}

export const checkPalindrome = (input: string) => {
  const cleanInput = input.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversed = cleanInput.split('').reverse().join('');
  return {
    isPalindrome: cleanInput === reversed && cleanInput.length > 0,
    cleanInput,
    reversed
  };
};

export const runDivisionAlgorithm = (a: number, b: number) => {
  const dividend = Math.max(a, b);
  const divisor = Math.min(a, b);
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return { dividend, divisor, quotient, remainder };
};

export const runEuclideanAlgorithm = (a: number, b: number) => {
  let x = Math.max(a, b);
  let y = Math.min(a, b);
  const steps: { dividend: number, divisor: number, quotient: number, remainder: number }[] = [];

  while (y !== 0) {
    const q = Math.floor(x / y);
    const r = x % y;
    steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
    x = y;
    y = r;
  }

  const gcd = x;
  const lcm = (a * b) / gcd;
  return { steps, gcd, lcm };
};

export const generateCollatz = (n: number) => {
  const sequence: number[] = [n];
  let current = n;
  while (current > 1 && sequence.length < 1000) {
    if (current % 2 === 0) {
      current = current / 2;
    } else {
      current = 3 * current + 1;
    }
    sequence.push(current);
  }
  return sequence;
};

export const generateSequence = (config: SequenceConfig, input: string): SequenceResult => {
  const termsCount = parseFloat(input);
  
  if (isNaN(termsCount)) {
    return { terms: [], status: 'Invalid: Too Few', message: 'Input is not a number.' };
  }

  if (termsCount < 0) {
    return { terms: [], status: 'Invalid: Negative', message: 'Negative terms are not allowed.' };
  }

  if (!Number.isInteger(termsCount)) {
    return { terms: [], status: 'Invalid: Fractional', message: 'Please enter a whole number.' };
  }

  if (termsCount <= config.minTerms) {
    return { 
      terms: [], 
      status: 'Invalid: Too Few', 
      message: `Input ${termsCount} is too low. ${config.name} require more than ${config.minTerms} terms.` 
    };
  }
  
  const result: number[] = [...config.initialValues];
  
  for (let i = result.length; i < termsCount; i++) {
    if (config.id === 'tribonacci') {
      result.push(result[i - 1] + result[i - 2] + result[i - 3]);
    } else {
      result.push(result[i - 1] + result[i - 2]);
    }
  }
  
  return { terms: result, status: 'Valid', message: 'Sequence generated successfully.' };
};
