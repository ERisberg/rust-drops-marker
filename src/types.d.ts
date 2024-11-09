export type GenericDrop = {
  name: string;
  watchTime: string;
  domElement: HTMLElement;
  completed: boolean;
};

export interface StreamerDrop extends GenericDrop {
  streamerNames: string[];
  streamerLinks: string[];
}
