
export type ActivityType = 'fibonacci' | 'lucas' | 'tribonacci' | 'palindrome' | 'division-algorithm' | 'euclidean' | 'collatz';

export type SequenceType = 'fibonacci' | 'lucas' | 'tribonacci';

export interface ActivityConfig {
  id: ActivityType;
  name: string;
  discussion: string;
  formula?: string;
}

export interface SequenceConfig extends ActivityConfig {
  id: SequenceType;
  formula: string;
  initialValues: number[];
  minTerms: number;
}
