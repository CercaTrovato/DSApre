export enum SlideType {
  INTRO = 'INTRO',
  PROBLEM = 'PROBLEM',
  SOLUTION_3D = 'SOLUTION_3D',
  METHODOLOGY = 'METHODOLOGY',
  RESULTS = 'RESULTS',
  IMPACT = 'IMPACT',
  RISKS = 'RISKS'
}

export interface ChartData {
  name: string;
  Manual: number;
  AI: number;
}
