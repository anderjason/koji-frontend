import { Test } from "@anderjason/tests";
import { wordsAndWhitespaceGivenString } from "./";

Test.define("wordsAndWhitespaceGivenString returns the expected result", () => {
  const input = "abc def\n ghi   jkl\nmno";

  const actual = wordsAndWhitespaceGivenString(input);

  const expected = [
    { word: 'abc', trailingWhitespace: ' ' },
    { word: 'def', trailingWhitespace: '\n ' },
    { word: 'ghi', trailingWhitespace: '   ' },
    { word: 'jkl', trailingWhitespace: '\n' },
    { word: 'mno', trailingWhitespace: '' }
  ];

  Test.assertIsDeepEqual(actual, expected);
});

Test.define("wordsAndWhitespaceGivenString handles empty input", () => {
  Test.assertIsDeepEqual(wordsAndWhitespaceGivenString(""), []);
  Test.assertIsDeepEqual(wordsAndWhitespaceGivenString("  "), []);
  Test.assertIsDeepEqual(wordsAndWhitespaceGivenString(null), []);
  Test.assertIsDeepEqual(wordsAndWhitespaceGivenString(undefined), []);
});

Test.define("wordsAndWhitespaceGivenString handles one word", () => {
  const actual = wordsAndWhitespaceGivenString("word");

  const expected = [
    { word: 'word', trailingWhitespace: '' }
  ];

  Test.assertIsDeepEqual(actual, expected);
});