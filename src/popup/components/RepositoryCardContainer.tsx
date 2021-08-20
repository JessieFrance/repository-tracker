import React from 'react';
import { Box, Card, CardContent, Paper } from '@material-ui/core';

interface RepositoryCardContainerInterface {
  children: React.ReactNode;
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

export default RepositoryCardContainer;
