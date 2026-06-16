export interface PageEntry {
  slug: string;
  title: string;
  shortTitle?: string;
}

export interface SeriesManifest {
  seriesTitle: string;
  subtitle?: string;
  description?: string;
  pages: PageEntry[];
}
