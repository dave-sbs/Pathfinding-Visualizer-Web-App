/**
 * Name: Dave Boku
 * Project: Pathfinding Visualizer Project
 * File: Node.jsx
 * Date: June, 2023
 */

import React, {Component} from 'react';

import './Node.css';

export default class Node extends Component {
  render() {
    const {
      row,
      col, 
      isFinish,
      isStart,
      isWall,
      isVisited,
      onMouseDown,
      onMouseEnter,
      onMouseOver,
      onMouseUp,
      width,
      height,
      numRows,
      numColumns,
    } = this.props;

    const identifier = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : isVisited ? 'node-visited' : '';

      let cellWidth = Math.floor((width - 15) / numColumns);
  let cellHeight;
  if (width > 1500) {
    cellHeight = Math.floor((height - 70) / numRows);
  } else if (width > 1000) {
    cellHeight = Math.floor((height - 70) / numRows);
  } else if (width > 500) {
    cellHeight = Math.floor((height - 60) / numRows);
  } else if (width > 0) {
    cellHeight = Math.floor((height - 50) / numRows);
  }


    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${identifier}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseOver={() => onMouseOver(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
        ></div>
    );
  }
}