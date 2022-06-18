import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createTheme,
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material/styles';
import {
  Box,
  Button,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Save as SaveIcon,
  Info as InfoIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import './options.css';
import '@fontsource/roboto';
import { getStoredOptions, setStoredOptions } from '../utils/storage';
import { LocalStorageOptions } from '../types';
import { checkAPIkey } from '../utils/api';
import '@mui/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const SUCCESS_RESET_TIME = 8000; // seconds
const GITHUB_INFO_URL =
  'https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token';

type FormState = 'ready' | 'saving' | 'error' | 'success';

const theme = createTheme();
theme.typography.h1 = {
  fontSize: '3rem',
  textAlign: 'center',
};
theme.typography.h2 = {
  fontSize: '1.8rem',
};

const Options = (): JSX.Element => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [showAPIKey, setShowAPIKey] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>('ready');
  const [apiErrMsg, setApiErrMsg] = useState<string>('');

  // Load stored options.
  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  // Reset form state if it's success back to ready.
  useEffect(() => {
    if (formState === 'success') {
      const timer = setTimeout(() => {
        setFormState('ready');
      }, SUCCESS_RESET_TIME);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  const handleApiKeyChange = (apiKey: string) => {
    if (formState === 'error') {
      setFormState('ready');
      setApiErrMsg('');
    }
    const trimmed = apiKey.trim();
    setOptions({
      ...options,
      apiKey: trimmed,
    });
  };

  const handleEnableNotificationsChange = (enableNotifications: boolean) => {
    setOptions({
      ...options,
      enableNotifications,
    });
  };

  const handleInfoButtonClick = () => {
    chrome.tabs.create({ url: GITHUB_INFO_URL });
  };

  const handleSaveButtonClick = async () => {
    setFormState('saving');
    // Before saving, check if API key is valid.
    if (options.apiKey !== '') {
      const err = await checkAPIkey(options.apiKey);
      if (err) {
        setFormState('error');
        setApiErrMsg(err);
        return;
      }
    }

    // Set options and success state.
    setStoredOptions(options).then(() => {
      const timer = setTimeout(() => setFormState('success'), 1000);
      return () => clearTimeout(timer);
    });
  };

  // Return early if options haven't been loaded from local storage.
  if (!options) {
    return null;
  }

  const isFieldDisabled = formState === 'saving';
  const tooltipInfo =
    'This option lets you make more GitHub API requests. Click to get your own API Key from GitHub.';

  return (
    <StyledEngineProvider injectFirst={false}>
      <ThemeProvider theme={theme}>
        <Box mx="10%" my="2%">
          <Paper elevation={3}>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Typography variant="h1">Repository Tracker Options</Typography>
              </Grid>
              <Grid
                container
                className="api-options"
                direction="row"
                spacing={4}
              >
                <Typography variant="h2">Set a GitHub API Key</Typography>
                <Tooltip title={tooltipInfo} className="my-tooltip">
                  <Fab color="primary" size="small">
                    <InfoIcon onClick={handleInfoButtonClick} />
                  </Fab>
                </Tooltip>
              </Grid>
              <Grid item className="select-options">
                <InputLabel htmlFor="component-helper">API Key</InputLabel>
                <Input
                  id="api-input"
                  type={showAPIKey ? 'text' : 'password'}
                  value={options.apiKey}
                  onChange={(event) => handleApiKeyChange(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowAPIKey(!showAPIKey)}
                        size="large"
                      >
                        {showAPIKey ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item className="select-options">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={options.enableNotifications}
                      />
                    }
                    onChange={(_, clicked) =>
                      handleEnableNotificationsChange(clicked)
                    }
                    label="Enable Notifications"
                  />
                </FormGroup>
              </Grid>
              <Grid
                container
                justifyContent="flex-start"
                className="save-error-success"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSaveButtonClick}
                  startIcon={<SaveIcon />}
                  disabled={isFieldDisabled}
                  id="save-options"
                >
                  Save
                </Button>
                {formState === 'error' && (
                  <Typography
                    variant="subtitle1"
                    className="error-success"
                    color="error"
                  >
                    Unable to Save Settings: {apiErrMsg}
                  </Typography>
                )}
                {formState === 'success' && (
                  <Typography
                    variant="subtitle1"
                    className="error-success"
                    id="success"
                  >
                    Success!
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Options;

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Options />);
