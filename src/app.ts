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
  { cells: [0, 1, 2], line: [50, 25, 250, 25] },
  { cells: [3, 4, 5], line: [50, 75, 250, 75] },
  { cells: [6, 7, 8], line: [50, 125, 250, 125] },
  { cells: [0, 3, 6], line: [50, 25, 50, 125] },
  { cells: [1, 4, 7], line: [150, 25, 150, 125] },
  { cells: [2, 5, 8], line: [250, 25, 250, 125] },
  { cells: [0, 4, 8], line: [50, 25, 250, 125] },
  { cells: [2, 4, 6], line: [250, 25, 50, 125] },
];

window.onload = () => {
  console.log("gameBoard loaded!");
  const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const winnerDiv = document.getElementById("winner");

  let gameWon: OCCUPIED | undefined = undefined;

  
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

      //draw the winning line
      ctx.beginPath(); // Start a new path
      ctx.moveTo(won.line[0], won.line[1]);
      ctx.lineTo(won.line[2], won.line[3]);
      ctx.stroke(); // Render the path

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
