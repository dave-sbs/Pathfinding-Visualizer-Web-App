/**
 * Dave Boku
 * July, 2023
 * depthFirstSearch.js
 * 
 * Purpose: Defines the basic functionality of any Pathfinding algorithm
 */


export function depthFirstSearch(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
        return false;
      }
    let cellStack = [];
    resetNodes(grid);

    function resetNodes(grid) {
        for (const row of grid) {
          for (const node of row) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
          }
        }
      }

    function search(startNode, finishNode) {
        while (numRemainingCells() != 0) {
            if (startNode == finishNode) {
                return true;
            }
            cur =  findNextCell();

        }
    }

    // Returns the next Cell to explore
    function findNextCell() {
        let cell = cellStack.pop();
        return cell;
    }

    // Adds the given Cell to whatever structure is storing the future Cells to explore
    function addCell(next) {
        cellStack.push(next);
    }

    // Returns the number of future Cells to explore
    function numRemainingCells() {
        return cellStack.length;
    }
}