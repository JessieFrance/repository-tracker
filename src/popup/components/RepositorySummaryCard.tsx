import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';

import {
  ArrowForward as ArrowForwardIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { Repository } from '../../types';
import RepoStats from './RepoStats';
import CardOwnerName from './CardOwnerName';
import './DeleteButton.css';
import './ChangePageButton.css';

interface RepositorySummaryCardInterface {
  decrementStatsIndex: () => void;
  incrementStatsIndex: () => void;
  incrementCardIndex: () => void;
  onDelete: () => void;
  tooltipDelete: string;
  statType: string;
  stats: number;
  currentCard: string;
  repository: Repository;
}

const RepositorySummaryCard = ({
  decrementStatsIndex,
  incrementStatsIndex,
  incrementCardIndex,
  onDelete,
  tooltipDelete,
  statType,
  stats,
  currentCard,
  repository,
}: RepositorySummaryCardInterface): JSX.Element => {
  return (
    <Grid
      container
      direction="row"
      spacing={0}
      alignItems="center"
      justifyContent="space-around"
    >
      <CardOwnerName repository={repository} />
      <RepoStats
        decrementStatsIndex={decrementStatsIndex}
        incrementStatsIndex={incrementStatsIndex}
        statType={statType}
        stats={stats}
      />
      <Grid item xs>
        <Grid
          container
          direction="column"
          alignItems="flex-end"
          justifyContent="center"
          spacing={0}
        >
          <Grid item xs>
            <Tooltip title={tooltipDelete}>
              <IconButton onClick={onDelete} size="large">
                <DeleteForeverIcon className="delete-button" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs>
            <Tooltip title={currentCard}>
              <IconButton onClick={incrementCardIndex} size="large">
                <ArrowForwardIcon className="change-page-button" />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RepositorySummaryCard;
