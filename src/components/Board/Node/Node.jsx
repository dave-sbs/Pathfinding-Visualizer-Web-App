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
    } = this.props;

    const identifier = isFinish ? 'node-finish' : isStart ? 'node-start' : isWall ? 'node-wall' : isVisited ? 'node-visited' : '';

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