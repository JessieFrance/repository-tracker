import React from 'react';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import './SearchOwnerName.css';

interface SetOwnerNameProps {
  owner: string;
  name: string;
  onOwnerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchOwnerName = ({
  owner,
  name,
  onOwnerChange,
  onNameChange,
}: SetOwnerNameProps): JSX.Element => {
  return (
    <>
      <FormControl className="repo-input">
        <InputLabel htmlFor="component-helper">Owner</InputLabel>
        <Input id="component-helper" value={owner} onChange={onOwnerChange} />
        <FormHelperText id="component-helper-text">
          i.e. &ldquo;facebook&ldquo;
        </FormHelperText>
      </FormControl>
      <FormControl className="repo-input">
        <InputLabel htmlFor="component-helper">Name</InputLabel>
        <Input id="component-helper" value={name} onChange={onNameChange} />
        <FormHelperText id="component-helper-text">
          i.e. &ldquo;react&ldquo;
        </FormHelperText>
      </FormControl>
    </>
  );
};

export default SearchOwnerName;
