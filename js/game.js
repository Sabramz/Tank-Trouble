let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    padding: "0px",
    margin: "0px",
    physics:{
        default: 'arcade',
        arcade: {
            enabled: true,

        }
    },
    scale: {
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {preload: preload, create: create, update: update}
}

let gameState = {};
let bullets = [];

const game = new Phaser.Game(config)

function preload(){
    //load images | check
    this.load.image('bg1',"assets/backgrounds/1920x1080-gray-solid-color-background.jpg");
    this.load.image('redTank', "assets/sprites/redTank.png");
    this.load.image('blueTank', "assets/sprites/blueTank.png");
    this.load.image('yellowTank', "assets/sprites/yellowTank.png");
    this.load.image('pinkTank', "assets/sprites/pinkTank.png");
    this.load.image('bullet', "assets/sprites/bullet.png");
    this.load.image('bottomFrame', "assets/sprites/bottomFrame.png");
    this.load.image('sideFrame',"assets/sprites/sideFrame.png");
    this.load.image('wideFrame', "assets/sprites/wideFrame.png");
    this.load.image('longFrame', "assets/sprites/longFrame.png");
}

function create(){
    //create keys and background | check
    gameState.keys = this.input.keyboard.addKeys('W,A,S,D,Q,I,J,K,L,SPACE,UP,DOWN,LEFT,RIGHT,CTRL');
    this.input.mouse.disableContextMenu();
    gameState.mouse = this.input.activePointer;
    this.add.image(0,0, 'bg1').setOrigin(0,0);



    //tanks | check
    gameState.tanks = this.physics.add.group();
    gameState.tanks.redTank = this.physics.add.sprite(50,50,'redTank');
    gameState.tanks.blueTank = this.physics.add.sprite(50,750,'blueTank');
    gameState.tanks.yellowTank = this.physics.add.sprite(750,50,'yellowTank');
    gameState.tanks.pinkTank = this.physics.add.sprite(750,750,'pinkTank');
    gameState.tankArray = [gameState.tanks.redTank, gameState.tanks.blueTank, gameState.tanks.yellowTank, gameState.tanks.pinkTank];
    for (let tank of gameState.tankArray){
        tank.setInteractive();
        tank.setImmovable(false);
    }

    //make outer walls | check
    gameState.walls = this.physics.add.group();
    gameState.walls.create(0,795,'bottomFrame').setOrigin(0,0);
    gameState.walls.create(0,0,'bottomFrame').setOrigin(0,0);
    gameState.walls.create(-5,0,'sideFrame').setOrigin(0,0);
    gameState.walls.create(795,0,'sideFrame').setOrigin(0,0);
    
    //make inner walls | check
    const level1 = function() {
        gameState.walls.create(250,100,'wideFrame').setOrigin(0,0);
        gameState.walls.create(250,300,'wideFrame').setOrigin(0,0);
        gameState.walls.create(250,500,'wideFrame').setOrigin(0,0);
        gameState.walls.create(250,700,'wideFrame').setOrigin(0,0);
        gameState.walls.create(450,100,'wideFrame').setOrigin(0,0);
        gameState.walls.create(450,300,'wideFrame').setOrigin(0,0);
        gameState.walls.create(450,500,'wideFrame').setOrigin(0,0);
        gameState.walls.create(450,700,'wideFrame').setOrigin(0,0);

        gameState.walls.create(125,150,'longFrame').setOrigin(0,0);
        gameState.walls.create(125,350,'longFrame').setOrigin(0,0);
        gameState.walls.create(125,550,'longFrame').setOrigin(0,0);
        gameState.walls.create(675,150,'longFrame').setOrigin(0,0);
        gameState.walls.create(675,350,'longFrame').setOrigin(0,0);
        gameState.walls.create(675,550,'longFrame').setOrigin(0,0);   
    }
    level1();

    //bullets | check
    gameState.bullets = {};
    gameState.bullets.red ={};
    gameState.bullets.blue = {};
    gameState.bullets.yellow = {};
    gameState.bullets.pink = {};
    gameState.bullets.red.bulletCount = 0;
    gameState.bullets.blue.bulletCount = 0;
    gameState.bullets.yellow.bulletCount = 0;
    gameState.bullets.pink.bulletCount = 0;
    gameState.bullets.red.cd = 0;
    gameState.bullets.blue.cd = 0;
    gameState.bullets.yellow.cd = 0;
    gameState.bullets.pink.cd = 0;
    
    //colliders | check
    for (let wall of gameState.walls.getChildren()){
        wall.body.setImmovable();
        wall.body.setBounce(1,1);
        for(let tank of gameState.tankArray){
            this.physics.add.collider(tank, wall);
        }
    }

    //temps
    //This doesnt work anymore : gameState.txt=this.add.text(400,400,`${gameState.bullets.length}`);
}

function update(){
    //pointer | check
    let pointer = this.input.activePointer;
    
    //bullet configs | check
    let allowedLength = 10;

    //movement | check
    for (let tank of gameState.tankArray){
        try{
        tank.body.setVelocity(0,0);
        tank.body.angularVelocity = 0;
        }catch{
            
        }
    }
    
    //bullet creation and control : red | check
    try{
        if (gameState.tanks.redTank.active){
            if (gameState.keys.Q.isDown && gameState.bullets.red.cd <= .1){
                if (gameState.bullets.red.bulletCount < allowedLength) {
                    const bullet = this.physics.add.sprite(gameState.tanks.redTank.x + 14 * Math.sin(gameState.tanks.redTank.rotation), gameState.tanks.redTank.y - 14 * Math.cos(gameState.tanks.redTank.rotation), 'bullet').setRotation(gameState.tanks.redTank.rotation);
                    bullet.setInteractive();
                    bullets.push([bullet,"red"]);
                    gameState.bullets.red.bulletCount += 1;
                    gameState.bullets.red.cd += 1;
                    bullet.body.setBounce(1,1);
                    bullet.body.setVelocity(Math.sin(bullet.rotation) * 150,-Math.cos(bullet.rotation) * 150);
                    bullet.counter = 0;
                    gameState.walls.getChildren().forEach((wall) => {
                        this.physics.add.collider(bullet, wall, function(bullet,wall){
                            let normalAngle = Phaser.Math.Angle.Normalize(bullet.rotation)
                            if (bullet.body.blocked.left === true || bullet.body.blocked.right === true){
                                bullet.rotation = Math.abs(6.28 - normalAngle);
                            }else if (bullet.body.blocked.up === true || bullet.body.blocked.down){
                                bullet.rotation = 3.14 - bullet.rotation;
                            }
                        });
                    });
                    if (gameState.tanks.redTank.body.blocked.up && (gameState.tanks.redTank.rotation > -1.57 && gameState.tanks.redTank.rotation < 1.57)){
                        bullet.y += 10;
                    }
                    else if(gameState.tanks.redTank.body.blocked.down   ){
                        bullet.y -= 10;
                    }
                    for (let tank of gameState.tankArray){
                        this.physics.add.collider(bullet, tank, function(){
                            tank.destroy();
                            bullet.destroy();
                            gameState.bullets.red.bulletCount -= 1;
                        });
                    }
                    setTimeout(()=>{
                        console.log(bullet);
                        console.log(bullets);
                        bullets.shift();
                        console.log(bullet);
                        console.log(bullets);
                        bullet.destroy();
                        gameState.bullets.red.bulletCount -= 1;
                    },20000);
                }
            }
        }
    }catch{}
    //blue | check
    try{
        if(gameState.tanks.blueTank.active){
            if (gameState.keys.SPACE.isDown && gameState.bullets.blue.cd <= .1){
                if (gameState.bullets.blue.bulletCount < allowedLength) {
                    const bullet = this.physics.add.sprite(gameState.tanks.blueTank.x + 14 * Math.sin(gameState.tanks.blueTank.rotation), gameState.tanks.blueTank.y - 14 * Math.cos(gameState.tanks.blueTank.rotation), 'bullet').setRotation(gameState.tanks.blueTank.rotation);
                    bullet.setInteractive();
                    bullets.push([bullet,"blue"]);
                    gameState.bullets.blue.bulletCount += 1;
                    gameState.bullets.blue.cd += 1;
                    bullet.body.setBounce(1,1);
                    bullet.body.setVelocity(Math.sin(bullet.rotation) * 150,-Math.cos(bullet.rotation) * 150);
                    bullet.counter = 0;
                    gameState.walls.getChildren().forEach((wall) => {
                        this.physics.add.collider(bullet, wall, function(bullet,wall){
                            let normalAngle = Phaser.Math.Angle.Normalize(bullet.rotation)
                            if (bullet.body.blocked.left === true || bullet.body.blocked.right === true){
                                bullet.rotation = Math.abs(6.28 - normalAngle);
                            }else if (bullet.body.blocked.up === true || bullet.body.blocked.down){
                                bullet.rotation = 3.14 - bullet.rotation;
                            }
                        });
                    });
                    if (gameState.tanks.blueTank.body.blocked.up && (gameState.tanks.blueTank.rotation > -1.57 && gameState.tanks.blueTank.rotation < 1.57)){
                        bullet.y += 10;
                    }
                    else if(gameState.tanks.blueTank.body.blocked.down   ){
                        bullet.y -= 10;
                    }
                    for (let tank of gameState.tankArray){
                        this.physics.add.collider(bullet, tank, function(){
                            tank.destroy();
                            bullet.destroy();
                            gameState.bullets.blue.bulletCount -= 1;
                        });
                    }
                    setTimeout(()=>{
                        console.log(bullet);
                        console.log(bullets);
                        bullets.shift();
                        console.log(bullet);
                        console.log(bullets);
                        bullet.destroy();
                        gameState.bullets.blue.bulletCount -= 1;
                    },20000);
                }
            }
        }
    }catch{}
    //yellow | check
    try{
        if(gameState.tanks.yellowTank.active){
            if (gameState.keys.CTRL.isDown && gameState.bullets.yellow.cd <= .1){
                if (gameState.bullets.yellow.bulletCount < allowedLength) {
                    const bullet = this.physics.add.sprite(gameState.tanks.yellowTank.x + 14 * Math.sin(gameState.tanks.yellowTank.rotation), gameState.tanks.yellowTank.y - 14 * Math.cos(gameState.tanks.yellowTank.rotation), 'bullet').setRotation(gameState.tanks.yellowTank.rotation);
                    bullet.setInteractive();
                    bullets.push([bullet,"yellow"]);
                    gameState.bullets.yellow.bulletCount += 1;
                    gameState.bullets.yellow.cd += 1;
                    bullet.body.setBounce(1,1);
                    bullet.body.setVelocity(Math.sin(bullet.rotation) * 150,-Math.cos(bullet.rotation) * 150);
                    bullet.counter = 0;
                    gameState.walls.getChildren().forEach((wall) => {
                        this.physics.add.collider(bullet, wall, function(bullet,wall){
                            let normalAngle = Phaser.Math.Angle.Normalize(bullet.rotation)
                            if (bullet.body.blocked.left === true || bullet.body.blocked.right === true){
                                bullet.rotation = Math.abs(6.28 - normalAngle);
                            }else if (bullet.body.blocked.up === true || bullet.body.blocked.down){
                                bullet.rotation = 3.14 - bullet.rotation;
                            }
                        });
                    });
                    if (gameState.tanks.yellowTank.body.blocked.up && (gameState.tanks.yellowTank.rotation > -1.57 && gameState.tanks.yellowTank.rotation < 1.57)){
                        bullet.y += 10;
                    }
                    else if(gameState.tanks.yellowTank.body.blocked.down   ){
                        bullet.y -= 10;
                    }
                    for (let tank of gameState.tankArray){
                        this.physics.add.collider(bullet, tank, function(){
                            tank.destroy();
                            bullet.destroy();
                            gameState.bullets.yellow.bulletCount -= 1;
                        });
                    }
                    setTimeout(()=>{
                        console.log(bullet);
                        console.log(bullets);
                        bullets.shift();
                        console.log(bullet);
                        console.log(bullets);
                        bullet.destroy();
                        gameState.bullets.yellow.bulletCount -= 1;
                    },20000);
                }
            }
        }
    }catch{}
    //pink | check
    try{
        if(gameState.tanks.pinkTank.active){
            if (pointer.middleButtonDown() && gameState.bullets.pink.cd <= .1){
                if (gameState.bullets.pink.bulletCount < allowedLength) {
                    const bullet = this.physics.add.sprite(gameState.tanks.pinkTank.x + 14 * Math.sin(gameState.tanks.pinkTank.rotation), gameState.tanks.pinkTank.y - 14 * Math.cos(gameState.tanks.pinkTank.rotation), 'bullet').setRotation(gameState.tanks.pinkTank.rotation);
                    bullet.setInteractive();
                    bullets.push([bullet,"pink"]);
                    console.log(bullets);
                    gameState.bullets.pink.bulletCount += 1;
                    gameState.bullets.pink.cd += 1;
                    bullet.body.setBounce(1,1);
                    bullet.body.setVelocity(Math.sin(bullet.rotation) * 150,-Math.cos(bullet.rotation) * 150);
                    bullet.counter = 0;
                    gameState.walls.getChildren().forEach((wall) => {
                        this.physics.add.collider(bullet, wall, function(bullet,wall){
                            let normalAngle = Phaser.Math.Angle.Normalize(bullet.rotation)
                            if (bullet.body.blocked.left === true || bullet.body.blocked.right === true){
                                bullet.rotation = Math.abs(6.28 - normalAngle);
                            }else if (bullet.body.blocked.up === true || bullet.body.blocked.down){
                                bullet.rotation = 3.14 - bullet.rotation;
                            }
                        });
                    });
                    if (gameState.tanks.pinkTank.body.blocked.up && (gameState.tanks.pinkTank.rotation > -1.57 && gameState.tanks.pinkTank.rotation < 1.57)){
                        bullet.y += 10;
                    }
                    else if(gameState.tanks.pinkTank.body.blocked.down   ){
                        bullet.y -= 10;
                    }
                    for (let tank of gameState.tankArray){
                        this.physics.add.collider(bullet, tank, function(){
                            tank.destroy();
                            bullet.destroy();
                            gameState.bullets.pink.bulletCount -= 1;
                        });
                    }
                    setTimeout(()=>{
                        console.log(bullet);
                        console.log(bullets);
                        bullets.shift();
                        console.log(bullet);
                        console.log(bullets);
                        bullet.destroy();
                        gameState.bullets.pink.bulletCount -= 1;
                    },20000);
                }
            }
        }
    }catch{}

    //decrement bullet cooldowns | check
    if (gameState.bullets.red.cd > 0) {
        gameState.bullets.red.cd -= .1;
    }
    if (gameState.bullets.blue.cd > 0) {
        gameState.bullets.blue.cd -= .1;
    }
    if (gameState.bullets.yellow.cd > 0) {
        gameState.bullets.yellow.cd -= .1;
    }
    if (gameState.bullets.pink.cd > 0) {
        gameState.bullets.pink.cd -= .1;
    }

    //player movement | check
    try{
        if (gameState.keys.W.isDown){
            gameState.tanks.redTank.body.setVelocity(Math.sin(gameState.tanks.redTank.rotation) * 100,-Math.cos(gameState.tanks.redTank.rotation) * 100);
        }
        if (gameState.keys.S.isDown){
            gameState.tanks.redTank.body.setVelocity(Math.sin(-gameState.tanks.redTank.rotation) * 100,Math.cos(gameState.tanks.redTank.rotation) * 100);
        }
        if (gameState.keys.A.isDown){
            gameState.tanks.redTank.body.angularVelocity = -200;
        }
        if (gameState.keys.D.isDown){
            gameState.tanks.redTank.body.angularVelocity = 200;
        }
    }catch{}
    try{
        if (gameState.keys.I.isDown){
            gameState.tanks.blueTank.body.setVelocity(Math.sin(gameState.tanks.blueTank.rotation) * 100,-Math.cos(gameState.tanks.blueTank.rotation) * 100);
        }
        if (gameState.keys.K.isDown){
            gameState.tanks.blueTank.body.setVelocity(Math.sin(-gameState.tanks.blueTank.rotation) * 100,Math.cos(gameState.tanks.blueTank.rotation) * 100);
        }
        if (gameState.keys.J.isDown){
            gameState.tanks.blueTank.body.angularVelocity = -200;
        }
        if (gameState.keys.L.isDown){
            gameState.tanks.blueTank.body.angularVelocity = 200;
        }
    }catch{}
    try{
        if (gameState.keys.UP.isDown){
            gameState.tanks.yellowTank.body.setVelocity(Math.sin(gameState.tanks.yellowTank.rotation) * 100,-Math.cos(gameState.tanks.yellowTank.rotation) * 100);
        }
        if (gameState.keys.DOWN.isDown){
            gameState.tanks.yellowTank.body.setVelocity(Math.sin(-gameState.tanks.yellowTank.rotation) * 100,Math.cos(gameState.tanks.yellowTank.rotation) * 100);
        }
        if (gameState.keys.LEFT.isDown){
            gameState.tanks.yellowTank.body.angularVelocity = -200;
        }
        if (gameState.keys.RIGHT.isDown){
            gameState.tanks.yellowTank.body.angularVelocity = 200;
        }
    }catch{}
    try{
        if (pointer.leftButtonDown()){
            gameState.tanks.pinkTank.body.setVelocity(Math.sin(gameState.tanks.pinkTank.rotation) * 100,-Math.cos(gameState.tanks.pinkTank.rotation) * 100);
        }
        if (pointer.rightButtonDown()){
            gameState.tanks.pinkTank.body.setVelocity(-Math.sin(gameState.tanks.pinkTank.rotation) * 100,Math.cos(gameState.tanks.pinkTank.rotation) * 100);
        }
        gameState.tanks.pinkTank.rotation = Phaser.Math.Angle.Between(gameState.tanks.pinkTank.x, gameState.tanks.pinkTank.y, pointer.x, pointer.y) + Math.PI/2;
    }catch{}
}
