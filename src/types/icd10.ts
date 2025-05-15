export interface ICD10Chapter {
  id: string;
  title: string;
  range: string;
}

export interface ICD10Entry {
  code: string;
  text: string;
  chapterId: string;
}