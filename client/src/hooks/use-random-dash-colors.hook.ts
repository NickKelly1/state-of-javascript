import { useTheme } from "@material-ui/core";
import { useMemo } from "react";
import { DashColours } from "../dashboard-theme";
import { shuffle } from "../helpers/shuffle.helper";
import { ThemeColourType } from "../theme";
import { RandomFn } from "../types/random-fn.type";

export function useRandomDashColours(
  options?: {
    random?: RandomFn;
  },
): string[] {
  const colours = useMemo(() => shuffle(DashColours, options), [DashColours]);
  return colours;
}