import { useTheme } from "@material-ui/core";
import { useMemo } from "react";
import { shuffle } from "../helpers/shuffle.helper";
import { ThemeColourType } from "../theme";

export type ThemeColourOmissions = ThemeColourType[];


export function useRandomThemeColours(omissions?: ThemeColourOmissions): string[] {
  const theme = useTheme();
  const options = useMemo(() => {
    const omitSet = new Set(omissions);
    const running: string[] = [];
    if (!omitSet.has(ThemeColourType.primary)) running.push(theme.palette.primary.main);
    if (!omitSet.has(ThemeColourType.secondary)) running.push(theme.palette.secondary.main);
    if (!omitSet.has(ThemeColourType.success)) running.push(theme.palette.success.main);
    if (!omitSet.has(ThemeColourType.warning)) running.push(theme.palette.warning.main);
    if (!omitSet.has(ThemeColourType.info)) running.push(theme.palette.info.main);
    return running;
  }, [omissions]);
  const colours = useMemo(() => shuffle(options), [options]);
  return colours;
}