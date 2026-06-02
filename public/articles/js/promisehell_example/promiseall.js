(async () => {
  const axios = require("axios");
  const gitHubApi = (user) => `https://api.github.com/users/${user}/repos`;

  console.time();
  const p1 = axios.get(gitHubApi("aszarth"));
  const p2 = axios.get(gitHubApi("aszarth"));
  const p3 = axios.get(gitHubApi("aszarth"));
  await Promise.all([p1, p2, p3]);
  console.timeEnd();
})();
