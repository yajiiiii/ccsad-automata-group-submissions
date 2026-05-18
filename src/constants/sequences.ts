
import type { SequenceConfig, ActivityConfig } from '../types';

export const SEQUENCES: Record<string, SequenceConfig> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci numbers',
    discussion: 'A number of terms of the sequence a1, a2, ..., an are given. These are the initial values. A rule called the recursion is given, which explains how an is to be computed in terms of previous terms in the sequence.',
    formula: 'Fn = Fn-1 + Fn-2',
    initialValues: [0, 1],
    minTerms: 2
  },
  lucas: {
    id: 'lucas',
    name: 'Lucas numbers',
    discussion: 'The Lucas numbers Ln have the initial values L0 = 2, L1 = 1. The recursion is Ln = Ln-1 + Ln-2 if n >= 2.',
    formula: 'Ln = Ln-1 + Ln-2',
    initialValues: [2, 1],
    minTerms: 2
  },
  tribonacci: {
    id: 'tribonacci',
    name: 'Tribonacci numbers',
    discussion: 'The Tribonacci numbers Tn have the initial values T0 = 0, T1 = 0, T2 = 1. The recursion is Tn = Tn-1 + Tn-2 + Tn-3 if n >= 3.',
    formula: 'Tn = Tn-1 + Tn-2 + Tn-3',
    initialValues: [0, 0, 1],
    minTerms: 3
  }
};

export const CASE_STUDIES: Record<string, ActivityConfig> = {
  palindrome: {
    id: 'palindrome',
    name: 'Palindrome Checker',
    discussion: 'A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward, ignoring spaces, punctuation, and capitalization.',
  },
  'division-algorithm': {
    id: 'division-algorithm',
    name: 'Division Algorithm',
    discussion: 'The Division Algorithm states that for any two integers a and b (b > 0), there exist unique integers q and r such that a = bq + r, where 0 <= r < b.',
    formula: 'a = b(q) + r'
  },
  euclidean: {
    id: 'euclidean',
    name: 'Euclidean Algorithm (GCD & LCM)',
    discussion: 'The Euclidean Algorithm is an efficient method for computing the greatest common divisor (GCD) of two integers. The Least Common Multiple (LCM) can then be found using the relationship: LCM(a, b) = |a*b| / GCD(a, b).',
    formula: 'GCD(a, b) & LCM(a, b)'
  },
  collatz: {
    id: 'collatz',
    name: 'Collatz Sequence',
    discussion: 'The Collatz conjecture is a conjecture in mathematics that concerns a sequence defined as follows: start with any positive integer n. Then each term is obtained from the previous term as follows: if the previous term is even, the next term is one half of the previous term. If the previous term is odd, the next term is 3 times the previous term plus 1. The conjecture is that no matter what value of n, the sequence will always reach 1.',
    formula: 'n/2 (even), 3n+1 (odd)'
  }
};
