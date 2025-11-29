export interface SummarySection {
  heading: string;
  content: string;
}

export interface SummaryData {
  title: string;
  sections: SummarySection[];
}
