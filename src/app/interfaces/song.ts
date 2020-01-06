export interface SongUpload {
  title: string;
  description: string;
  uploadedBy: string;
  file: File;
  imageUrl?: string;
}

export interface Song {
  id: number;
  title: string;
  description: string;
  uploadedBy: string;
  uri: string;
  bpm: string;
  imageUrl: string;
  created: string;
}
