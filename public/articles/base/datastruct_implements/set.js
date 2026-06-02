// ideal pra listas que não podem repitir numeros
const userIdsInChat = [1, 7, 17, 17, 6];

// ======================================================================
// array way
// ======================================================================
console.log("---------- array way ----------");
function isUserOnline(id) {
  return userIdsInChat.includes(id);
}
function removeUserFromIds(id) {
  const index = userIdsInChat.findIndex((element) => element == id);
  const antes = userIdsInChat.slice(0, index);
  const dps = userIdsInChat.slice(index + 1, userIdsInChat.length);
  const arr = [...antes, ...dps];
  return arr;
}
console.log(isUserOnline(1)); // true
console.log(isUserOnline(2)); // false
const withRemove = removeUserFromIds(7);
console.log(withRemove); // [1, 17, 17, 6]

// ======================================================================
// sets way
// ======================================================================
console.log("---------- sets way ----------");
const userIdsInChatSet = new Set(userIdsInChat);

console.log(userIdsInChatSet.has(1)); // true
console.log(userIdsInChatSet.has(2)); // false

userIdsInChatSet.delete(7);
console.log(userIdsInChatSet); // Set {1, 17, 6}
// isso pq o 17 não vai repitir
