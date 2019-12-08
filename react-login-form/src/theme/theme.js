import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import grey from '@material-ui/core/colors/grey';

export default createMuiTheme({
  palette: {
      primary: indigo,
      secondary: pink,
    background: {
        primary: grey,
        secondary: grey,
    },
  },
  typography: {
    useNextVariants: true,
  },
});