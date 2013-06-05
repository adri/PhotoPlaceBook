// DBSCAN constructs a DBSCAN cluster analyzer.
// An implementation of the DBSCAN algorithm published in Wikipedia's DBSCAN article
// as of October 19, 2010. I'm including the algorithm as published, with my notes,
// at the end of this file. I've used the same variable names in the Javascript code
// as used in the algorithm pseudo-code.
//
// Always supply an array of data points D, a distance function dist,
// an epsilon value eps, and a minimum cluster size MinPts.
// You may update these later and rerun the analysis.
//
// A DBSCAN analyzer will not run an analysis until you call its run() method,
// which optionally takes new epsilon and cluster size arguments.
function DBSCAN (D, dist, eps, MinPts) {
    this.D = D;           // array of data points
    this.dist = dist;     // distance function(i1, i2) given indices of two data points
    this.eps = eps;       // neighborhood radius
    this.MinPts = MinPts; // minimum number of points to form cluster
    this.assigned = [];   // cluster assignment 0-n for each point; -1 --> noise
                          // if an element is undefined we have not yet visited the point
    this.cluster = [];    // array of clusters, each an array of point indices
    // Note that we store cluster assignments redundantly in this.assigned and this.cluster
    // to quickly determine which points are in a cluster and which cluster a point is in.
    // Always update both arrays!
    this.run = dbscanRun;  // run the analysis, optionally with new eps, MinPts values
    this.getNeighbors = dbscanGetNeighbors;   // private
    this.expandCluster = dbscanExpandCluster; // private
}

function dbscanRun(eps, MinPts) {
    if (eps) this.eps = eps;
    if (MinPts) this.MinPts = MinPts;
    this.assigned = new Array(this.D.length);
    this.cluster = new Array();
    for (var P in this.D) {
        if (this.assigned[P] !== undefined) continue;  // already visited
        // console.log('visiting ' + P);
        var N = this.getNeighbors(P);
        // console.log('neighbors: ' + N);
        if (N.length + 1 < this.MinPts) {
            this.assigned[P] = -1; // noise
            // console.log('noise');
        }
        else {
            var C = this.cluster.length; // next cluster index
            this.cluster[C] = [];  // new cluster
            // console.log('cluster ' + C);
            this.expandCluster(P, N, C);
        }
    }
}

function dbscanGetNeighbors(P) {
    var neighbors = [];
    for (var i in this.D) {
        if (i == P) continue;
        if (this.dist(P, i) <= this.eps)
            neighbors.push(i);
    }
    return neighbors;
}

function dbscanExpandCluster(P, N, C) {
    this.cluster[C].push(P);
    this.assigned[P] = C;
    for (var PP = 0; PP < N.length; PP++) {
     // PP is P' -- note P' is indexing N, not D
        // console.log('> ' + N[PP]);
        if (this.assigned[N[PP]] === undefined) {  // P' not yet visited?
            // console.log('> visiting');
            var NP = this.getNeighbors(N[PP]);  // NP is N'
            // console.log('> neighbors: ' + NP);
            if (NP.length >= this.MinPts) {
                N = N.concat(NP.filter(function(vNew) {return this.every(function(vOld) {return vOld != vNew})}, N));
                // console.log('expanded neighborhood: ' + N);
            }
        }
        if (!(this.assigned[PP] > -1)) {  // P' not yet assigned to a cluster?
            this.cluster[C].push(PP);
            this.assigned[PP] = C;
        }
    }
}

/* DBSCAN algorithm

DBSCAN(D, eps, MinPts)
   C = 0
   for each unvisited point P in dataset D
      mark P as visited
      N = getNeighbors (P, eps)
      if sizeof(N) < MinPts
         mark P as NOISE
      else
         C = next cluster
         expandCluster(P, N, C, eps, MinPts)

expandCluster(P, N, C, eps, MinPts)
   add P to cluster C
   for each point P' in N
      if P' is not visited
         mark P' as visited
         N' = getNeighbors(P', eps)
         if sizeof(N') >= MinPts
            N = N joined with N'
      if P' is not yet member of any cluster
         add P' to cluster C

= Discussion =

== definitions for directly density-reachable, density-reachable, and density-connected ==

q is directly density-reachable from p if
  q is in p's epsilon neighborhood, and
  p is surrounded by enough points to constitute a cluster

q is density-reachable from p if
  there is a sequence p(1),...,p(n) where
    p(1) = p
    p(n) = q
    each p(i+1) is directly density-reachable from p(i)

The density-reachable condition is not commutative--q may lie on the fringe of a cluster.
Thus we say p and q are density-connected if there is a point o such that
  p and q are each density-reachable from o.


== cluster definition in terms of density-connected points ==

A cluster is a subset of the points in a database where
  1. All points in the cluster are mutually density-connected.
  2. If a point is density-connected to any point in the cluster, it is part of the cluster as well.


== algorithm in plain language ==

DBSCAN parameters
  epsilon
  minimum number of points to form a cluster

Arbitrary starting point that has not been visited.
Retrieve the point's epsilon neighborhood.
Enough points?
  start cluster
else
  label as noise
  (Later the point may be found in a sufficiently large epsilon neighborhood of another point and become part of a cluster.)
If a point is part of the cluster, its epsilon neighborhood is also part of the cluster.
  --> Visit all points in the cluster, expanding included points until the cluster is completely found.
Select a new unvisited point and begin from the top.

*/