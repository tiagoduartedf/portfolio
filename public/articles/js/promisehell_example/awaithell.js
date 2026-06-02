(async () => {
  const axios = require("axios");
  const gitHubApi = (user) => `https://api.github.com/users/${user}/repos`;

  console.time();
  const p1 = await axios.get(gitHubApi("aszarth"));
  const p2 = await axios.get(gitHubApi("aszarth"));
  const p3 = await axios.get(gitHubApi("aszarth"));
  // console.log(res1.status, res2.status, res3.status)
  console.timeEnd();
})();
