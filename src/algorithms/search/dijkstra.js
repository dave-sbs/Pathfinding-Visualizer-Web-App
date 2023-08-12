/**
 * Name: Dave Boku
 * Project: Pathfinding Visualizer Project
 * File: dijkstra.js
 * Date: June, 2023
 */

export function dijkstra(grid, startNode, finishNode) {
    resetNodes(grid);
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (unvisitedNodes.size !== 0) {
      const closestNode = getClosestNode(unvisitedNodes);
      unvisitedNodes.delete(closestNode);
      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      if (closestNode === finishNode) return visitedNodesInOrder;
      updateUnvisitedNeighbors(closestNode, grid, unvisitedNodes);
    }
  }
  
  function resetNodes(grid) {
    for (const row of grid) {
      for (const node of row) {
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
      }
    }
  }
  
  function getClosestNode(unvisitedNodes) {
    let closestNode = null;
    let closestDistance = Infinity;
  
    for (const neighborNode of unvisitedNodes.values()) {
      if (neighborNode.distance < closestDistance) {
        closestNode = neighborNode;
        closestDistance = neighborNode.distance;
      }
    }
  
    return closestNode;
  }
  
  function updateUnvisitedNeighbors(node, grid, unvisitedNodes) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = node.distance + 1;
      neighbor.previousNode = node;
      unvisitedNodes.add(neighbor);
    }
  }
  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
  
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }
  
  function getAllNodes(grid) {
    const nodes = new Set();
    for (const row of grid) {
      for (const node of row) {
        nodes.add(node);
      }
    }
    return nodes;
  }
  
  export function getNodesInShortestPathOrderDijkstra(startNode, finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
  
    while (currentNode !== startNode && currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  
    nodesInShortestPathOrder.unshift(startNode);
    return nodesInShortestPathOrder;
  }
  

