// objetos não são dicionarios
// maps são feitos pra isso
// deletar em um objeto pode ser custoso de mais, num maps não

// ======================================================================
// object way
// ======================================================================
console.log("---------- object way ----------");
const usersObject = {
  theo: {
    id: 1,
    status: "online",
  },
  maple: {
    id: 2,
    status: "afk",
  },
};
usersObject["mark"] = { id: 3, status: "offline" };
console.log(usersObject);

// ======================================================================
// map way
// ======================================================================
console.log("---------- map way ----------");

const usersMap = new Map([
  ["theo", { id: 1, status: "online" }],
  ["maple", { id: 2, status: "afk" }],
]);
usersMap.set("mark", { id: 3, status: "offline" });
usersMap.set("mark", { id: 3, status: "offline" });

// interar
[...usersMap].map((user) => {
  console.log(user[0], user[1]);
});
