import React from 'react';
import { Grid, IconButton, Typography } from '@mui/material';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import './RepoStats.css';
import '@fontsource/roboto';

export interface RepoStatsInterface {
  decrementStatsIndex: () => void;
  incrementStatsIndex: () => void;
  statType: string;
  stats: number;
}

const RepoStats = ({
  decrementStatsIndex,
  incrementStatsIndex,
  statType,
  stats,
}: RepoStatsInterface): JSX.Element => {
  return (
    <Grid item xs>
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={1}
        justifyContent="flex-start"
      >
        <Grid item xs>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={0}
            justifyContent="space-around"
          >
            <Grid item xs={4}>
              <IconButton onClick={decrementStatsIndex} size="large">
                <ArrowLeftIcon />
              </IconButton>
            </Grid>
            <Grid item xs={4}>
              <Typography
                component="h6"
                variant="h6"
                className="display-stat"
                align="center"
                data-testid="stat-type"
              >
                {statType}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton onClick={incrementStatsIndex} size="large">
                <ArrowRightIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            data-testid="stats"
          >
            {stats}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default RepoStats;
