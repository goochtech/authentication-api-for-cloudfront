import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function Footer(props) {
  const { theme } = props;

  const styles = {
    footer: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 5,
      backgroundColor: theme.palette.grey[300],
    },
  };
    
    return (
            <Grid container direction="row" style={styles.footer} alignItems="flex-start" justify="space-evenly" spacing={0}>
                <Grid item xs={10}>
                    <Grid container>
                        <Typography variant="subtitle2"  gutterBottom>{props.children}</Typography>
                    </Grid>
                </Grid>
            </Grid>
    );
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default withTheme()(Footer);