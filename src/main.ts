import Router from './router'
import "../node_modules/picnic/picnic.min.css";
import BrickBreaker from './view/BrickBreaker';
import Snake from './view/Snake';
import MazeGame from './view/Maze';

new Router(document.querySelector<HTMLDivElement>('#app') as HTMLDivElement, [{
  path: '/snake',
  component: Snake
}, {
  path: '/brick-breaker',
  component: BrickBreaker
}, {
  
  path: '/maze',
  component: MazeGame
  
}]);



