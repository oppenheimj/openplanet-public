function multiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }

    return m;
}

function sum(vecA, vecB) {
  return vecA.map((v, i) => v + vecB[i])
}

function mult(vec, s) {
  return vec.map(v => v * s);
}

function toRadians(deg) {
  return deg * Math.PI / 180
}

function norm(v) {
  return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}
function normalize(v) {
  var length = norm(v);
  return [v[0]/length, v[1]/length, v[2]/length];
}
function dotProduct(v1, v2) {
  return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
}
function crossProduct(v1, v2) {
  return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
}
function getAngle(v1, v2) {
  return Math.acos(dotProduct(v1, v2) / (norm(v1)*norm(v2)));
}
function matrixMultiply(matrix, v) {
  return [dotProduct(matrix[0], v), dotProduct(matrix[1], v), dotProduct(matrix[2], v)];
}

function buildRotationMatrix(v, a) {
  // p is a vector
  // v is normalized vector, axis of rotation
  // a is radians

  let ca = Math.cos(a);
  let sa = Math.sin(a);
  let t = 1-ca;
  let x = v[0];
  let y = v[1];
  let z = v[2];

  return [
      [ca + x*x*t,    x*y*t - z*sa,   x*z*t + y*sa, 0],
      [x*y*t + z*sa,  ca + y*y*t,     y*z*t - x*sa, 0],
      [z*x*t - y*sa,  z*y*t + x*sa,   ca + z*z*t, 0],
      [0,             0,              0,          1]
  ];
}

function aRotate(p, v, a) {
  // p is a vector
  // v is normalized vector, axis of rotation
  // a is radians

  let ca = Math.cos(a);
  let sa = Math.sin(a);
  let t = 1-ca;
  let x = v[0];
  let y = v[1];
  let z = v[2];

  var r = [
      [ca + x*x*t,    x*y*t - z*sa,   x*z*t + y*sa],
      [x*y*t + z*sa,  ca + y*y*t,     y*z*t - x*sa],
      [z*x*t - y*sa,  z*y*t + x*sa,   ca + z*z*t]
  ];

  return matrixMultiply(r, p);
}

const transpose = arr => {
  for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < i; j++) {
          const tmp = arr[i][j];
          arr[i][j] = arr[j][i];
          arr[j][i] = tmp;
      };
  }
}

Object.assign(module.exports, {
  multiply,
  sum,
  mult,
  toRadians,
  buildRotationMatrix,
  aRotate,
  transpose
})