import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  DeleteForever as DeleteForeverIcon,
} from '@material-ui/icons';
import { openIssueTab } from '../../utils/chrome';
import { Repository } from '../../types';
import CardOwnerName from './CardOwnerName';
import './RepositoryCard.css';

interface RepositoryCardContainerInterface {
  children: React.ReactNode;
}

interface RepositoryCardInterface {
  repository: Repository;
  onDelete: () => void;
}

const RepositoryCardContainer = ({
  children,
}: RepositoryCardContainerInterface) => {
  return (
    <Box mx={'2px'} my={'5px'} width="100%">
      <Paper elevation={3}>
        <Card>
          <CardContent>{children}</CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

type RepositoryStats = 'pulls' | 'issues' | 'total';
type CardPage = 'Summary' | 'Details';
const tooltipDelete = 'Delete';
const tooltipLink = 'Open tab to GitHub';
const theme = createTheme();
theme.typography.h6 = {
  fontSize: '0.9rem',
  fontWeight: 'normal',
};

const RepositoryCard = ({
  repository,
  onDelete,
}: RepositoryCardInterface): JSX.Element => {
  const [statsArr] = useState<RepositoryStats[]>(['issues', 'pulls', 'total']);
  const [statIndex, setStatIndex] = useState<number>(0);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [cardArr] = useState<CardPage[]>(['Summary', 'Details']);

  // Render error for repository if it exists.
  if (repository.error) {
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
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </RepositoryCardContainer>
      </ThemeProvider>
    );
  }

  const incrementStatsIndex = () => {
    const index = statIndex + 1;
    setStatIndex(index === statsArr.length ? 0 : index);
  };
  const decrementStatsIndex = () => {
    const index = statIndex - 1;
    setStatIndex(index < 0 ? statsArr.length - 1 : index);
  };
  const incrementCardIndex = () => {
    const index = cardIndex + 1;
    setCardIndex(index === cardArr.length ? 0 : index);
  };
  const decrementCardIndex = () => {
    const index = cardIndex - 1;
    setCardIndex(index < 0 ? cardArr.length - 1 : index);
  };

  // Not super efficient....convert to useEffect or something.
  const countStats = (repo: Repository): number => {
    if (statsArr[statIndex] === 'total') return repo.trackingData.length;
    if (statsArr[statIndex] === 'pulls') {
      return repo.trackingData.filter((item) => item.type === 'pr').length;
    } else {
      return repo.trackingData.filter((item) => item.type === 'issue').length;
    }
  };

  const RepoStats = () => {
    return (
      <Grid item xs className="center-card">
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
                <IconButton onClick={decrementStatsIndex} className="arrow">
                  <ArrowLeftIcon />
                </IconButton>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  component="h6"
                  variant="h6"
                  className="display-stat"
                  align="center"
                >
                  {statsArr[statIndex]}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <IconButton onClick={incrementStatsIndex} className="arrow">
                  <ArrowRightIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="stat-value">
            <Typography variant="subtitle1" color="textSecondary">
              {stats}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const stats = countStats(repository);
  const shouldRender = cardArr[cardIndex];

  return (
    <ThemeProvider theme={theme}>
      <RepositoryCardContainer>
        {shouldRender === 'Summary' && (
          <Grid
            container
            direction="row"
            spacing={0}
            alignItems="center"
            justifyContent="space-around"
          >
            <CardOwnerName repository={repository} />
            <RepoStats />
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
                    <IconButton onClick={onDelete}>
                      <DeleteForeverIcon className="delete-button" />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs className="next-card-right">
                  <Tooltip title={cardArr[cardIndex + 1]}>
                    <IconButton onClick={incrementCardIndex}>
                      <ArrowForwardIcon className="change-page-button" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {shouldRender === 'Details' && (
          <Grid container>
            <Tooltip title={cardArr[cardIndex - 1]}>
              <IconButton onClick={decrementCardIndex}>
                <ArrowBackIcon className="change-page-button" />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" className="details-header">
              {capitalize(repository.name)} Details
            </Typography>
            <Grid item className="repo-issues">
              <ul>
                {repository.trackingData.map((issue, issueIndex) => {
                  return (
                    <Box key={issueIndex}>
                      <li>
                        <Typography variant="subtitle1" className="issue-text">
                          <Tooltip title={tooltipLink}>
                            <span
                              className="issue-link"
                              onClick={() => openIssueTab(issue, repository)}
                            >
                              #{issue.number} [{issue.type}]
                            </span>
                          </Tooltip>
                          {issue.title}{' '}
                          <span className="issue-author">
                            by {issue.author}
                          </span>
                        </Typography>
                      </li>
                      <Divider />
                    </Box>
                  );
                })}
              </ul>
            </Grid>
          </Grid>
        )}
      </RepositoryCardContainer>
    </ThemeProvider>
  );
};

const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export default RepositoryCard;
