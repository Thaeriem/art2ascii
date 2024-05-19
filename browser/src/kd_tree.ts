export type Point = number[];
type Vertex = [Vertex | undefined, Vertex | undefined, Point] | undefined;

export class KDTree {
  private root: Vertex;
  private dim: number;
  private distSqFunc: (a: Point, b: Point) => number;

  constructor(
    points: Point[],
    dim: number,
    distSqFunc?: (a: Point, b: Point) => number
  ) {
    this.dim = dim;
    this.distSqFunc =
      distSqFunc ||
      ((a, b) => a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));

    this.root = this.make(points);
  }

  private make(points: Point[], i: number = 0): Vertex {
    if (points.length > 1) {
      points.sort((a, b) => a[i] - b[i]);
      i = (i + 1) % this.dim;
      const m = points.length >> 1;
      return [
        this.make(points.slice(0, m), i),
        this.make(points.slice(m + 1), i),
        points[m],
      ];
    }
    if (points.length === 1) {
      return [undefined, undefined, points[0]];
    }
    return undefined;
  }

  private addPoint(vertex: Vertex, point: Point, i: number = 0): void {
    if (vertex !== undefined) {
      const dx = vertex[2][i] - point[i];
      for (const [j, c] of [
        [0, dx >= 0],
        [1, dx < 0],
      ] as [number, boolean][]) {
        if (c && vertex[j] === undefined) {
          vertex[j] = [undefined, undefined, point];
        } else if (c) {
          this.addPoint(vertex[j] as Vertex, point, (i + 1) % this.dim);
        }
      }
    }
  }

  private getKnn(
    vertex: Vertex,
    point: Point,
    k: number,
    returnDistSq: boolean,
    heap: [number, number, Point][],
    i: number = 0,
    tiebreaker: number = 1
  ): [number, number, Point][] | Point[] {
    if (vertex !== undefined) {
      const distSq = this.distSqFunc(point, vertex[2]);
      const dx = vertex[2][i] - point[i];
      if (heap.length < k) {
        heap.push([-distSq, tiebreaker, vertex[2]]);
        heap.sort((a, b) => b[0] - a[0]);
      } else if (distSq < -heap[0][0]) {
        heap.push([-distSq, tiebreaker, vertex[2]]);
        heap.sort((a, b) => b[0] - a[0]);
        heap.pop();
      }
      i = (i + 1) % this.dim;
      for (const b of [dx < 0, dx >= 0].slice(
        0,
        1 + +!!(dx * dx < -heap[0][0])
      )) {
        this.getKnn(
          vertex[b ? 1 : 0],
          point,
          k,
          returnDistSq,
          heap,
          i,
          (tiebreaker << 1) | (b ? 1 : 0)
        );
      }
    }
    if (tiebreaker === 1) {
      return heap
        .sort((a, b) => a[0] - b[0])
        .map((h) => (returnDistSq ? [-h[0], h[2]] : h[2]))
        .reverse() as [number, number, Point][] | Point[];
    }
    return [];
  }

  private *walk(vertex: Vertex): IterableIterator<Point> {
    if (vertex !== undefined) {
      for (const j of [0, 1]) {
        yield* this.walk(vertex[j] as Vertex);
      }
      yield vertex[2];
    }
  }

  public [Symbol.iterator](): IterableIterator<Point> {
    return this.walk(this.root);
  }

  public addPointPublic(point: Point): void {
    if (this.root === undefined) {
      this.root = [undefined, undefined, point];
    } else {
      this.addPoint(this.root, point);
    }
  }

  public getKnnPublic(
    point: Point,
    k: number,
    returnDistSq: boolean = true
  ): [number, Point][] | Point[] {
    return this.getKnn(this.root, point, k, returnDistSq, []) as
      | [number, Point][]
      | Point[];
  }

  public getNearest(
    point: Point,
    returnDistSq: boolean = true
  ): [number, Point] | Point | undefined {
    const l = this.getKnn(this.root, point, 1, returnDistSq, []);
    return (l.length ? l[0] : undefined) as Point | undefined;
  }
}
