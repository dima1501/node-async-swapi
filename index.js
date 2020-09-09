const fetch = require("node-fetch");
const sortAlphabetic = require("sort-alphabetic");

const request = process.argv.slice(2);

const isEmptyRequest = () => {
  if (request.length === 0) {
    return true;
  }
};

const getPersons = (results) => {
  let persons = [];

  results.map((item) => {
    if (item.results) {
      item.results.map((person) => {
        persons.push(person);
      });
    }
  });

  if (persons.length > 0) {
    showResult(persons);
  } else {
    console.log("No persons to show");
  }
};

const getMaxMinHeight = (persons) => {
  return persons.reduce(
    (result, person) => {
      result.minHeight = +person.height < +result.minHeight.height ? person : result.minHeight;
      result.maxHeight = +person.height > +result.maxHeight.height ? person : result.maxHeight;
      return result;
    },
    { minHeight: persons[0], maxHeight: persons[0] }
  );
};

const showResult = (persons) => {
  const resultsCount = persons.length;
  const personsList = sortAlphabetic(persons.map((person) => person.name));
  const maxMinHeightPersons = getMaxMinHeight(persons);

  console.log(`Total count: ${resultsCount}`);
  console.log(`All: ${personsList}`);
  console.log(`Min height: ${maxMinHeightPersons.minHeight.name}, ${maxMinHeightPersons.minHeight.height} cm`);
  console.log(`Max height: ${maxMinHeightPersons.maxHeight.name}, ${maxMinHeightPersons.maxHeight.height} cm`);
};

async function main() {
  if (isEmptyRequest()) {
    throw new Error("No arguments found");
  }

  const results = request.map(async (requestItem) => {
    try {
      const response = await fetch(`https://swapi.dev/api/people/?search=${requestItem}`);
      const responseJSON = await response.json();

      if (response.status == 404) {
        console.error(`Response status: ${response.status}`);
        console.log(`No results found for '${requestItem}'`);
      }

      if (responseJSON.count == 0) {
        console.log(`No results found for '${requestItem}'`);
      }

      return responseJSON;
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  return Promise.all(results).then((results) => getPersons(results));
}

main()
  .then(() => {
    console.log("finished");
  })
  .catch((err) => {
    console.error(err);
  });
