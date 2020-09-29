import { createMuiTheme } from '@material-ui/core/styles';

const blue = '#B2EDFB';
const green = '#B2E3A1';
const yellow = '#FAE9BD';
const red = '#E3A5A1';
const purple = '#E6DBFF';

const textLight = '#D4D4D4';
const textDisabled = '#797979';

const bgDark = '#111111';
const paperDark = '#1E1E1E';

// Create a theme instance.
const theme = createMuiTheme({
  // fon
  typography: {
    fontFamily: [
      'CascadiaCode',
    ].join(','),
  },
  palette: {
    // type: 'dark',
    text: {
      primary: textLight,
      disabled: textDisabled,
      secondary: textDisabled,
    },
    background: {
      default: bgDark,
      paper: paperDark,
    },
    primary: {
      main: blue,
    },
    secondary: {
      main: yellow,
    },
    success: {
      main: green,
    },
    warning: {
      main: red,
    },
    info: {
      main: purple,
    },
    // info: 
    // secondary: {
    //   // main: '#19857b',
    // },
    // error: {
    //   // main: red.A400,
    // },
    // background: {
    //   // default: '#fff',
    // },
  },
});

export default theme;