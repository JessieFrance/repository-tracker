/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RepoStats, { RepoStatsInterface } from '../RepoStats';

/**
 * Obtain a render of the RepoStats JSX element.
 * @param  {RepoStatsInterface}  props  Optional props. If no props are provided
 *                                      default props will be used.
 * @return {RenderResult}  React Testing Library render of RepoStats
 */
const renderRepoStats = (props: Partial<RepoStatsInterface> = {}) => {
  const defaultProps: RepoStatsInterface = {
    decrementStatsIndex: jest.fn(),
    incrementStatsIndex: jest.fn(),
    statType: 'GitHubStars',
    stats: 9999,
  };
  return render(<RepoStats {...defaultProps} {...props} />);
};

describe('<RepoStats />', () => {
  test('should display stat types and stats', () => {
    const { getByTestId } = renderRepoStats();
    const statType = getByTestId('stat-type');
    const stat = getByTestId('stats');
    expect(statType).toHaveTextContent('GitHubStars');
    expect(stat).toHaveTextContent('9999');
  });
  test('should register left and right button clicks', () => {
    const leftArrow = jest.fn();
    const rightArrow = jest.fn();
    const { container } = renderRepoStats({
      decrementStatsIndex: leftArrow,
      incrementStatsIndex: rightArrow,
      statType: 'issues',
      stats: 3,
    });
    const buttons = container.querySelectorAll('button');
    buttons.forEach((button) => fireEvent.click(button));
    expect(buttons.length).toBe(2);
    expect(leftArrow).toHaveBeenCalledTimes(1);
    expect(rightArrow).toHaveBeenCalledTimes(1);
  });
});
