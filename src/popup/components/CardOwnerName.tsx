import React from 'react';
import { Grid, Typography } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { Repository } from '../../types';
import '@fontsource/roboto';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

export interface CardOwnerNameInterface {
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

const CardOwnerName = ({ repository }: CardOwnerNameInterface): JSX.Element => {
  return (
    <StyledEngineProvider injectFirst>
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
              <Typography component="h5" variant="h5" data-testid="repo-name">
                {repository.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="subtitle1"
                color="textSecondary"
                data-testid="repo-owner"
              >
                {repository.owner}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default CardOwnerName;
