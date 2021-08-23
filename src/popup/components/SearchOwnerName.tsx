import React from 'react';
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
} from '@material-ui/core';
import './SearchOwnerName.css';

export interface SearchOwnerNamePropsInterface {
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
}: SearchOwnerNamePropsInterface): JSX.Element => {
  return (
    <>
      <FormControl className="repo-input">
        <InputLabel htmlFor="owner">Owner</InputLabel>
        <Input
          id="owner"
          data-testid="owner-input"
          value={owner}
          onChange={onOwnerChange}
        />
        <FormHelperText id="owner-example">
          i.e. &ldquo;facebook&ldquo;
        </FormHelperText>
      </FormControl>
      <FormControl className="repo-input">
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input
          id="name"
          value={name}
          data-testid="name-input"
          onChange={onNameChange}
        />
        <FormHelperText id="name-example">
          i.e. &ldquo;react&ldquo;
        </FormHelperText>
      </FormControl>
    </>
  );
};

export default SearchOwnerName;
