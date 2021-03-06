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
import '@fontsource/roboto';
import './App.css';
import {
  ChromeRequest,
  LocalStorageOptions,
  Messages,
  Repository,
} from '../../types';
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

const App = (): JSX.Element => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [owner, setOwner] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [addRepoStatus, setAddRepoStatus] =
    useState<AddRepositoryState>('ready');
  const [addRepoError, setAddRepoError] = useState<string>('');

  // Handle Chrome API messages.
  const handleMessages = ({ message }: ChromeRequest) => {
    if (message === Messages.BACKGROUND_REPOSITORIES_UPDATED) {
      getStoredRepositories().then((repos) => setRepositories(repos));
    }
  };

  useEffect(() => {
    getStoredRepositories().then((repos) => setRepositories(repos));
    getStoredOptions().then((options) => setOptions(options));
    // Add chrome message listener and cleanup.
    chrome.runtime.onMessage.addListener(handleMessages);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages);
    };
  }, []);

  const handleRepositoryDeleteButtonClick = (index: number) => {
    repositories.splice(index, 1);
    const updatedRepositories = [...repositories];
    setStoredRepositories(updatedRepositories).then(() => {
      setRepositories(updatedRepositories);
    });
    // Message other Chrome pages to let them know.
    chrome.runtime.sendMessage(
      {
        message: Messages.POPUP_REPOSITORIES_UPDATED,
      },
      () => {
        // Silence possible errors so they do not pollute the user experience.
        if (chrome.runtime.lastError) {
        }
      },
    );
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

    // Message other Chrome pages.
    chrome.runtime.sendMessage(
      {
        message: Messages.POPUP_REPOSITORIES_UPDATED,
      },
      () => {
        // Silence possible errors so they do not pollute the user experience.
        if (chrome.runtime.lastError) {
        }
      },
    );
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
