import { Repository } from '../../types';

/**
 * Generates a random base 36 string that is nChars long.
 * @param  {number} nChars Number of random digits
 * @return {string}        Random string ID that is nChars long
 */
export const generateRandomID = (nChars: number): string => {
  return Math.random()
    .toString(36)
    .substr(2, 2 + nChars - 1);
};

/**
 * Generate a new blank repository that is about to be added.
 * @param  {string} owner Repository owner
 * @param  {string} owner Repository name
 * @return {Repository}   A new Repository object
 */
export const getBlankRepository = (owner: string, name: string): Repository => {
  return {
    id: generateRandomID(5),
    owner,
    name,
    etag: '',
    mostRecentDate: null,
    justAdded: true,
  };
};
