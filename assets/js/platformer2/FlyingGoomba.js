import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class FlyingGoomba extends Character {
  
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, minPosition){
        super(canvas, image, data);

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;
        this.y = 1.3 * GameEnv.innerHeight;
        

        //Access in which a Goomba can travel
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
    }

    dropGoomba() {
      let playerX = GameEnv.PlayerPosition.playerX

      //Drop the Goomba on the Player when relatively close
      if (Math.abs(this.x - playerX) < 150) {
        this.y = GameEnv.PlayerPosition.playerY
      } else {
        this.y = 1.3 * GameEnv.innerHeight;
      }
    }

    update() {
        super.update();

        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition) || this.x > GameEnv.innerWidth ) {
            this.speed = -this.speed;
        }

        this.dropGoomba()

        //Make sure Goomba are flying
        // this.y = this.yPosition * GameEnv.innerHeight;

        // Every so often change direction
        if (Math.random() < 0.005) {
            this.speed = Math.random() < 0.5 ? -this.speed : this.speed;
        }

        if (Math.random() < 0.00001) {
            this.canvas.style.filter = 'brightness(1000%)';
            this.immune = 1;
        }

        // Move the enemy
        this.x -= this.speed;
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Goomba with Bottom of Player
            if (this.collisionData.touchPoints.other.bottom && this.immune === 0) {
                // console.log("Bye Bye Goomba");
                this.x = GameEnv.innerWidth + 1;
                this.destroy();
            }
        }    
    }

}

export default FlyingGoomba;