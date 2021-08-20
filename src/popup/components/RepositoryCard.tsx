import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Repository } from '../../types';
import RepositoryCardContainer from './RepositoryCardContainer';
import RepositoryErrorCard from './RepositoryErrorCard';
import RepositorySummaryCard from './RepositorySummaryCard';
import RepositoryDetailsCard from './RepositoryDetailsCard';

interface RepositoryCardInterface {
  repository: Repository;
  onDelete: () => void;
}

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
  const [statCounts, setStatCounts] = useState<number[]>([0, 0, 0]);
  const [statIndex, setStatIndex] = useState<number>(0);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [cardArr] = useState<CardPage[]>(['Summary', 'Details']);

  // Render error for repository if it exists.
  if (repository.error) {
    return (
      <RepositoryErrorCard
        theme={theme}
        repository={repository}
        tooltipDelete={tooltipDelete}
        onDelete={onDelete}
      />
    );
  }

  // Increment/decrement index functions
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

  const countStats = (repo: Repository, statType: RepositoryStats): number => {
    if (statType === 'total') return repo.trackingData.length;
    if (statType === 'pulls') {
      return repo.trackingData.filter((item) => item.type === 'pr').length;
    } else {
      return repo.trackingData.filter((item) => item.type === 'issue').length;
    }
  };

  useEffect(() => {
    const newStatCounts = statsArr.map((statType) =>
      countStats(repository, statType),
    );
    setStatCounts(newStatCounts);
  }, [repository]);

  const shouldRender = cardArr[cardIndex];

  return (
    <ThemeProvider theme={theme}>
      <RepositoryCardContainer>
        {shouldRender === 'Summary' && (
          <RepositorySummaryCard
            decrementStatsIndex={decrementStatsIndex}
            incrementStatsIndex={incrementStatsIndex}
            incrementCardIndex={incrementCardIndex}
            onDelete={onDelete}
            tooltipDelete={tooltipDelete}
            statType={statsArr[statIndex]}
            stats={statCounts[statIndex]}
            currentCard={cardArr[cardIndex + 1]}
            repository={repository}
          />
        )}
        {shouldRender === 'Details' && (
          <RepositoryDetailsCard
            title={cardArr[cardIndex - 1]}
            decrementCardIndex={decrementCardIndex}
            tooltipLink={tooltipLink}
            repository={repository}
          />
        )}
      </RepositoryCardContainer>
    </ThemeProvider>
  );
};
export default RepositoryCard;
