const NUM_VERTICES = 4;

// O(V^2)
// matrix de adjacencia WAY
console.log("---------- matrix de adjacencia WAY ----------");

let mAdj = [];
for (let i = 0; i < NUM_VERTICES; i++) {
  mAdj[i] = [];
  for (let j = 0; j < NUM_VERTICES; j++) {
    mAdj[i][j] = null;
  }
}

mAdj[0][2] = 2;
mAdj[1][0] = 3;
mAdj[1][2] = 5;
mAdj[2][3] = 1;
mAdj[3][2] = 1;

console.log(mAdj);

// vantagem O(V+E), melhor que o O(V^2) de matrix adjacentes, mas em compensassão
// a gente não consegue acessar uma aresta, descobrir que tem um caminho em tempo constante
// precisa percorrer os vetores
// na maior parte dos problemas usar lista pq a gente não vai precisar percorrer todas
console.log("---------- lista de adjacencia WAY ----------");
let lAdj = [[], [], [], []]; // NUM_VERTICES
lAdj[0].push([2, 2]);
lAdj[1].push([0, 3]);
lAdj[1].push([2, 5]);
lAdj[2].push([3, 1]);
lAdj[3].push([2, 1]);
for (let i = 0; i < NUM_VERTICES; i++) {
  console.log(`|--- vertice: ${i} ---|`);
  console.log("ligado a: ");
  for (let j = 0; j < lAdj[i].length; j++) {
    console.log(`dest [${lAdj[i][j][0]}], distance: [${lAdj[i][j][1]}]`);
  }
}

/*
grafos lista advacentes (não usando matrix, usando map)

add node: O(1)
add edge: O(1)
remove node: O(N + E)
remove edge: O(E)
*/

// to do / to review
