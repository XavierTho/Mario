import GameEnv from './GameEnv.js';
import Character from './Character.js';
import deathController from './Death.js';

export class Player extends Character{
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, playerData){
        super(canvas, 
            image, 
            speedRatio,
            playerData.width, 
            playerData.height, 
        );
        // Player Data is required for Animations
        this.playerData = playerData;

        // Player control data
        this.pressedKeys = {};
        this.movement = {left: true, right: true, down: true};
        this.isIdle = true;
        this.stashKey = "d"; // initial key

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        GameEnv.player = this;
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]
        // direction setup
        if (key === "a") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (key === "d") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }i
    
    // check for matching animation
    isAnimation(key) {
        var result = false;
        if (key in this.pressedKeys) {
            result = !this.isIdle;
        }
        
        return result;
    }

    // check for gravity based animation
    isGravityAnimation(key) {
        var result = false;
    
        // verify key is in active animations
        if (key in this.pressedKeys) {
            result = (!this.isIdle && (this.topOfPlatform ||this.bottom <= this.y));
        }

        // scene for on top of tube animation
        if (!this.movement.down) {
            this.gravityEnabled = false;
            // Pause for two seconds
            setTimeout(() => {   // animation in tube
                // This code will be executed after the two-second delay
                this.movement.down = true;
                this.gravityEnabled = true;
                setTimeout(() => { // move to end of game detection
                    this.x = GameEnv.innerWidth + 1;
                }, 1000);
            }, 2000);
        }
    
        // make sure jump has ssome velocity
        if (result) {
            // Adjust horizontal position during the jump
            const horizontalJumpFactor = 0.1; // Adjust this factor as needed
            this.x += this.speed * horizontalJumpFactor;  
        }
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y) {
            this.setAnimation(this.stashKey);
        }
    
        return result;
    }
    

    // Player updates
    update() {
        if (this.isAnimation("s")) {
            this.speed += 2;
            this.performUniqueAction();
        }
        if (this.isAnimation("a")) {
            if (this.movement.left) this.x -= this.speed;  // Move to left
        }
        if (this.isAnimation("d")) {
            if (this.movement.right) this.x += this.speed;  // Move to right
        }
        if (this.isGravityAnimation("w")) {
            if (this.movement.down) this.y -= (this.bottom * .33);  // jump 33% higher than bottom
        } 
        if (this.isAnimation("s")) {
            this.speed = (this.speed / 2)
        }

        //Prevents Player from leaving screen
        if (this.x <= 0) {
            this.x = 0;
        }

        // Perform super update actions
        super.update();
    }

    // Player action on tube collisions
    collisionAction() {
        // Enemy collision
        if (this.collisionData.touchPoints.other.id === "enemy") {
            // Collision with the left side of the Enemy
            if (this.collisionData.touchPoints.other.left) {
                deathController.setDeath(1);
                // GameControl.transitionToLevel(GameEnv.levels[currentIndex + 1]);
            }
            // Collision with the right side of the Enemy
            if (this.collisionData.touchPoints.other.right) {
                deathController.setDeath(1);
            }
            // Collision with the top of the Enemy
            if (this.collisionData.touchPoints.other.ontop) {
                console.log("Bye Goomba");
                this.y -= (this.bottom * .33);
            }
        }
        if (this.collisionData.touchPoints.other.id === "platform") {
            // Collision with the left side of the Platform
            console.log("id")
            if (this.collisionData.touchPoints.other.left && (this.topOfPlatform === true)) {
                this.movement.right = false;
            }
            // Collision with the right side of the platform
            if (this.collisionData.touchPoints.other.right && (this.topOfPlatform === true)) {
                this.movement.left = false;
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.this.ontop) {
                this.gravityEnabled = false;
            }
            if (this.collisionData.touchPoints.this.bottom) {
                this.gravityEnabled = false;
            }
            if (this.collisionData.touchPoints.this.top) {
                this.gravityEnabled = false;
                this.topOfPlatform = true; 
            }
        } else {
            this.topOfPlatform = false;
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
            this.gravityEnabled = true;
        }
        if (this.collisionData.touchPoints.other.id === "tube") {
            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
                console.log("tube touch left");
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
                console.log("tube touch right");
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.other.ontop) {
                this.movement.down = false;
                this.x = this.collisionData.touchPoints.other.x;
                console.log("tube touch top");
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
        }

        //Coin collision
        if (this.collisionData.touchPoints.other.id === "coin") {
            this.performMarioSpecial();
        }
    }
    // Event listener key down
    handleKeyDown(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.isIdle = false;
            }

            //Move backgrounds when player moves
            if (key ==="a") {
                GameEnv.cloudSpeed = -0.2;
                GameEnv.backgroundSpeed = -0.4;
            }
            if (key === "d") {
                GameEnv.cloudSpeed = 0.2;
                GameEnv.backgroundSpeed = 0.4;
            }
        }
    }

    // Event listener key up
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }

            //Stop movement of backgrounds when idle
            if (key === "a") {
                GameEnv.backgroundSpeed = 0;
                GameEnv.cloudSpeed = 0;
            }
            if (key === "d") {
                GameEnv.cloudSpeed = 0;
                GameEnv.backgroundSpeed = 0;
            }
            
            this.setAnimation(key);  
            // player idle
            this.isIdle = true;     
        }
    }

    // Override destroy() method from GameObject to remove event listeners
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }

    performUniqueAction() {
        // Apply zoom-in effect to the canvas
        this.canvas.style.transition = "transform 2s";
        this.canvas.style.transform = "scale(1.25)";

        // Set a timeout to revert the zoom after a certain duration
        setTimeout(() => {
            this.canvas.style.transform = "scale(1)";
            this.canvas.style.transition = "";
        }, 20000);
    }

    performMarioSpecial() {
        let luck = Math.random();
        console.log(luck);
        luck > 0.75 ? this.x = GameEnv.innerWidth * 1.06 : this.x = GameEnv.innerWidth * 0;
    }
}


export default Player;