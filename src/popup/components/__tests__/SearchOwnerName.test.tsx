/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchOwnerName, {
  SearchOwnerNamePropsInterface,
} from '../SearchOwnerName';

/**
 * Obtain a render of the SearchOwnerName JSX element.
 * @param  {SearchOwnerNameInterface}  props  Optional props. If no props are
 *                                                              provided default
 *                                                             props will be used.
 * @return {RenderResult}  React Testing Library render of SearchOwnerName
 */
const renderSearchOwnerName = (
  props: Partial<SearchOwnerNamePropsInterface> = {},
) => {
  const defaultProps: SearchOwnerNamePropsInterface = {
    owner: 'scooby',
    name: 'doo',
    onOwnerChange: jest.fn(),
    onNameChange: jest.fn(),
  };
  return render(<SearchOwnerName {...defaultProps} {...props} />);
};

describe('<SearchOwnerName />', () => {
  test('should match label fields', () => {
    const { getByLabelText } = renderSearchOwnerName();
    expect((getByLabelText(/owner/i) as HTMLInputElement).value).toBe('scooby');
    expect((getByLabelText(/name/i) as HTMLInputElement).value).toBe('doo');
  });
  test('should call onChange input functions', () => {
    const onOwnerChange = jest.fn();
    const onNameChange = jest.fn();
    const owner = '';
    const name = '';
    const { getByTestId } = renderSearchOwnerName({
      onNameChange,
      onOwnerChange,
      owner,
      name,
    });
    const ownerInput = getByTestId('owner-input').querySelector('input');
    const nameInput = getByTestId('name-input').querySelector('input');
    fireEvent.change(ownerInput, { target: { value: 'golang' } });
    fireEvent.change(nameInput, { target: { value: 'go' } });
    expect(onOwnerChange).toHaveBeenCalledTimes(1);
    expect(onNameChange).toHaveBeenCalledTimes(1);
  });
});
