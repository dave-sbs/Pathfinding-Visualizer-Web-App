/**
 * Name: Dave Boku
 * Project: Pathfinding Visualizer Project
 * File: PathfindingVisualizer.jsx
 * Date: June, 2023
 */

import React, {Component} from 'react';
import Node from './Node/Node';
import Navbar from '../Navbar/Navbar.jsx';
import './PathfindingVisualizer.css';

//Pathfinder Algorithms
import { dijkstra, getNodesInShortestPathOrderDijkstra } from '../../algorithms/search/dijkstra';
import { depthFirstSearch, getNodesInShortestPathOrderDFS } from '../../algorithms/search/depthFirstSearch';
import { breadthFirstSearch, getNodesInShortestPathOrderBFS } from '../../algorithms/search/breadthFirstSearch';
import { aStar, getNodesInShortestPathOrderAStar } from '../../algorithms/search/aStar';

//Maze Algorithms
import { horizontalMaze } from '../../algorithms/maze/horizontalMaze.js';
import { verticalMaze } from '../../algorithms/maze/verticalMaze.js';
import { recursiveDivisionMaze } from '../../algorithms/maze/recursiveDivisionMaze.js';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

let PREV_START_ROW = 10;
let PREV_START_COL = 15;
let PREV_FINISH_ROW = 10;
let PREV_FINISH_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      isMazeGenerating: false,
      isAlgoGenerating: false,
      isDragging: false,
      isVisualized: false,
      movingStartNode: false,
      speed: 10,
      speedState: "Medium",
      mazeSpeed: 8,
      selectedAlgorithm: "Algorithms",
    };
  }

  updateSpeed = (speedChoice, descriptor) => {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) return;
    this.setState ({ speed: speedChoice, speedState: descriptor });
  }
  
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  // Handle different Mouse Actions
  handleMouseDown(row, col) {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) return;
    // Check if the mouse down event occurs on the start node or finish node
    if (row === START_NODE_ROW || col === START_NODE_COL) {
      this.setState ({isDragging: true, movingStartNode: true});
    } else if (row === FINISH_NODE_ROW || col === FINISH_NODE_COL) {
      this.setState ({isDragging: true, movingStartNode: false});
    } else {
      if (row === START_NODE_ROW && col === START_NODE_COL) return;
      if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) return;
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }
  
  handleMouseOver(row, col) {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) return;
    const { grid } = this.state;
    if (this.state.isDragging && this.state.movingStartNode) {
      const newStart = getNewGridWithMovedStart(this.state.grid, row, col);
      if (grid[row][col].isWall) {
        newStart[row][col].isWall = false;
      }
      this.setState({ grid: newStart, mouseIsPressed: true });
    } else if (this.state.isDragging && !this.state.movingStartNode) {
      const newFinish = getNewGridWithMovedFinish(this.state.grid, row, col);
      if (grid[row][col].isWall) {
        newFinish[row][col].isWall = false;
      }
      this.setState({ grid: newFinish, mouseIsPressed: true });
    }
  }
  
  handleMouseEnter(row, col) {
    if (this.state.isAlgoGenerating || this.state.isDragging || !this.state.mouseIsPressed) return;
    // Check if the mouse down event occurs on the start node or finish node
    if (row === START_NODE_ROW && col === START_NODE_COL) return;
    if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }
  
  handleMouseUp() {
    this.setState({ isDragging: false, mouseIsPressed: false });
    // If start or finish nodes are moved after a visualization was performed, re-do visualization from new positions
    if (this.state.isVisualized) {
      this.visualizeSelectedAlgorithm(this.state.selectedAlgorithm) // will be changed to this.visualize(option)
    }
  }

  //Handles calling the appropriate algorithm to visualize
  visualizeSelectedAlgorithm(option) {
    switch (option) {
    case "Dijkstra's Algorithm":
      this.visualizeDijkstra();
      break;
    case "Breadth First Search":
      this.visualizeBFS();
      break;
    case "A Star Search":
      this.visualizeAStar();
      break;
    case "Depth First Search":
      this.visualizeDFS();
      break;
    default: 
      return;
    }
  }

  //Handle visualizing Dijkstra's Algorithm
  visualizeDijkstra() {
    if (this.state.isAlgoGenerating) return;
    //Using the clear path just so that it could re-run if I reposition the start and end nodes
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(startNode, finishNode);
    this.setState({ isVisualized : true });
    this.animateSelectedAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  //Handle visualizing DFS
  visualizeDFS() {
    if (this.state.isAlgoGenerating) return;
    //Using the clear path just so that it could re-run if I reposition the start and end nodes
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = depthFirstSearch(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(finishNode);
    this.setState({ isVisualized : true });
    this.animateSelectedAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

    //Handle visualizing BFS
    visualizeBFS() {
      if (this.state.isAlgoGenerating) return;
      //Using the clear path just so that it could re-run if I reposition the start and end nodes
      this.clearPath();
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderBFS(finishNode);
      this.setState({ isVisualized : true });
      this.animateSelectedAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }


    visualizeAStar() {
      if (this.state.isAlgoGenerating) return;
      //Using the clear path just so that it could re-run if I reposition the start and end nodes
      this.clearPath();
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = aStar(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrderAStar(finishNode);
      this.setState({ isVisualized : true });
      this.animateSelectedAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }


  animateSelectedAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    this.setState({ isAlgoGenerating: true });
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
          return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-visited';
        if (node.isStart) {
          this.restorePivotnodes(true, false);
        }
        else if (node.isFinish) {
          this.restorePivotnodes(false, true);
        }
      }, this.state.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }
      }, 2.2 * 10 * i); // Adjusted delay here
    }
    this.setState({ isAlgoGenerating: false });
  }

  generateHorizontalMaze() {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) {
      return;
    }
    this.setState({ isMazeGenerating: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = horizontalMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    });
  }

  generateVerticalMaze() {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) {
      return;
    }
    this.setState({ isMazeGenerating: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = verticalMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    });
  }

  generateRecursiveDivisionMaze() {
    if (this.state.isAlgoGenerating || this.state.isMazeGenerating) {
      return;
    }
    this.setState({ isMazeGenerating: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = recursiveDivisionMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    });
  }

  animateMaze(walls) {
    this.clearWalls();
    this.clearPath();
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          this.clearWalls();
          this.clearPath();
          let newGrid = getNewGridWithMaze(this.state.grid, walls);
          this.setState({ grid: newGrid, isMazeGenerating: false });
        }, i * this.state.mazeSpeed); //Adjust delay here.
        return;
      }
      let wall = walls[i];
      let node = this.state.grid[wall[0]][wall[1]];
      setTimeout(() => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-wall';
      }, i * this.state.mazeSpeed);
    }
  };

  clearPath() {
    // Check if the animation is running, if so, return without handling the event
    if (this.state.isAlgoGenerating) return;

    //Clears the animation for the search algorithm while maintaining the position of the start and end nodes.
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        if (!node.isStart && !node.isFinish && !node.isWall) {
          const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
          nodeElement.className = 'node';
          nodeElement.classList.remove('node-visited');
          grid[row][col].distance = Infinity;
          grid[row][col].previousNode = null;
        } else if (!node.isStart && !node.isFinish && node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-wall';
          grid[row][col].distance = Infinity;
          grid[row][col].previousNode = null;
        }
        else if (node.isStart) {
          this.restorePivotnodes(true, false);
        }
        else if (node.isFinish) {
          this.restorePivotnodes(false, true);
        }
      }
    }
    this.setState({ isVisualized : false, grid });
  }
  
  clearBoard() {
      // Check if the animation is running, if so, return without handling the event
      if (this.state.isAlgoGenerating) return;
    
      const { grid } = this.state;
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
          const node = grid[row][col];
          node.isVisited = false;
          if (!node.isStart && !node.isFinish) {
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            nodeElement.className = 'node';
            nodeElement.classList.remove('node-visited');
          }
          if (!node.isStart && !node.isFinish && node.isWall) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
            grid[row][col].isWall = false;
          }
          grid[row][col].distance = Infinity;
          grid[row][col].previousNode = null;
        }
      }
      this.restorePivotnodes(true, true);
      this.setState({ isVisualized: false, grid });
  }

  clearWalls(){
    // Check if the animation is running, if so, return without handling the event
    if (this.state.isAlgoGenerating) return;

    //Clears the board of all walls while maintaining the position of the start and end nodes.
    const { grid } = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {

        const node = grid[row][col];
        node.isVisited = false;
        if (!node.isStart && !node.isFinish && !node.isWall) {
          const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
          nodeElement.className = 'node';
          nodeElement.classList.remove('node-visited');
          grid[row][col].distance = Infinity;
          grid[row][col].previousNode = null;
        } else if (!node.isStart && !node.isFinish && node.isWall) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node';
          grid[row][col].isWall = false;
          grid[row][col].distance = Infinity;
          grid[row][col].previousNode = null;
        }
        else if (node.isStart) {
          this.restorePivotnodes(true, false);
        }
        else if (node.isFinish) {
          this.restorePivotnodes(false, true);
        }
      }
    }
    this.setState({ isVisualized : false, grid });
  }

  restorePivotnodes(isStart, isFinish) {
    //removing visited visual animation from start and finish nodes
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    if(isStart){
      const nodeElement = document.getElementById(`node-${startNode.row}-${startNode.col}`);
      nodeElement.className = 'node node-start';
      nodeElement.classList.remove('node-visited');
    }
    if(isFinish){
      const nodeElement = document.getElementById(`node-${finishNode.row}-${finishNode.col}`);
      nodeElement.className = 'node node-finish';
      nodeElement.classList.remove('node-visited');
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    return (
      <>
      <Navbar>
        <li className='PathfindingVisualizer__navbar-item-dropdown'>
          <button class="dropbtn">{this.state.selectedAlgorithm}</button>
            <div class="dropdown-content">
              <button onClick={() => this.setState ({ selectedAlgorithm: "Dijkstra's Algorithm" })}>Dijkstra's Algorithm</button>
              <button onClick={() => this.setState ({ selectedAlgorithm: "Depth First Search" })}>Depth First Search</button>
              <button onClick={() => this.setState ({ selectedAlgorithm: "Breadth First Search" })}>Breadth First Search</button>
              <button onClick={() => this.setState ({ selectedAlgorithm: "A Star Search" })}>A Star Search</button>
            </div>
        </li>
        <li className='PathfindingVisualizer__navbar-item-dropdown'>
            <button id="Generate Maze" class="dropbtn">Generate Maze</button>
            <div class="dropdown-content">
              <button onClick={() => this.generateHorizontalMaze()}>Generate Horizontal Maze</button>
              <button onClick={() => this.generateVerticalMaze()}>Generate Vertical Maze</button>
              <button onClick={() => this.generateRecursiveDivisionMaze()}>Generate Recursive Division Maze</button>
            </div>
        </li>
        <li>
          <button class="choicebtn" onClick={() => this.visualizeSelectedAlgorithm(this.state.selectedAlgorithm)}>Visualize</button>
        </li>
        <li className='PathfindingVisualizer__navbar-item-dropdown'>
          <button class="dropbtn">Clear</button>
            <div class="dropdown-content">
            {/* <button onClick={() => this.clearBoard()}>Clear Board</button> */}
              <button onClick={() => this.clearPath()}>Clear Path</button>
              <button onClick={() => this.clearWalls()}>Clear Walls</button>
            </div>
        </li>
        <li className='PathfindingVisualizer__navbar-item-dropdown'>
          <button class="dropbtn">Speed: {this.state.speedState}</button>
            <div class="dropdown-content">
            <button onClick={() => this.updateSpeed(5, "Fast")}>Fast</button>
            <button onClick={() => this.updateSpeed(10, "Medium")}>Medium</button>
            <button onClick={() => this.updateSpeed(20, "Slow")}>Slow</button>
            </div>
    </li>
        </Navbar>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseOver={(row, col) => this.handleMouseOver(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === 10 && col === 15,
    isFinish: row === 10 && col === 35,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithMovedStart = (grid, row, col) => {
  const newStart = grid.slice();
  const node = newStart[row][col];
  const pNode = newStart[PREV_START_ROW][PREV_START_COL];

  //Let the Start Node identifying row and col update
  START_NODE_COL = col;
  START_NODE_ROW = row;

  //Create a new node with isStart true
  const newNode = {
    ...node,
    isStart: true,
  };

  //Create a node that basically switches the previous starting node from a Start to a regular node
  const prevNode = {
      ...pNode,
      isStart: false,
  };

  //Make the changes to the grid
  newStart[row][col] = newNode;
  newStart[PREV_START_ROW][PREV_START_COL] = prevNode;
  
  //Now update the prev versions to have the current row and col data before the next mouse drag event
  PREV_START_COL = col;
  PREV_START_ROW = row;

  return newStart;
}

const getNewGridWithMovedFinish = (grid, row, col) => {
  const newFinish = grid.slice();
  const node = newFinish[row][col];
  const pNode = newFinish[PREV_FINISH_ROW][PREV_FINISH_COL];

  //Let the Finish Node identifying row and col update
  FINISH_NODE_COL = col;
  FINISH_NODE_ROW = row;

  //Create a new node with isFinish true
  const newNode = {
    ...node,
    isFinish: true,
  };
  
  //Create a node that basically switches the previous finish node from a Finish to a regular node
  const prevNode = {
      ...pNode,
      isFinish: false,
  };

  //Make the changes to the grid
  newFinish[row][col] = newNode;
  newFinish[PREV_FINISH_ROW][PREV_FINISH_COL] = prevNode;
  
  //Now update the prev versions to have the current row and col data before the next mouse drag event
  PREV_FINISH_COL = col;
  PREV_FINISH_ROW = row;

  return newFinish;
}

const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    // if (row === START_NODE_ROW && col === START_NODE_COL) return;
    // if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) return;
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
}




