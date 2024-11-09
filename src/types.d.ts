export type GenericDrop = {
  name: string;
  watchTime: string;
  domElement: HTMLElement;
  completed: boolean;
};

export type Streamer = {
  name: string;
  url: string;
  online: boolean;
};

export interface StreamerDrop extends GenericDrop {
  streamers: Streamer[];
}
