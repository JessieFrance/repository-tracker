import React from 'react';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';
import { openIssueTab } from '../../utils/chrome';
import { Repository } from '../../types';
import { capitalize } from '../../utils/misc';
import './RepositoryDetailsCard.css';
import './ChangePageButton.css';

interface RepositoryDetailsCardInterface {
  title: string;
  decrementCardIndex: () => void;
  tooltipLink: string;
  repository: Repository;
}

const RepositoryDetailsCard = ({
  title,
  decrementCardIndex,
  tooltipLink,
  repository,
}: RepositoryDetailsCardInterface): JSX.Element => {
  return (
    <Grid container>
      <Tooltip title={title}>
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
