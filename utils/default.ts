export const firstLetterUpperCase = (str: string): string => {
    const firstLetter = str.substring(0, 1).toUpperCase();
    const remainingLetters = str.substring(1, str.length);
    return `${firstLetter}${remainingLetters}`;
};
