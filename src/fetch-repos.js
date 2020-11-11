const fetch = require("node-fetch");

module.exports = async function fetchRepositories(accountName, accountType) {
  const response = await fetch(
    `https://api.github.com/${accountType}s/${accountName}/repos`
  );

  if (response.status !== 200) {
    throw new Error(
      `Error while fetching Github repos for ${accountType} ${accountName}. ${response.status}, ${response.statusText}`
    );
  }

  return response.json();
};
