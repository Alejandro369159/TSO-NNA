import { readFile } from "fs";
import { MatrixNode, Node } from "./types/Node";

// Global state
let trip: string[] = [];
let totalCost = 0;

function resetGlobalState() {
  trip = [];
  totalCost = 0;
}

// Refactored functions
function getTxtRawData(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function parseDataFromTxt(data: string): Node[] {
  return data
    .split("\n")
    .map((row: string) => {
      const [id, x, y] = row.split(" ");
      return { id: id, x: parseInt(x), y: parseInt(y) };
    })
    .filter((node) => node.x && node.y && node.id);
}

function createDistancesMatrix(nodes: Node[]) {
  return nodes.map((fromNode) => {
    return {
      ...fromNode,
      relations: nodes
        .map((toNode) => ({
          toId: toNode.id,
          distance: Math.hypot(fromNode.x - toNode.x, fromNode.y - toNode.y),
        }))
        .filter((relation) => relation.toId !== fromNode.id),
    };
  });
}

function insertFirstNodeRelation(
  matrix: MatrixNode[],
  testNumber: "firstTest" | "secondTest"
) {
  let firstPath = { from: matrix[0].id, to: matrix[0].relations[0].toId };
  let leastDistance = matrix[0].relations[0].distance;
  let selectedNode = matrix[0];
  let closestRelation = matrix[0].relations[0];

  for (let node of matrix) {
    for (let relation of node.relations) {
      if (relation.distance < leastDistance) {
        leastDistance = relation.distance;
        closestRelation = relation;
        selectedNode = node;
      }
    }
  }

  totalCost += closestRelation.distance;
  firstPath =
    testNumber === "firstTest"
      ? { from: selectedNode.id, to: closestRelation.toId }
      : { from: closestRelation.toId, to: selectedNode.id };

  trip.push(...[firstPath.from, firstPath.to]);
}

function selectRestOfNearestneighbors(matrix: MatrixNode[]) {
  while (trip.length < matrix.length) {
    const lastNodeInTrip = matrix.find(
      (node) => node.id === trip[trip.length - 1]
    );
    if (!lastNodeInTrip) break;
    let options = lastNodeInTrip.relations.filter(
      (relation) => !trip.includes(relation.toId)
    );
    let closestneighbor = options[0];
    if (options.length === 1) {
      trip.push(closestneighbor.toId);
      totalCost += closestneighbor.distance;
      break;
    }
    if (!closestneighbor) throw new Error();
    for (let relation of options) {
      if (
        relation.distance < closestneighbor.distance &&
        !trip.includes(relation.toId)
      ) {
        closestneighbor = relation;
      }
    }
    trip.push(closestneighbor.toId);
    totalCost += closestneighbor.distance;
  }
}

// Process for calculating a trip with its cost
async function calculateTrip(testNumber: "firstTest" | "secondTest") {
  // We get the raw information from the txt
  let txtRawData: string | null = null;
  try {
    txtRawData = await getTxtRawData("../references/48nodes.txt");
  } catch (error) {
    console.error(error);
    return "Error";
  }

  // We parse/format the information
  if (!txtRawData) return "Error";
  const nodes = parseDataFromTxt(txtRawData);

  // We create the matrix of distances
  const matrix = createDistancesMatrix(nodes);

  // We grab the cheapest relation of two nodes
  insertFirstNodeRelation(matrix, testNumber);

  // We iterate over the rest of nodes to place them by nearest neightboor
  selectRestOfNearestneighbors(matrix);
  // Result
  return { trip: trip, cost: totalCost };
}

// Main function that does two trip calculations, it starts with the cheapest cost relation but
// it swaps the order of those two to see which one gives a better result
async function main() {
  const firstTestTrip = await calculateTrip("firstTest");
  resetGlobalState();
  const secondTestTrip = await calculateTrip("secondTest");
  if (firstTestTrip === "Error" || secondTestTrip === "Error") return;
  console.log(
    "===========",
    "\n First Test Trip",
    firstTestTrip,
    "==========="
  );
  console.log(
    "===========",
    "\n Second Test Trip",
    secondTestTrip,
    "==========="
  );
  const bestResult =
    firstTestTrip.cost < secondTestTrip.cost ? firstTestTrip : secondTestTrip;
  console.log(
    "=============",
    "\n FINAL RESULT: ",
    "\n Trip:",
    bestResult.trip,
    "\nCost: ",
    bestResult.cost
  );
}

main();
