import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon, Settings as SettingsIcon } from '@material-ui/icons';
import 'fontsource-roboto';
import './App.css';
import { LocalStorageOptions, Repository } from '../../types';
import {
  getStoredOptions,
  getStoredRepositories,
  setStoredRepositories,
} from '../../utils/storage';
import { getBlankRepository } from '../../utils/misc';
import { getRepositoryTrackingData } from '../../utils/api';
import RepositoryCard from './RepositoryCard';
import SearchOwnerName from './SearchOwnerName';

const theme = createTheme();
theme.typography.h1 = {
  fontSize: '1.3rem',
};

type AddRepositoryState = 'loading' | 'error' | 'ready';

const App = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [owner, setOwner] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [addRepoStatus, setAddRepoStatus] =
    useState<AddRepositoryState>('ready');
  const [addRepoError, setAddRepoError] = useState<string>('');

  useEffect(() => {
    getStoredRepositories().then((repos) => setRepositories(repos));
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const handleRepositoryDeleteButtonClick = (index: number) => {
    repositories.splice(index, 1);
    const updatedRepositories = [...repositories];
    setStoredRepositories(updatedRepositories).then(() => {
      setRepositories(updatedRepositories);
    });
  };

  const handleOnAddRepositoryClick = async () => {
    if (owner === '' || name === '') {
      return;
    }
    const alreadyHaveRepo = repositories.some((repo) => {
      return repo.owner === owner && repo.name === name;
    });

    if (alreadyHaveRepo) {
      setAddRepoStatus('error');
      setAddRepoError('already tracking this repository');
      console.log(
        'repositories logged from within alreadyHaveRepo: ',
        repositories,
      );
      return;
    }
    setAddRepoStatus('loading');
    const repository = getBlankRepository(
      owner.toLowerCase(),
      name.toLowerCase(),
    );
    const { trackingData, etag, error } = await getRepositoryTrackingData(
      repository,
      options.apiKey,
    );

    if (error !== null) {
      setAddRepoStatus('error');
      setAddRepoError(error);
      return;
    }
    repository.trackingData = trackingData;
    repository.etag = etag;

    const newRepositories = [...repositories, repository];
    await setStoredRepositories(newRepositories);
    setRepositories(newRepositories);
    setOwner('');
    setName('');
    setAddRepoStatus('ready');
  };

  const handleOnOwnerChange = (owner: string) => {
    if (addRepoStatus === 'error') {
      setAddRepoStatus('ready');
      setAddRepoError('');
    }
    setOwner(owner.trim());
  };

  const handleOnNameChange = (name: string) => {
    if (addRepoStatus === 'error') {
      setAddRepoStatus('ready');
      setAddRepoError('');
    }
    setName(name.trim());
  };

  if (!options) {
    return null;
  }

  const settingsTooltip = 'Settings';
  const addTooltip = 'Add';
  const placeholder =
    addRepoStatus === 'error' ? addRepoError : 'Add Repository';
  const placeholderColor = addRepoStatus === 'error' ? 'error' : 'inherit';
  return (
    <ThemeProvider theme={theme}>
      <Box mx="5px" my="5px">
        <Grid container justifyContent="space-evenly">
          <Grid container justifyContent="space-between" alignItems="baseline">
            <Typography variant="h1">Repository Tracker</Typography>
            <Tooltip title={settingsTooltip}>
              <IconButton onClick={() => chrome.runtime.openOptionsPage()}>
                <SettingsIcon className="settings-button" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Paper elevation={3}>
            <Typography id="add-repo" color={placeholderColor}>
              {placeholder}
            </Typography>
            <Box display="flex" justifyContent="center">
              <SearchOwnerName
                owner={owner}
                name={name}
                onOwnerChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnOwnerChange(event.target.value)
                }
                onNameChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleOnNameChange(event.target.value)
                }
              />
              <Tooltip title={addTooltip}>
                <IconButton onClick={handleOnAddRepositoryClick}>
                  <AddIcon className="add-button" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
          {repositories.map((repository, index) => (
            <RepositoryCard
              repository={repository}
              key={index}
              onDelete={() => handleRepositoryDeleteButtonClick(index)}
            />
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default App;
