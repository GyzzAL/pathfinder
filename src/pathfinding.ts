import * as tf from '@tensorflow/tfjs';

  export function heuristic(a: [number, number], b: [number, number]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  export function aStarSearch(grid: number[][], start: [number, number], goal: [number, number]): [number, number][] | null {
    const openSet = [];
    tf.util.createTypedArray('int32', [grid.length * grid[0].length]).fill(Infinity).forEach((_, i) => {
      openSet.push(i);
    });

    const cameFrom = new Map<number, [number, number]>();
    const costSoFar = new Map<number, number>();

    cameFrom.set(gridIndex(start), start);
    costSoFar.set(gridIndex(start), 0);

    while (openSet.length > 0) {
      let current = openSet.reduce((minNode, node) => {
        return costSoFar.get(node)! < costSoFar.get(minNode)! ? node : minNode;
      });

      if (current === gridIndex(goal)) {
        return reconstructPath(cameFrom, start, goal);
      }

      openSet.splice(openSet.indexOf(current), 1);

      const [x, y] = indexToGrid(current, grid[0].length);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const neighbor: [number, number] = [x + dx, y + dy];
        if (
          neighbor[0] >= 0 &&
          neighbor[0] < grid.length &&
          neighbor[1] >= 0 &&
          neighbor[1] < grid[0].length &&
          grid[neighbor[0]][neighbor[1]] === 0
        ) {
          const newCost = costSoFar.get(current)! + 1;
          if (!costSoFar.has(gridIndex(neighbor)) || newCost < costSoFar.get(gridIndex(neighbor))!) {
            costSoFar.set(gridIndex(neighbor), newCost);
            const priority = newCost + heuristic(goal, neighbor);
            openSet.push(gridIndex(neighbor));
            cameFrom.set(gridIndex(neighbor), current);
          }
        }
      }
    }

    return null;
  }

  function reconstructPath(cameFrom: Map<number, [number, number]>, start: [number, number], goal: [number, number]): [number, number][] {
    let current = gridIndex(goal);
    const path: [number, number][] = [];
    while (current !== gridIndex(start)) {
      path.push(indexToGrid(current, cameFrom.get(gridIndex(start))![1].length));
      current = cameFrom.get(current)!;
    }
    path.push(start);
    return path.reverse();
  }

  function gridIndex([x, y]: [number, number], width: number): number {
    return x * width + y;
  }

  function indexToGrid(index: number, width: number): [number, number] {
    return [Math.floor(index / width), index % width];
  }
