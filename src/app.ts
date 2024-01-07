enum OCCUPIED {
  ByPlayer,
  ByServer,
}

type CellStat = {
  index: number;
  element: HTMLElement;
  occupied?: OCCUPIED;
};

const WinningLines = [
  { cells: [0, 1, 2], line: {} },
  { cells: [3, 4, 5], line: {} },
  { cells: [6, 7, 8], line: {} },
  { cells: [0, 3, 6], line: {} },
  { cells: [1, 4, 7], line: {} },
  { cells: [2, 5, 8], line: {} },
  { cells: [0, 4, 8], line: {} },
  { cells: [2, 4, 6], line: {} },
];

window.onload = () => {
  console.log("gameBoard loaded!");
  const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const winnerDiv = document.getElementById("winner");

  let gameWon: OCCUPIED | undefined = undefined;

  function getCentreOfElement(el: HTMLElement) {
    var bounds = el.getBoundingClientRect();
    return {
      x: bounds.left + bounds.width / 2.0,
      y: bounds.top + bounds.height / 2.0,
    };
  }

  function checkGameOver(by: OCCUPIED) {
    const playerChoices = cells.filter((c) => c.occupied === by);

    const won = WinningLines.find((line) => {
      const notWon = line.cells.find((cellIndex) => {
        const j = playerChoices.find((c) => c.index === cellIndex);
        return j === undefined;
      });

      return notWon === undefined;
    });

    console.log("wonBy", by);

    if (won !== undefined) {
      gameWon = by;

      winnerDiv.innerHTML =
        by === OCCUPIED.ByPlayer ? "Player won" : "Server won";

      /*
      //draw the winning line
      ctx.beginPath(); // Start a new path
      ctx.moveTo(30, 50); // Move the pen to (30, 50)
      ctx.lineTo(150, 100); // Draw a line to (150, 100)
      ctx.stroke(); // Render the path
      */

      return true;
    }

    return false;
  }

  const cells = [...Array(9)].map(
    (_, index) =>
      ({
        index,
        element: document.getElementById(`cell_${index}`),
      } as CellStat)
  );

  const g = WinningLines[0];
  console.log("plot line", JSON.stringify(g));

  const k = cells[g.cells[0]];
  const l = cells[g.cells[2]];

  //const k1 = [k.element.offsetLeft +200, k.element.offsetTop];
  //const l1 = [l.element.offsetLeft, l.element.offsetTop];

  const k1 = getCentreOfElement(k.element);
  const l1 = getCentreOfElement(l.element);

  console.log("pos", JSON.stringify({ k1, l1 }));

  //draw the winning line
  ctx.beginPath(); // Start a new path
  ctx.moveTo(k1.x, k1.y);
  ctx.lineTo(l1.x, l1.y);
  ctx.stroke(); // Render the path

  cells.forEach((cell) => {
    cell.element.onclick = (e) => {
      e.preventDefault();
      console.log("clicked", cell.index);

      if (gameWon !== undefined) {
        console.log("gameOver");
        return;
      }

      if (cell.occupied !== undefined) {
        console.log("cell_occupied", cell.index);
        return;
      }
      cell.element.innerHTML = '<div class="rXY">X</div>';
      cell.occupied = OCCUPIED.ByPlayer;
      cell.element.style.cursor = "default";

      if (checkGameOver(OCCUPIED.ByPlayer)) {
        return;
      }

      const availableCells = cells.filter((c) => c.occupied === undefined);

      const random = Math.floor(Math.random() * availableCells.length);

      console.log("gameChoice", random);

      const gameChoice = availableCells[random];

      gameChoice.element.innerHTML = '<div class="rXY">O</div>';
      gameChoice.occupied = OCCUPIED.ByServer;
      gameChoice.element.style.cursor = "default";

      checkGameOver(OCCUPIED.ByServer);
    };
  });
};
