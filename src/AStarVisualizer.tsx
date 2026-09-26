import React, { useState } from 'react';
  import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
  import * as tf from '@tensorflow/tfjs';
  import * as cocoSsd from '@tensorflow-models/coco-ssd';
  import { heuristic, aStarSearch } from './pathfinding';

  const gridWidth = 10;
  const gridHeight = 10;

  export default function AStarVisualizer() {
    const [grid, setGrid] = useState<number[][]>(Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0)));
    const [start, setStart] = useState<[number, number] | null>(null);
    const [goal, setGoal] = useState<[number, number] | null>(null);
    const [path, setPath] = useState<[number, number][] | null>(null);

    const handleGridPress = (x: number, y: number) => {
      if (!start) {
        setStart([x, y]);
      } else if (!goal) {
        setGoal([x, y]);
      }
    };

    const runAStar = () => {
      if (start && goal) {
        const result = aStarSearch(grid, start, goal);
        setPath(result);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.gridContainer}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  start && start[0] === rowIndex && start[1] === colIndex ? styles.start : {},
                  goal && goal[0] === rowIndex && goal[1] === colIndex ? styles.goal : {},
                  path?.some(([x, y]) => x === rowIndex && y === colIndex) ? styles.path : {}
                ]}
                onPress={() => handleGridPress(rowIndex, colIndex)}
              />
            ))
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={runAStar}>
          <Text style={styles.buttonText}>Run A* Search</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: gridWidth * 30, // Adjust size as needed
    },
    cell: {
      width: 30,
      height: 30,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#fff',
    },
    start: {
      backgroundColor: 'green',
    },
    goal: {
      backgroundColor: 'red',
    },
    path: {
      backgroundColor: 'blue',
    },
    button: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#007BFF',
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
