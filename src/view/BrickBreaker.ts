import { MyComponent } from '../MyComponent';


class PhysicsEngine {
  static applyCollision(ball: Ball, paddle: Paddle, bricks: Brick[][]) {
    // 碰撞检测
    if (ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width && ball.y + ball.dy > paddle.y) {
      ball.dy = -ball.dy;
      const collidePoint = ball.x - (paddle.x + paddle.width / 2);
      ball.dx = collidePoint * 0.3; // 更改球的水平速度以模拟不同的反弹角度
    }

    for (let c = 0; c < bricks.length; c++) {
      for (let r = 0; r < bricks[c].length; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
          }
        }
      }
    }
  }

  static applyMovement(ball: Ball, paddle: Paddle, canvas: HTMLCanvasElement, brickBreaker: BrickBreaker) {
    // 更新球的位置
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 碰撞检测：球与画布边界的碰撞
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
      } else {
        clearInterval(brickBreaker.interval)
      }
    }
  }
}


class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;

  constructor(x: number, y: number, dx: number, dy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }
}

class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number;

  constructor(x: number, y: number, width: number, height: number, status: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.status = status;
  }
}

// interface Brick {
//     x: number;
//     y: number;
//     status: number;
//   }
  
  class BrickBreaker extends MyComponent {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    ballRadius: number = 10;
    ball: Ball;
    x: number;
    y: number;
    dx: number = 2;
    dy: number = -2;
    paddleHeight: number = 10;
    paddleWidth: number = 75;
    paddleX: number;
    paddle: Paddle;
    rightPressed: boolean = false;
    leftPressed: boolean = false;
    brickRowCount: number = 3;
    brickColumnCount: number = 5;
    brickWidth: number = 75;
    brickHeight: number = 20;
    brickPadding: number = 10;
    brickOffsetTop: number = 30;
    brickOffsetLeft: number = 30;
    bricks: Brick[][] = [];
  
    constructor(dom: HTMLElement) {
        super(dom)
        
        // 获取Canvas元素
        this.canvas = document.createElement('canvas');
        this.dom.appendChild(this.canvas);

        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.border = '1px solid red'

        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D ;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 30;
        this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    
        document.addEventListener('keydown', this.keyDownHandler.bind(this));
        document.addEventListener('keyup', this.keyUpHandler.bind(this));

        this.ball = new Ball(this.x, this.y, 2, -2, this.ballRadius)
        
        this.paddle = new Paddle(this.paddleX, this.canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight)
    
        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
            this.bricks[c][r] = new Brick(0, 0, this.brickWidth, this.brickHeight, 1);
            // this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }
  
    keyDownHandler(e: KeyboardEvent) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        this.rightPressed = true;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        this.leftPressed = true;
      }
    }
  
    keyUpHandler(e: KeyboardEvent) {
      if (e.key === 'Right' || e.key === 'ArrowRight') {
        this.rightPressed = false;
      } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        this.leftPressed = false;
      }
    }
  
    collisionDetection() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const brick = this.bricks[c][r];
          if (brick.status === 1) {
            if (this.x > brick.x && this.x < brick.x + this.brickWidth && this.y > brick.y && this.y < brick.y + this.brickHeight) {
              this.dy = -this.dy;
              brick.status = 0;
            }
          }
        }
      }
    }
  
    drawBall() {
      this.ctx.beginPath();
      this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = 'blue';
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    drawPaddle() {
      this.ctx.beginPath();

      this.ctx.rect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
      this.ctx.fillStyle = 'black';
      this.ctx.fill();
      this.ctx.closePath();
    }
  
    drawBricks() {
      for (let c = 0; c < this.brickColumnCount; c++) {
        for (let r = 0; r < this.brickRowCount; r++) {
          const brick = this.bricks[c][r];
          if (brick.status === 1) {
            const brickX = c * (brick.width + this.brickPadding) + this.brickOffsetLeft;
            const brickY = r * (brick.height + this.brickPadding) + this.brickOffsetTop;
            brick.x = brickX;
            brick.y = brickY;
            this.ctx.beginPath();
            this.ctx.rect(brickX, brickY, brick.width, brick.height);
            this.ctx.fillStyle = 'red';
            this.ctx.fill();
            this.ctx.closePath();
          }
        }
      }
    }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBricks();
      this.drawBall();
      this.drawPaddle();
      this.collisionDetection();
  
      PhysicsEngine.applyMovement(this.ball, this.paddle, this.canvas, this);
      PhysicsEngine.applyCollision(this.ball, this.paddle, this.bricks);

      // if (this.x + this.dx > this.canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius) {
      //   this.dx = -this.dx;
      // }
      // if (this.y + this.dy < this.ballRadius) {
      //   this.dy = -this.dy;
      // } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
      //   if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
      //     this.dy = -this.dy;
      //   } else {
      //     // alert('Game Over');
      //     // document.location.reload();
      //     clearInterval(this.interval);
      //   }
      // }
  
      if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
        this.paddle.x += 7;
      } else if (this.leftPressed && this.paddleX > 0) {
        this.paddle.x -= 7;
      }
  
      // this.x += this.dx;
      // this.y += this.dy;
    }
  
    interval?: number;
    render() {
      this.interval = setInterval(() => {
        this.draw();
      }, 10);
    }

    destroy(): void {
        if (this.interval) clearInterval(this.interval)
    }
  }
  
  export default BrickBreaker;

//   const game = new BrickBreaker('gameCanvas');
//   game.startGame();
  