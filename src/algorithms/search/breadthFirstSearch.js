/**
 * Name: Dave Boku
 * Project: Pathfinding Visualizer Project
 * File: breadthFirstSearch.js
 * Date: July, 2023
 */

export function breadthFirstSearch(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
      }
    let visitedNodesInOrder = [];
    let unvisitedNodes = [];
    unvisitedNodes.push(startNode);
    while (unvisitedNodes.length !== 0) {
        let currentNode = unvisitedNodes.shift();
        if (currentNode.isWall) continue;
        if (currentNode.isVisited) continue;
        visitedNodesInOrder.push(currentNode);
        currentNode.isVisited = true;
        let unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
        for (let neighbor of unvisitedNeighbors) {
            neighbor.previousNode = currentNode;
            unvisitedNodes.push(neighbor);
        }
        if (currentNode === finishNode) {
            break;
        }
    }
    return visitedNodesInOrder;    
}
        

function getUnvisitedNeighbors(node, grid) {
  let neighbors = [];
  let { row, col } = node;
  if (col !== 0) neighbors.push(grid[row][col - 1]);
  if (row !== 0) neighbors.push(grid[row - 1][col]);
  if (col !== grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row !== grid.length - 1) neighbors.push(grid[row + 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}


export function getNodesInShortestPathOrderBFS (finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}