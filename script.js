// Basic Cube Class
class Cube {
  constructor() {
    this.faces = {
      U: Array(9).fill('w'),
      D: Array(9).fill('y'),
      F: Array(9).fill('r'),
      B: Array(9).fill('o'),
      L: Array(9).fill('g'),
      R: Array(9).fill('b'),
    };
    this.history = []; // to reverse moves
  }

  // Rotate a face clockwise
  rotate(face) {
    this.history.push(face);
    this.faces[face] = this.rotateFaceCW(this.faces[face]);
    this.rotateSides(face);
  }

  // Rotate a face counter-clockwise
  rotateInverse(face) {
    this.history.push(face + "'");
    // 3 clockwise rotations = 1 counter-clockwise
    this.rotate(face);
    this.rotate(face);
    this.rotate(face);
  }

  // Rotate 3x3 face clockwise
  rotateFaceCW(faceArr) {
  if (faceArr.length !== 9) {
    console.error("Invalid face size:", faceArr);
  }
  return [
    faceArr[6], faceArr[3], faceArr[0],
    faceArr[7], faceArr[4], faceArr[1],
    faceArr[8], faceArr[5], faceArr[2],
  ];
}


  // Rotate side strips for each face rotation
 rotateSides(face) {
  if (face === 'U') {
    // U affects top rows of F, R, B, L
    const tmp = this.faces['F'].slice(0, 3);
    this.faces['F'][0] = this.faces['R'][0];
    this.faces['F'][1] = this.faces['R'][1];
    this.faces['F'][2] = this.faces['R'][2];

    this.faces['R'][0] = this.faces['B'][0];
    this.faces['R'][1] = this.faces['B'][1];
    this.faces['R'][2] = this.faces['B'][2];

    this.faces['B'][0] = this.faces['L'][0];
    this.faces['B'][1] = this.faces['L'][1];
    this.faces['B'][2] = this.faces['L'][2];

    this.faces['L'][0] = tmp[0];
    this.faces['L'][1] = tmp[1];
    this.faces['L'][2] = tmp[2];
  }

  if (face === 'F') {
    // F affects: U, R, D, L edges
    const tmp = [this.faces['U'][6], this.faces['U'][7], this.faces['U'][8]];

    this.faces['U'][6] = this.faces['L'][8];
    this.faces['U'][7] = this.faces['L'][5];
    this.faces['U'][8] = this.faces['L'][2];

    this.faces['L'][2] = this.faces['D'][0];
    this.faces['L'][5] = this.faces['D'][1];
    this.faces['L'][8] = this.faces['D'][2];

    this.faces['D'][0] = this.faces['R'][6];
    this.faces['D'][1] = this.faces['R'][3];
    this.faces['D'][2] = this.faces['R'][0];

    this.faces['R'][0] = tmp[2];
    this.faces['R'][3] = tmp[1];
    this.faces['R'][6] = tmp[0];
  }

  // If you want: do the same for D, B, L, R later
}


  // Get SVG string representation (mock)
  getCubeSvg() {
    return Object.keys(this.faces).map(f =>
      `${f}: ${this.faces[f].join('')}`
    ).join('\n');
  }

  // Display Cube
  display() {
    document.getElementById('cube').innerText = this.getCubeSvg();
  }

  // Scramble with random moves
  scramble(n = 10) {
    const faces = ['U', 'F'];
    for (let i = 0; i < n; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const inverse = Math.random() < 0.5;
      if (inverse) this.rotateInverse(face);
      else this.rotate(face);
    }
    this.display();
  }

  // Solve: just reverse history
  solve() {
    while (this.history.length > 0) {
      const move = this.history.pop();
      if (move.endsWith("'")) {
        this.rotate(move[0]);
      } else {
        this.rotateInverse(move);
      }
    }
    this.display();
  }
}

// === USAGE ===
const cube = new Cube();
cube.display();

document.getElementById('scrambleBtn').onclick = () => cube.scramble(10);
document.getElementById('solveBtn').onclick = () => cube.solve();
