export type BoxType = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type FountItemType = {
  confidence: number;
  className: string;
  box: BoxType;
};

export type ShootResponse = {
  foundItems: FountItemType[];
  foundItemsCount: number;
  unfilteredItemsCount: number;
  foundClasses: string[];
  foundClassScores: Record<string, number>;
};
