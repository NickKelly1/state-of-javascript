import { makeStyles } from "@material-ui/core";
import { useFormStyles } from "./use-form-styles.hook";

export const useThemeColours = makeStyles((theme) => ({
  primary: { color: theme.palette.primary.main },
  bgPrimary: { backgroundColor: theme.palette.primary.main },

  secondary: { color: theme.palette.secondary.main },
  bgSecondary: { backgroundColor: theme.palette.secondary.main },

  textPrimary: { color: theme.palette.primary.main },
  bgTextPrimary: { backgroundColor: theme.palette.primary.main },

  textSecondary: { color: theme.palette.text.secondary },
  bgTextSecondary: { backgroundColor: theme.palette.text.secondary },

  success: { color: theme.palette.success.main },
  bgSuccess: { backgroundColor: theme.palette.success.main },

  warning: { color: theme.palette.warning.main },
  bgWarning: { backgroundColor: theme.palette.warning.main },

  error: { color: theme.palette.error.main },
  bgError: { backgroundColor: theme.palette.error.main },

  info: { color: theme.palette.info.main },
  bgInfo: { backgroundColor: theme.palette.info.main },
}));

export type ThemeColourKey = keyof ReturnType<typeof useThemeColours>;
