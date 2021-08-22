import React from 'react';
import {
  Grid,
  IconButton,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { DeleteForever as DeleteForeverIcon } from '@material-ui/icons';
import { Repository } from '../../types';
import RepositoryCardContainer from './RepositoryCardContainer';
import CardOwnerName from './CardOwnerName';
import './DeleteButton.css';
import 'fontsource-roboto';

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
              <IconButton onClick={onDelete}>
                <DeleteForeverIcon className="delete-button" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </RepositoryCardContainer>
    </ThemeProvider>
  );
};

export default RepositoryErrorCard;
