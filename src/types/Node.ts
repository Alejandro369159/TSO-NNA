// Types
export type Node = { id: string; x: number; y: number };

export type MatrixNode = {
  id: string;
  x: number;
  y: number;
  relations: { toId: string; distance: number }[];
};
