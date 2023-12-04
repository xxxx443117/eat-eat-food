import { MyComponent } from '../MyComponent';

interface SnakePart {
    x: number;
    y: number;
}


class Snake extends MyComponent {

    constructor(dom: HTMLElement) {
        super(dom)
    }

    render() {
        // 获取Canvas元素
        const canvas = document.createElement('canvas');
        this.dom.appendChild(canvas);

        canvas.width = 400;
        canvas.height = 400;

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D ;
        
        const gridSize = 20;
        let snakeX = 10;
        let snakeY = 10;
        let velocityX = 0;
        let velocityY = 1;
        
        let speed = 0.5;
        
        let foodX = 15;
        let foodY = 15;
        
        const snake: SnakePart[] = [{ x: 10, y: 10 }, { x: 10, y: 9 }];
        
        function update() {
            if (snake.length === 0) return;
            const head = snake[0];

            const newHead = { x: head.x + velocityX, y: head.y + velocityY };
        
            snake.unshift(newHead);
        
        
            if (newHead.x === foodX && newHead.y === foodY) {
            foodX = Math.floor(Math.random() * (canvas.width / gridSize));
            foodY = Math.floor(Math.random() * (canvas.height / gridSize));
            } else {
            snake.pop();
            }
        
            checkCollision();
        }
        
        function checkCollision() {
            const head = snake[0];
        
            if (head.x < 0 || head.y < 0 || head.x >= canvas.width / gridSize || head.y >= canvas.height / gridSize) {
            endGame();
            }
        
            for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame();
            }
            }
        }
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        
            ctx.fillStyle = 'green';
            for (let i = 0; i < snake.length; i++) {
        
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
            }
        
            ctx.fillStyle = 'red';
            ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);
        }
        
        const gameLoop = () => {
            update();
            draw();
            speed = snake.length * 0.01 + 0.5
            this.interval = setTimeout(() => {
                requestAnimationFrame(gameLoop);
            }, 100 / speed); // 控制游戏速度
        }
        
        const endGame = () => {
            // alert('Game Over!');
            snake.length = 0;
            snakeX = 10;
            snakeY = 10;
            velocityX = 0;
            velocityY = 0;
            foodX = 15;
            foodY = 15;
            this.destroy()
        }
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft' && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
            } else if (event.key === 'ArrowRight' && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
            } else if (event.key === 'ArrowUp' && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
            } else if (event.key === 'ArrowDown' && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
            }
        });
        
        snake.push({ x: snakeX, y: snakeY });
        gameLoop();
    }

    interval?: number;

    destroy(): void {
        if (this.interval) clearInterval(this.interval)
    }
}
 
export default Snake