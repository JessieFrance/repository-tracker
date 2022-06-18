import React from 'react';
import { Grid, IconButton, Theme, Tooltip, Typography } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import { Repository } from '../../types';
import RepositoryCardContainer from './RepositoryCardContainer';
import CardOwnerName from './CardOwnerName';
import './DeleteButton.css';
import '@fontsource/roboto';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

interface RepositoryErrorCardInterface {
  theme: Theme;
  repository: Repository;
  tooltipDelete: string;
  onDelete: () => void;
}

const RepositoryErrorCard = ({
  theme,
  repository,
  tooltipDelete,
  onDelete,
}: RepositoryErrorCardInterface): JSX.Element => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RepositoryCardContainer>
          <Grid container justifyContent="space-around">
            <CardOwnerName repository={repository} />
            <Grid item>
              <Typography component="h6" variant="h6">
                Error
              </Typography>
              <Typography variant="subtitle2">{repository.error}</Typography>
            </Grid>
            <Grid item>
              <Tooltip title={tooltipDelete}>
                <IconButton onClick={onDelete} size="large">
                  <DeleteForeverIcon className="delete-button" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </RepositoryCardContainer>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default RepositoryErrorCard;
