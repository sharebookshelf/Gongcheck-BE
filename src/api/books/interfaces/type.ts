export interface IStandardizedScores {
  [key: string]: number;
}

export type IAnalysisResult = {
  preferredCategory: string;
  standardizedScores: IStandardizedScores;
};
