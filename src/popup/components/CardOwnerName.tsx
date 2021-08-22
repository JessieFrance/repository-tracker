import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Repository } from '../../types';
import 'fontsource-roboto';

interface OwnerNameInterface {
  repository: Repository;
}

const theme = createTheme();
theme.typography.h5 = {
  fontSize: '1rem',
  fontWeight: 'bold',
};
theme.typography.subtitle1 = {
  fontSize: '0.9rem',
  fontWeight: 'lighter',
};

const CardOwnerName = ({ repository }: OwnerNameInterface): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Grid item xs>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          spacing={2}
        >
          <Grid item xs>
            <Typography component="h5" variant="h5">
              {repository.name}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" color="textSecondary">
              {repository.owner}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default CardOwnerName;
