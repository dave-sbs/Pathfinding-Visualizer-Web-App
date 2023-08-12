/**
 * Name: Dave Boku
 * Project: Pathfinding Visualizer Project
 * File: aStar.js
 * Date: July, 2023
 */

export function aStar(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
      }
    let visitedNodesInOrder = [];
    let unvisitedNodes = [];
    startNode.distance = 0;
    unvisitedNodes.push(startNode);

    while (unvisitedNodes.length !== 0) {
        unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
        let currentNode = unvisitedNodes.shift();
        if (currentNode === finishNode) return visitedNodesInOrder;  
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        let neighbors = getNeighbors(currentNode, grid);
        comparator (neighbors, currentNode, unvisitedNodes, finishNode);
    }
    return visitedNodesInOrder;
}


function comparator (neighbors, currentNode, unvisitedNodes, finishNode) {
    for (let neighbor of neighbors) {
        let distance = currentNode.distance + 1;
        if (neighborUnvisitedCheck(neighbor, unvisitedNodes)) {
            unvisitedNodes.unshift(neighbor);
            neighbor.distance = distance;
            neighbor.totalDistance = distance + manhattenDistance(neighbor, finishNode);
            neighbor.previousNode = currentNode;
        } else if (distance < neighbor.distance) {
            neighbor.distance = distance;
            neighbor.totalDistance = distance + manhattenDistance(neighbor, finishNode);
            neighbor.previousNode = currentNode;
        }
    }
}


function getNeighbors(node, grid) {
    let neighbors = [];
    let { row, col } = node;
    if (col !== 0) neighbors.push(grid[row][col - 1]);
    if (row !== 0) neighbors.push(grid[row - 1][col]);
    if (col !== grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row !== grid.length - 1) neighbors.push(grid[row + 1][col]);
    return neighbors.filter((neighbor) => !neighbor.isWall && !neighbor.isVisited);
}
  

function neighborUnvisitedCheck (neighbor, unvisitedNodes) {
    for (let node of unvisitedNodes) {
        if (node.row === neighbor.row && node.col === neighbor.col) {
            return false;
        }
    }
    return true;
}


function manhattenDistance(node, finishNode) {
    let x = Math.abs(node.row - finishNode.row);
    let y = Math.abs(node.col - finishNode.col);
    return x + y;
}


export function getNodesInShortestPathOrderAStar (finishNode) {
    let nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
