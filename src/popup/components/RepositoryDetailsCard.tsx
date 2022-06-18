import React from 'react';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Repository, IssueSummary } from '../../types';
import { capitalize } from '../../utils/misc';
import './RepositoryDetailsCard.css';
import './ChangePageButton.css';
import '@fontsource/roboto';

interface RepositoryDetailsCardInterface {
  title: string;
  decrementCardIndex: () => void;
  tooltipLink: string;
  repository: Repository;
}

/**
 * Opens a chrome tab for an issue in a repository.
 * @param  {IssueSummary}  issue Summary of an issue object
 * @param  {Repository}    repository Repository object
 * @return {Promise<void>}  Promise that opens a chrome tab for that issue
 */
const openIssueTab = (issue: IssueSummary, repository: Repository) => {
  const { name, owner } = repository;
  const type = issue.type === 'pr' ? 'pull' : 'issues';
  const url = `https://github.com/${owner}/${name}/${type}/${issue.number}`;
  chrome.tabs.create({ url });
};

const RepositoryDetailsCard = ({
  title,
  decrementCardIndex,
  tooltipLink,
  repository,
}: RepositoryDetailsCardInterface): JSX.Element => {
  return (
    <Grid container>
      <Tooltip title={title}>
        <IconButton onClick={decrementCardIndex} size="large">
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
                    <span className="issue-author">by {issue.author}</span>
                  </Typography>
                </li>
                <Divider />
              </Box>
            );
          })}
        </ul>
      </Grid>
    </Grid>
  );
};
export default RepositoryDetailsCard;
