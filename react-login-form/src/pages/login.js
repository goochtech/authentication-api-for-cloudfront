import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme/theme.js';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Send from '@material-ui/icons/Send';
import Cookies from 'universal-cookie';

const request = require('request');
const cookies = new Cookies();

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(6),
    margin: 'auto',
    maxWidth: 500,
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  textField: {
    width: '100%',
  },
  title: {
    marginTop: theme.spacing(6),
  },
  ml10: {
    marginLeft: 10,
  },
  mt10: {
    marginTop: theme.spacing(2),
  },
  bgHeight: {
    height: 28.5,
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      height: 23,
    },
  },
  bgColor: {
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(2),
  },
});


class Login extends React.Component {

  state = {
    user: '',
    password: '',
    snackMessage: 'default message',
    open: false,
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = event => {
    let data = {
      user: this.state.user,
      password: this.state.password,
    };

    let options = {
      url: 'https://j5ptc84y1g.execute-api.us-west-2.amazonaws.com/dev/login',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      body: JSON.stringify(data)
    };

    const handleSubmitSuccess = () => {
      window.location.reload();
    };

    const handleSubmitFailure = () => {
      this.setState({
        snackMessage: 'An problem occurred with your login. Please check your password.',
        // snackMessage: txt,
        open: true,
      })
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        cookies.set('authorization', JSON.parse(response.body).headers.Authorization[0].value, { path: '/', secure: true} );
        // handleSubmitSuccess();
        // var passthis = JSON.stringify(response);
        handleSubmitSuccess();
      } else {
        handleSubmitFailure();
      }
    })
  }

render() {
    const { classes } = this.props;
    // const { value } = this.state;
  return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
          <Paper className={classes.paper}>
            <Grid container alignItems="center" justify="center" spacing={0}>
              <Grid item xs={11} sm={10} md={8}>
                <Typography variant='h5' className={classes.title}>
                  Sign In
                </Typography>
                <Typography variant='body2' className={classes.mt10} paragraph>
                  Enter your credentials to access content.
                </Typography>
                <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
                    // onError={errors => console.log(errors)}
                >
                  <TextValidator
                    id="standard-user"
                    label="Username"
                    className={classes.textField}
                    value={this.state.user}
                    validators={['required']}
                    errorMessages={['Username is required']}
                    onChange={this.handleChange('user')}
                    margin="normal"
                  />
                  <TextValidator
                    id="standard-password-input"
                    label="Password"
                    className={classes.textField}
                    type="password"
                    autoComplete="current-password"
                    value={this.state.password}
                    validators={['required']}
                    errorMessages={['Password is required']}
                    onChange={this.handleChange('password')}
                    margin="normal"
                  />
                  <Button type="submit" variant="contained" className={classes.button} color='primary' fullWidth>
                    Submit
                    <Send className={classes.ml10}/>
                  </Button>
              </ValidatorForm>
              </Grid>
            </Grid>
          </Paper>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackMessage}</span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
      </MuiThemeProvider>
  );
}
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Login);