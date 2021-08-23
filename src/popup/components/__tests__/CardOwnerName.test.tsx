/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import CardOwnerName, { CardOwnerNameInterface } from '../CardOwnerName';
import { getBlankRepository } from '../../../utils/misc';

/**
 * Obtain a render of the CardOwnerName JSX element.
 * @param  {OwnerNameInterface}  props  Optional props. If no props are provided
 *                                      default props will be used.
 * @return {RenderResult}  React Testing Library render of CardOwnerName
 */
const renderCardOwnerName = (props: Partial<CardOwnerNameInterface> = {}) => {
  const defaultProps: CardOwnerNameInterface = {
    repository: getBlankRepository('scooby', 'doo'),
  };
  return render(<CardOwnerName {...defaultProps} {...props} />);
};

describe('<CardOwnerName />', () => {
  test('should display a repository owner and name', () => {
    const { getByTestId } = renderCardOwnerName();
    const repoName = getByTestId('repo-name');
    const repoOwner = getByTestId('repo-owner');
    expect(repoName).toHaveTextContent('doo');
    expect(repoOwner).toHaveTextContent('scooby');
  });
});
