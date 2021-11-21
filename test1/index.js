const assert = require("chai").assert;

const names = [
  "Michael Daniel Jäger",
  "LINUS HARALD christer WAHLGREN",
  "Pippilotta Viktualia Rullgardina Krusmynta Efraimsdotter LÅNGSTRUMP",
  "Kalle Anka",
  "Ghandi",
];

const expected = [
  { first: "Michael", middle: ["Daniel"], last: "Jäger" },
  { first: "Linus", middle: ["Harald", "Christer"], last: "Wahlgren" },
  {
    first: "Pippilotta",
    middle: ["Viktualia", "Rullgardina", "Krusmynta", "Efraimsdotter"],
    last: "Långstrump",
  },
  { first: "Kalle", middle: [], last: "Anka" },
  { first: "Ghandi", middle: [], last: null },
];

const validate = (result) => {
  try {
    assert.deepEqual(result, expected);
    console.info("Test1 Passed");
  } catch (e) {
    console.error("Failed", e);
  }
};

// implement code generating result

/**
 * @description converts given word in to title case
 * @param value
 * @returns {string|null}
 */
const toTitleCase = (value) => {
  if(value) {
    return value.charAt(0).toUpperCase().concat(value.slice(1).toLowerCase());
  }
  return null;
}

/**
 * @description parse names in to first name, middle names and last name
 * @param names
 * @returns {[]}
 */
const parseName = (names) => {
  return names.map((name) => {
    const nameArr = name.split(' ');
    const capitalizedNameArr = nameArr.map(str => toTitleCase(str));
    const [first, ...otherNames] = capitalizedNameArr;
    const last = otherNames.length > 0 ? otherNames.pop() : null;
    const middle = otherNames;
    return { first, middle, last }
  });
}

const result = parseName(names);

// At the end call validate
validate(result);
