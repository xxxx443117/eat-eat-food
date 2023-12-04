import { MyComponent } from "../MyComponent";

class MazeGenerator {
    maze: number[][];
    mazeRows: number;
    mazeCols: number;
  
    constructor(rows: number, cols: number) {
      this.mazeRows = rows;
      this.mazeCols = cols;
      this.maze = this.initializeMaze();
    }
  
    initializeMaze() {
      const maze:number[][] = [];
      for (let row = 0; row < this.mazeRows; row++) {
        maze[row] = [];
        for (let col = 0; col < this.mazeCols; col++) {
          maze[row][col] = 1; // 初始化全部设为墙
        }
      }
      return maze;
    }
  
    generateMaze() {
      this.divide(0, 0);
      // 将迷宫边缘设为墙
      for (let i = 0; i < this.mazeCols; i++) {
        this.maze[0][i] = 1;
        this.maze[this.mazeRows - 1][i] = 1;
      }
      for (let i = 0; i < this.mazeRows; i++) {
        this.maze[i][0] = 1;
        this.maze[i][this.mazeCols - 1] = 1;
      }
      // 迷宫入口和出口
      this.maze[0][1] = 0; // 入口
      this.maze[this.mazeRows - 1][this.mazeCols - 2] = 0; // 出口
      return this.maze;
    }
  
    divide(x: number, y: number) {
      if (x >= this.mazeRows - 1 || y >= this.mazeCols - 1) {
        return;
      }
  
      const horizontal = Math.random() < 0.5;
      let x1 = x;
      let y1 = y;
      if (horizontal) {
        x1 += 1
      } else {
        y1 += 1
      }

      console.log(x1, y1)
      this.maze[x1][y1] = 0;

      this.divide(x1, y1)

  
    //   const wallX = x + (horizontal ? 0 : Math.floor(Math.random() * (width - 2))) + 1;
    //   const wallY = y + (horizontal ? Math.floor(Math.random() * (height - 2)) : 0) + 1;
    //   const passageX = wallX + (horizontal ? Math.floor(Math.random() * width) : 0);
    //   const passageY = wallY + (horizontal ? 0 : Math.floor(Math.random() * height));
  
    // //   for (let i = x; i < x + width; i++) {
    // //     for (let j = y; j < y + height; j++) {
    // //       if ((horizontal && j === wallY && (i < wallX || i > wallX + width - 1)) ||
    // //           (!horizontal && i === wallX && (j < wallY || j > wallY + height - 1))) {
    // //             console.log(j)
    // //             if (this.maze[j]) this.maze[j][i] = 1;
    // //       }
    // //     }
    // //   }
  
    //   if (horizontal) {
    //     if(this.maze[passageY])
    //     this.maze[passageY][passageX] = 0;
    //   } else {
    //     // if (this.maze[passageY])
    //     // this.maze[passageY][passageX] = 1;
    //   }
  
    //   this.divide(x, y, horizontal ? width : wallX - x, horizontal ? wallY - y : height);
    //   this.divide(horizontal ? x : wallX, horizontal ? wallY : y, horizontal ? width : x + width - wallX - 1, horizontal ? height : wallY + height - y - 1);
    }
    static printMaze(maze: number[][]) {
        for (let row = 0; row < maze.length; row++) {
          let rowString = '';
          for (let col = 0; col < maze[0].length; col++) {
            rowString += maze[row][col] + ' ';
          }
          console.log(rowString);
        }
      }
      
  }
  


class MazeGame extends MyComponent {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    gridSize: number;
    player: { x: number; y: number };
    maze: number[][];
    mazeRows: number;
    mazeCols: number;
  
    constructor(dom: HTMLElement) {
        super(dom)

        
        // 获取Canvas元素
        this.canvas = document.createElement('canvas');
        this.dom.appendChild(this.canvas);

        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.border = '1px solid red'

      this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  
      this.gridSize = 20;
      this.player = { x: 0, y: 0 }; // 初始玩家位置
      this.mazeRows = 20;
      this.mazeCols = 20;

      const mazeGenerator = new MazeGenerator(this.mazeRows, this.mazeCols);
      const mazeData = mazeGenerator.generateMaze();
      console.log(mazeData);

      MazeGenerator.printMaze(mazeData)

      this.maze = mazeData; // 迷宫地图

      document.addEventListener('keydown', (event) => {
        this.movePlayer(event.key);
        this.drawGame();


      });
    }

    render(): void {
      this.drawGame();
    }
  
    drawMaze() {
      for (let row = 0; row < this.mazeRows; row++) {
        for (let col = 0; col < this.mazeCols; col++) {
          const cell = this.maze[row][col];
          const x = col * this.gridSize;
          const y = row * this.gridSize;
  
          this.ctx.beginPath();
          if (cell === 1) {
            this.ctx.fillStyle = 'black';
          } else {
            this.ctx.fillStyle = 'white';
          }
          this.ctx.fillRect(x, y, this.gridSize, this.gridSize);
          this.ctx.closePath();
        }
      }
    }
  
    drawPlayer() {
      const x = this.player.x * this.gridSize;
      const y = this.player.y * this.gridSize;
  
      this.ctx.beginPath();
      this.ctx.fillStyle = 'red';
      this.ctx.arc(x + this.gridSize / 2, y + this.gridSize / 2, this.gridSize / 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    movePlayer(key: string) {
      let newX = this.player.x;
      let newY = this.player.y;

      console.log(key)
  
      if (key === 'ArrowUp') {
        newY -= 1;
      } else if (key === 'ArrowDown') {
        newY += 1;
      } else if (key === 'ArrowLeft') {
        newX -= 1;
      } else if (key === 'ArrowRight') {
        newX += 1;
      }
  
      if (newX >= 0 && newX < this.mazeCols && newY >= 0 && newY < this.mazeRows && this.maze[newY][newX] !== 1) {

        console.log('===')
        this.player.x = newX;
        this.player.y = newY;
      }


    }
  
    drawGame() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawMaze();
      this.drawPlayer();
    }
  }
  
  export default MazeGame;
