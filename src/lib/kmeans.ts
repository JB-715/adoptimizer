// K-means clustering engine — backend integration point: replace with server-side ML model if needed

export interface CampaignDataPoint {
  id: string;
  name: string;
  ctr: number; // 0–1
  cr: number; // 0–1
  healthScore: number; // 0–100
  impressions: number;
  clicks: number;
  conversions: number;
}

export type ClusterLabel = 'High Performer' | 'Needs Improvement' | 'Low Performance';

export interface ClusterResult {
  campaignId: string;
  clusterId: number;
  label: ClusterLabel;
  distanceToCentroid: number;
}

export interface Centroid {
  clusterId: number;
  label: ClusterLabel;
  ctr: number;
  cr: number;
  healthScore: number;
  campaignCount: number;
}

export interface KMeansOutput {
  results: ClusterResult[];
  centroids: Centroid[];
  iterations: number;
  converged: boolean;
}

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
}

// K-means++ initialization for better centroid seeding
function kMeansPlusPlusInit(points: number[][], k: number): number[][] {
  const centroids: number[][] = [];
  // Pick first centroid randomly from a deterministic seed
  centroids.push([...points[Math.floor(points.length * 0.37)]]);

  for (let c = 1; c < k; c++) {
    const distances = points.map((p) => {
      const minDist = Math.min(...centroids.map((cent) => euclidean(p, cent)));
      return minDist * minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    // Deterministic selection: pick point with max weighted distance
    let maxWeighted = -1;
    let maxIdx = 0;
    distances.forEach((d, i) => {
      const weighted = d / totalDist;
      if (weighted > maxWeighted) {
        maxWeighted = weighted;
        maxIdx = i;
      }
    });
    centroids.push([...points[maxIdx]]);
  }
  return centroids;
}

function assignClusters(points: number[][], centroids: number[][]): number[] {
  return points.map((p) => {
    let minDist = Infinity;
    let assignment = 0;
    centroids.forEach((c, i) => {
      const d = euclidean(p, c);
      if (d < minDist) {
        minDist = d;
        assignment = i;
      }
    });
    return assignment;
  });
}

function recomputeCentroids(points: number[][], assignments: number[], k: number): number[][] {
  return Array.from({ length: k }, (_, ci) => {
    const clusterPoints = points.filter((_, i) => assignments[i] === ci);
    if (clusterPoints.length === 0) return Array(points[0].length).fill(0);
    const dim = points[0].length;
    return Array.from(
      { length: dim },
      (_, d) => clusterPoints.reduce((sum, p) => sum + p[d], 0) / clusterPoints.length
    );
  });
}

function centroidsConverged(a: number[][], b: number[][], tol = 0.0001): boolean {
  return a.every((ca, i) => euclidean(ca, b[i]) < tol);
}

function labelClusters(centroids: number[][]): ClusterLabel[] {
  // Label by average health score (index 2 = healthScore normalized)
  const indexed = centroids.map((c, i) => ({ i, score: c[2] }));
  indexed.sort((a, b) => b.score - a.score);
  const labels: ClusterLabel[] = new Array(centroids.length);
  const tierLabels: ClusterLabel[] = ['High Performer', 'Needs Improvement', 'Low Performance'];
  indexed.forEach((item, rank) => {
    labels[item.i] = tierLabels[Math.min(rank, 2)];
  });
  return labels;
}

export function runKMeans(
  campaigns: CampaignDataPoint[],
  k = 3,
  maxIterations = 100
): KMeansOutput {
  if (campaigns.length < k) {
    // Not enough data — assign all to single cluster
    return {
      results: campaigns.map((c) => ({
        campaignId: c.id,
        clusterId: 0,
        label: 'Needs Improvement',
        distanceToCentroid: 0,
      })),
      centroids: [
        {
          clusterId: 0,
          label: 'Needs Improvement',
          ctr: 0,
          cr: 0,
          healthScore: 0,
          campaignCount: campaigns.length,
        },
      ],
      iterations: 0,
      converged: true,
    };
  }

  // Normalize features: [ctr, cr, healthScore/100]
  const points = campaigns.map((c) => [c.ctr, c.cr, c.healthScore / 100]);

  let centroids = kMeansPlusPlusInit(points, k);
  let assignments = assignClusters(points, centroids);
  let iterations = 0;
  let converged = false;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;
    const newCentroids = recomputeCentroids(points, assignments, k);
    const newAssignments = assignClusters(points, newCentroids);

    if (
      centroidsConverged(centroids, newCentroids) &&
      assignments.every((a, i) => a === newAssignments[i])
    ) {
      converged = true;
      centroids = newCentroids;
      assignments = newAssignments;
      break;
    }
    centroids = newCentroids;
    assignments = newAssignments;
  }

  const clusterLabels = labelClusters(centroids);

  const results: ClusterResult[] = campaigns.map((c, i) => ({
    campaignId: c.id,
    clusterId: assignments[i],
    label: clusterLabels[assignments[i]],
    distanceToCentroid: euclidean(points[i], centroids[assignments[i]]),
  }));

  const centroidOutputs: Centroid[] = centroids.map((c, ci) => ({
    clusterId: ci,
    label: clusterLabels[ci],
    ctr: c[0],
    cr: c[1],
    healthScore: c[2] * 100,
    campaignCount: assignments.filter((a) => a === ci).length,
  }));

  return { results, centroids: centroidOutputs, iterations, converged };
}

export function computeHealthScore(
  impressions: number,
  clicks: number,
  conversions: number
): number {
  if (impressions === 0) return 0;
  const ctr = clicks / impressions;
  const cr = clicks > 0 ? conversions / clicks : 0;
  // Weighted: CTR 40%, CR 40%, volume signal 20%
  const volumeScore = Math.min(impressions / 500000, 1);
  return Math.round((ctr * 40 + cr * 40 + volumeScore * 20) * 100) / 100;
}
