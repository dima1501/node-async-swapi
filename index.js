const fetch = require("node-fetch");
const sortAlphabetic = require("sort-alphabetic");

const request = process.argv.slice(2);

if (request == 0) {
  throw new Error("No arguments found");
}

const finalCount = (arr) => {
  let persons = [];

  arr.map((item) => {
    if (item) {
      item.results.map((person) => {
        persons.push(person);
      });
    }
  });

  if (persons == 0) {
    throw new Error("No persons to show");
  }

  const resultsCount = persons.length;
  const getMinHeightPerson = persons.reduce((prev, current) => (+prev.height < +current.height ? prev : current));
  const getMaxHeightPerson = persons.reduce((prev, current) => (+prev.height > +current.height ? prev : current));
  const personsList = sortAlphabetic(persons.map((person) => person.name));

  console.log(`Total count: ${resultsCount}`);
  console.log(`All: ${personsList}`);
  console.log(`Min height: ${getMinHeightPerson.name}, ${getMinHeightPerson.height} cm`);
  console.log(`Max height: ${getMaxHeightPerson.name}, ${getMaxHeightPerson.height} cm`);
};

async function main() {
  const results = request.map(async (requestItem) => {
    try {
      const response = await fetch(`https://swapi.dev/api/people/?search=${requestItem}`);
      const responseJSON = await response.json();

      if (response.status == 404) {
        throw new Error("Not found");
      }

      if (responseJSON.count == 0) {
        console.log(`No results found for '${requestItem}'`);
      }

      return responseJSON;
    } catch (err) {
      console.error(err);
    }
  });

  Promise.all(results)
    .then((completed) => finalCount(completed))
    .catch((err) => console.error(err));
}

main()
  .then(() => {
    console.log("finished");
  })
  .catch((err) => {
    console.error(err);
  });
