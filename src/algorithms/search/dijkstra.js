// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
    // Reset properties for all nodes in the grid
    resetNodes(grid);
  
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
  
    while (unvisitedNodes.size !== 0) {
      const closestNode = getClosestNode(unvisitedNodes);
      unvisitedNodes.delete(closestNode);
  
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
  
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
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
  
    for (const node of unvisitedNodes.values()) {
      if (node.distance < closestDistance) {
        closestNode = node;
        closestDistance = node.distance;
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
  
  export function getNodesInShortestPathOrder(startNode, finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
  
    while (currentNode !== startNode && currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
  
    nodesInShortestPathOrder.unshift(startNode);
    return nodesInShortestPathOrder;
  }
  