import { createMuiTheme } from '@material-ui/core/styles';



// h1	6rem
// h2	3.75rem
// h3	3rem
// h4	2.125rem
// h5	1.5rem
// h6	1.25rem


// GitHub

// h1	2em
// h2	1.5em


export enum ThemeColourType {
  primary,
  secondary,
  success,
  info,
  warning,
}

// const blue = '#B2EDFB';
// const green = '#B2E3A1';
// const yellow = '#FAE9BD';
// const red = '#E3A5A1';
// const purple = '#E6DBFF';

// const blue = '#9DD8FC';
// const green = '#A1E69E';
// const yellow = '#FFEBA8';
// const red = '#E6A69E';
// const purple = '#EBB0FF';

const blue = '#55DAFF';
// const blue = '#0088FE';
const green = '#84E660';
const yellow = '#FFE476';
const red = '#E66E60';
const purple = '#F28AFF';

// const blue = '#0088FE';
// const green = '#00C49F';
// const yellow = '#FFBB28';
// const red = '#FF8042';
// const purple = '#EBB0FF';

const textLight = '#D4D4D4';
const textDisabled = '#797979';

const bgDark = '#111111';
const paperDark = '#1E1E1E';

// Create a theme instance.
const theme = createMuiTheme(({
  typography: {
    fontFamily: [ 'CascadiaCode', ].join(','),

    h1: { fontSize: '2rem' },
    h2: { fontSize: '1.75rem' },
    h3: { fontSize: '1.5rem' },
    h4: { fontSize: '1.3rem' },
    h5: { fontSize: '1.25rem' },
    h6: { fontSize: '1.2rem' },
    
    // h1: {
    //   fontSize: '2.5rem',
    // },
    // h2: {
    //   fontSize: '2rem',
    // },
    // h3: {
    //   fontSize: '1.5rem',
    // },
    // h4: {
    //   fontSize: '2rem',
    // },
  },
  palette: {
    type: 'dark',

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
}));

// theme.overrides = {
//   ...theme.overrides,
//   MuiInputLabel: {
//     ...theme.overrides?.MuiInputLabel,
//   },
// }

export default theme;
