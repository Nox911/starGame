
let gameWidth = 1000,
    gameHeight = 650,
    heroBullets=[],
    heroBulletSpeed=3,
    lastFire=Date.now(),
    lastTouch=Date.now(),
    health=100,
    shield=100,
    dispHealth=100,
    dispShield=100,
    overlordSpeed=0.5,
    mutaliskSpeed=1,
    mutaliskBulletSpeed=3,
    overlords=[],
    mutalisks=[],
    mutaliskBullets=[],
    queens=[],
    score=0,
    countEnemies=2,
    difficult=0;



let     soundTrack = new Audio('../starGame/sounds/soundtrack.mp3'),
        overlordDeath = new Audio('../starGame/sounds/overlord_death.mp3'),
        mutaliskDeath = new Audio('../starGame/sounds/mutalisk_death.mp3'),
        heroAttack = new Audio('../starGame/sounds/hero_attack.mp3'),
        mutaliskHit = new Audio('../starGame/sounds/mutalisk_hit.mp3'),
        shieldHit = new Audio('../starGame/sounds/shield_hit.mp3');



    const stage = new Konva.Stage({
        container: 'game',
        width: gameWidth,
        height: gameHeight
    });

let layer = new Konva.Layer();



const animationsHero = {
    idle: [ 
        400, 0, 100, 100,
        300, 0, 100, 100,
        200, 0, 100, 100,
        100, 0, 100, 100,
        000, 0, 100, 100,
        100, 0, 100, 100,
        200, 0, 100, 100,
        300, 0, 100, 100,
        400, 0, 100, 100,
        500, 0, 100, 100,
        600, 0, 100, 100,
        700, 0, 100, 100,
        800, 0, 100, 100,
        700, 0, 100, 100,
        600, 0, 100, 100,
        500, 0, 100, 100

    ]
  };

  const animationsHeroFace = {
      idle: [
          80,2,80,80,
          80,2,80,80,
          80,2,80,80,
          160,2,80,80,
          80,2,80,80,
          80,2,80,80,
          80,2,80,80,
          0,2,80,80

      ],
      idleDamaged: [
        80,78,80,80,
        80,78,80,80,
        80,78,80,80,
        160,78,80,80,
        80,78,80,80,
        80,78,80,80,
        80,78,80,80,
        0,78,80,80
      ],
      idlePreDeath: [
        80,155,80,80,
        80,155,80,80,
        80,155,80,80,
        160,155,80,80,
        80,155,80,80,
        80,155,80,80,
        80,155,80,80,
        80,155,80,80,
        0,155,80,80
      ],
      attack: [
        480,2,80,80,
        480,2,80,80,
        480,2,80,80
      ],
      attackDamaged: [
        480,78,80,80,
        480,78,80,80,
        480,78,80,80
      ],
      attackPreDeath: [
        480,155,80,80,
        480,155,80,80,
        480,155,80,80
      ],
      takeDamage: [
        558,5,80,80,
        558,5,80,80,
        558,5,80,80
      ],
      takeDamageDamaged: [
        558,78,80,80,
        558,78,80,80,
        558,78,80,80
      ],
      takeDamagePreDeath: [
        558,158,80,80,
        558,158,80,80,
        558,158,80,80
      ]
      
  };

  const animationsOverlord = {
      idle: [
        0, 0, 80, 84,
        80, 0, 80, 84,
        160, 0, 80, 84,
        244, 0 , 80, 84,
        160, 0, 80, 84,
        80, 0, 80, 84
      ],
      die: [
          0,84,99,82,
          102,84,99,82,
          203,84,99,82,
          305,84,99,82,
          407,84,99,82,
          509,84,99,82,
          611,84,99,82,
          715,84,99,82,
          819,84,99,82,
          923,84,99,82

      ]
  };

  const animationsMutalisk = {
    idle: [
      0, 0, 49, 61,
      50, 0, 49, 61,
      100, 0, 49, 61,
      150, 0, 49, 61,
      200, 0, 49, 61,
      150, 0, 49, 61,
      100, 0, 49, 61,
      50, 0, 49, 61
    ],
    bullet: [
        0,123,18,22,
        20,123,18,22,
        40,123,18,22,
        60,123,18,22,
        80,123,18,22,
        100,123,18,22,
        120,123,18,22,
        140,123,18,22,
        160,123,18,22,
        180,123,18,22
    ],
    die : [
        0,62,68,58,
        69,62,68,58,
        138,62,68,58,
        207,62,68,58,
        276,62,68,58,
        345,62,68,58,
        414,62,68,58,
        483,62,68,58,
        552,62,68,58
    ]
};

const animationsHeroBullet = {
    idle : [
        0,123,18,22,
        20,123,18,22,
        40,123,18,22,
        60,123,18,22,
        80,123,18,22,
        100,123,18,22,
        120,123,18,22,
        140,123,18,22,
        160,123,18,22,
        180,123,18,22
    ]};
   
  let heroImg = new Image();
  heroImg.src = 'img/ship1.png';

  let overlordImg = new Image();
  overlordImg.src = 'img/overlord.png';
  
  let mutaliskImg = new Image();
  mutaliskImg.src = 'img/mutalisk.png';

  let heroBulletImg = new Image();
  heroBulletImg.src = 'img/mutalisk.png';

  const heroFaceImg = new Image();
  heroFaceImg.src = 'img/heroFace.png';

 
const hero = new Konva.Sprite({
      x: 680, 
      y: 200,
      image: heroImg,
      animation: 'idle',
      animations: animationsHero, 
      frameRate: 6, 
      frameIndex: 0 
  });

  hero.speed=8;
  hero.bullets=100;
  layer.add(hero);
  stage.add(layer);
  hero.start();

  const heroFace = new Konva.Sprite({
    x:463,
    y:568,
    image:heroFaceImg,
    animation:'idle',
    animations: animationsHeroFace,
    frameRate:2,
    frameIndex:0 
  });
  layer.add(heroFace);
  stage.add(layer);
  heroFace.start();

let gameLoop = new Konva.Animation(function(frame) {
    handleInput();
    moveOverlord();
    moveMutalisk ();
    mutaliskAttack();
    moveMutaliskBullet ();
    mutaliskDie();
    overlordDie();
    moveHeroBullet ();
    regenShield();
    checkCollisions();
    showHeroParam ();
}, layer);
gameLoop.start();


function showHeroParam () {

    if(shield<dispShield) {
        dispShield--;
    }
    if(shield>dispShield) {
        dispShield++;
    }
    if (health<dispHealth) {
        dispHealth --;
    }

    scoreText.setAttr('text', 'Score: ' + score);
    heroHealth.setAttr('text', Math.floor(dispHealth)+'%');
    heroShield.setAttr('text', Math.floor(dispShield)+'%');
    heroBulletsText.setAttr('text',hero.bullets);


}


  // отлавливание событий нажатия на "игровые" клавиши
function handleInput() {

    
       if (health>=70&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
        heroFace.attrs.animation = 'idle';
        
       } 
       else if (health<70&&health>=35&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
        heroFace.attrs.animation = 'idleDamaged';
       }
       else if (health<35&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
        heroFace.attrs.animation = 'idlePreDeath';
       }   


       if(input.isDown('DOWN') || input.isDown('s')) {
            if (hero.attrs.y + 1 < gameHeight -185) { 
                hero.attrs.animation = 'idle';
                hero.setY(hero.attrs.y + hero.speed);
            }
        }
    
        if(input.isDown('UP') || input.isDown('w')) {
            if (hero.attrs.y - 1 > 0) {
                hero.attrs.animation = 'idle';
                hero.setY(hero.attrs.y - hero.speed);
            }
       } 
    
        if(input.isDown('LEFT') || input.isDown('a')) {
            if (hero.attrs.x + 1 > 0 ) {
                hero.attrs.animation = 'idle';
                hero.setX(hero.attrs.x - hero.speed);
            }
        }
    
        if(input.isDown('RIGHT') || input.isDown('d')) {
            if (hero.attrs.x - 1 < gameWidth -100) {
                hero.attrs.animation = 'idle';
                hero.setX(hero.attrs.x + hero.speed);           
            }
        }

        if((input.isDown('SPACE')) && (Date.now() - lastFire >200) && (hero.bullets>0)) {
            makeBullet('heroBullet',hero.attrs.x +10,hero.attrs.y + 40);
            if (health>70) {
                heroFace.attrs.animation = 'attack';              
               } 
               else if (health<70&&health>35) {
                heroFace.attrs.animation = 'attackDamaged';
               }
               else if (health<35) {
                heroFace.attrs.animation = 'attackPreDeath';
               }   
                heroFace.attrs.frameIndex=0;
                heroFace.action='shoot';
        }
    
   }

function makeEnemy(type, x,y) {
    let overlord,
        mutalisk,
        queen;

    switch (type) {
        case 'overlord': {
            overlord = new Konva.Sprite( {
            x:x,
            y:y,
            image:overlordImg,
            animation:'idle',
            animations: animationsOverlord,
            frameRate:8,
            frameIndex:0

        });
        overlord.action='';
        overlords.push(overlord);

        layer.add(overlord);
        stage.add(layer);
        overlord.start();
        break;
        };
        case 'mutalisk': {
            mutalisk = new Konva.Sprite( {
                x:x,
                y:y,
                image:mutaliskImg,
                animation:'idle',
                animations: animationsMutalisk,
                frameRate:10,
                frameIndex:0
    
            });
            mutalisk.action='';
            mutalisk.time=70;
            mutalisk.position=getRandomInt(70,200);
            mutalisks.push(mutalisk);
    
            layer.add(mutalisk);
            stage.add(layer);
            mutalisk.start();
            break;
        };
        case 'queen': {
            queen = new Konva.Sprite( {
                x:x,
                y:y,
                image:queenImg,
                animation:'idle',
                animations: animationsQueen,
                frameRate:4,
                frameIndex:0
    
            });
            queen.action='';
            queens.push(queen);
    
            layer.add(queen);
            stage.add(layer);
            queen.start();
            break;
        };
    };
}


function moveOverlord () {
    overlords.forEach(function(overlord){
        if(overlord.action!=='die') {
        overlord.setX(overlord.attrs.x + overlordSpeed);
        overlord.attrs.animation = 'idle';
        overlord.action='go';
        }
    });
}

function moveMutalisk () {
    mutalisks.forEach(function(mutalisk){
        if ((mutalisk.attrs.x < mutalisk.position)&&(mutalisk.action!=='die')) {
        mutalisk.setX(mutalisk.attrs.x + mutaliskSpeed);
        mutalisk.attrs.animation = 'idle';
        mutalisk.action='go';
        };
    });
}

function makeBullet(type, x, y) {
    let heroBullet,
        mutaliskBullet,
        queenBullet;

    switch  (type) {
        case('mutaliskBullet') : {
            mutaliskBullet = new Konva.Sprite({
                x: x,
                y: y,
                image: mutaliskImg,
                animation: 'bullet',
                animations: animationsMutalisk,
                frameRate: 7,
                frameIndex: 0
                });
                mutaliskBullets.push(mutaliskBullet);
                layer.add(mutaliskBullet);
                stage.add(layer);
                mutaliskBullet.start();
                break;
    };
        case ('heroBullet') : {
            heroBullet = new Konva.Sprite({
                x: x,
                y: y,
                image: heroBulletImg,
                animation: 'idle',
                animations: animationsHeroBullet,
                frameRate: 7,
                frameIndex: 0
                });
                heroBullets.push(heroBullet);
                layer.add(heroBullet);
                // add the layer to the stage
                stage.add(layer);
                // start sprite animation
                heroBullet.start();
                lastFire = Date.now();
                hero.bullets--;
                heroAttack.play();
                break;
        };
   }

   // add the shape to the layer

}

function mutaliskAttack() {

    let attackPeriod = 200;
    
       for(let i = 0; i < mutalisks.length; i++) {
           if ((mutalisks[i].attrs.x>=70) && (mutalisks[i].action!=='die')){
           mutalisks[i].time++;
    
           if (mutalisks[i].time > attackPeriod && mutalisks[i].attrs.animation === 'idle') {
               mutalisks[i].action = 'attack';
               mutalisks[i].attrs.animation = 'idle';
               mutalisks[i].time -= attackPeriod;
           };
 
            
           // mutalisk attack
           if (mutalisks[i].action === 'attack') {
               makeBullet('mutaliskBullet', mutalisks[i].attrs.x+40,mutalisks[i].attrs.y+40);
               mutalisks[i].action = 'go';
           };

        }
            
            
       }
        
   }

function mutaliskDie() {
    mutalisks.map(function(mutalisk,index) {
        if ((mutalisk.action==='die') && (mutalisk.attrs.frameIndex>7)) {
            mutalisk.setX(-1500);
            mutalisks.splice(index,1);
            score+=200;
            updateDifficult();
        }
    });
}

function overlordDie() {
    overlords.map(function(overlord,index) {
        if ((overlord.action==='die') && (overlord.attrs.frameIndex>8)) {
            overlord.setX(-1500);
            overlords.splice(index,1);
            score+=100;
            updateDifficult();
        }
    });
}

function moveMutaliskBullet () {
    mutaliskBullets.forEach(function(mutaliskBullet,index){
        mutaliskBullet.setX(mutaliskBullet.attrs.x + mutaliskBulletSpeed);
        mutaliskBullet.attrs.animation = 'bullet';
        mutaliskBullet.action='attack';
        if (mutaliskBullet.attrs.x > gameWidth) {
            mutaliskBullets.splice(index,1);
            mutaliskBullet.setX(1200);
        }
    });
}

function moveHeroBullet () {
    heroBullets.forEach(function(heroBullet,index){
        heroBullet.setX(heroBullet.attrs.x - heroBulletSpeed);
        heroBullet.attrs.animation = 'idle';
        heroBullet.action='attack';
        if (heroBullet.attrs.x < -22) {
            heroBullets.splice(index,1);
            heroBullet.setX(-1000);
        }
    });
}




// regen shield 

function regenShield() {
    
   shield = shield + 0.01;

    
   if (shield > 100) {
       shield = 100;
   }

   if (health <= 0) {
    health = 0;
    gameOver();
}
    
}
//end game
function gameOver() {
    gameLoop.stop();
    document.getElementById('score').innerText = score;
    document.getElementById('dead').style.display = "block";
    document.getElementById('container').style.display = "none";
}


// hero and enemy touch

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}
 
function boxCollides(pos, size, pos2, size2) {  
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}
 

function checkCollisions() {
    
    let heroBulletpos = [],
        heroPos = [],
        heroBulletSize = [20,20],
        heroSize = [100,100],
        mutaliskPos = [],
        mutaliskSize=[80,80],
        mutaliskBulletSize = [],
        overlordPos=[],
        overlordSize=[80,80],
        gameRightCorner=[gameWidth+100,0];
        

   heroPos = [hero.attrs.x+40,hero.attrs.y];
  
   
   mutaliskBulletSize = [15,15];



    mutaliskBullets.forEach(function(bullet,index) {
        mutaliskBulletPos=[bullet.attrs.x, bullet.attrs.y];
        if (boxCollides(mutaliskBulletPos, mutaliskBulletSize, heroPos, heroSize)) {
            bullet.setX(-1000);
            mutaliskBullets.splice(index,1);


            lastTouch = Date.now();
            if (health>70) {
                heroFace.attrs.animation = 'takeDamage';              
               } 
               else if (health<70&&health>35) {
                heroFace.attrs.animation = 'takeDamageDamaged';
               }
               else if (health<35) {
                heroFace.attrs.animation = 'takeDamagePreDeath';
               }   
                heroFace.attrs.frameIndex=0;


            if(shield<15){
                mutaliskHit.play();
            }
            if(shield>=15) {
                shield-=15;
                shieldHit.play();
            }
            else {
                health-=15-shield;
                shield=0;
            }
        }  
    });


   if (heroBullets.length) {
       for( let i = 0; i < heroBullets.length; i++) {
           heroBulletPos = [heroBullets[i].attrs.x, heroBullets[i].attrs.y];
            mutalisks.map(function(mutalisk,index) {
                mutaliskPos = [mutalisk.attrs.x-50,mutalisk.attrs.y];
                if (mutalisk.action != 'die') {
                    if (boxCollides(mutaliskPos,mutaliskSize,heroBulletPos,heroBulletSize)) {
                        console.log('mutal must die');
                        mutaliskDeath.play();
                        if(heroBullets[i]) {
                            heroBullets[i].setX(-1000);
                            heroBullets.splice(i,1);
                        }
                        mutalisk.action='die';
                        mutalisk.attrs.animation='die';
                        mutalisk.frameIndex(0);
                    }
                }
            });
            overlords.map(function(overlord,index) {
                overlordPos = [overlord.attrs.x-40,overlord.attrs.y];
                if (overlord.action != 'die'||'go') {
                    if (boxCollides(overlordPos,overlordSize,heroBulletPos,heroBulletSize)) {
                        console.log('over must die');
                        if(heroBullets[i]) {
                            heroBullets[i].setX(-1000);
                            heroBullets.splice(i,1);
                        }
                        overlordDeath.play();
                        overlord.action='die';
                        overlord.attrs.animation='die';
                        overlord.frameRate=16;
                        overlord.frameIndex(0);
                        
                    }
                }

            });
        }
    }

    // for collisions between hero and enemies
    mutalisks.map(function(mutalisk,index) {
        mutaliskPos = [mutalisk.attrs.x,mutalisk.attrs.y];
        if (mutalisk.action != 'die') {
            if (boxCollides(mutaliskPos,mutaliskSize,heroPos,heroSize)) {
                console.log('mutal must die');
                mutaliskDeath.play();
                mutalisk.action='die';
                mutalisk.attrs.animation='die';
                mutalisk.frameIndex(0);
                lastTouch = Date.now();
                if (health>70) {
                    heroFace.attrs.animation = 'takeDamage';              
                   } 
                   else if (health<70&&health>35) {
                    heroFace.attrs.animation = 'takeDamageDamaged';
                   }
                   else if (health<35) {
                    heroFace.attrs.animation = 'takeDamagePreDeath';
                   }   
                    heroFace.attrs.frameIndex=0;
                if(shield>=10) {
                    shield-=10;
                    shieldHit.play();
                }
                else {
                    health-=10-shield;
                    shield=0;
                }

            }
        }
    });

    overlords.map(function(overlord,index) {
        overlordPos = [overlord.attrs.x+10,overlord.attrs.y];
        if (overlord.action != 'die') {
            if (boxCollides(overlordPos,overlordSize,heroPos,heroSize)) {
                console.log('over must die');
                overlordDeath.play();
                overlord.action='die';
                overlord.attrs.animation='die';
                overlord.frameIndex(0);
                lastTouch = Date.now();
                if (health>70) {
                    heroFace.attrs.animation = 'takeDamage';              
                   } 
                   else if (health<70&&health>35) {
                    heroFace.attrs.animation = 'takeDamageDamaged';
                   }
                   else if (health<35) {
                    heroFace.attrs.animation = 'takeDamagePreDeath';
                   }   
                    heroFace.attrs.frameIndex=0;
                if(shield>=20) {
                    shield-=20;
                    shieldHit.play();
                }
                else {
                    health-=20-shield;
                    shield=0;
                }

            }
        }
    });

    overlords.map(function(overlord,index) {
        overlordPos = [overlord.attrs.x,overlord.attrs.y];
        if (overlord.action != 'die') {
            if (boxCollides(overlordPos,overlordSize,gameRightCorner,[10,gameHeight])) {
                console.log('over must die');
                overlordDeath.play();
                overlord.action='die';
                overlord.attrs.animation='die';
                overlord.frameIndex(0);
                    health-=5;
            }
        }
    });
}





//text

let scoreText = new Konva.Text({
    x: 730,
    y: 620,
    text: 'text',
    fontSize:24,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    align:'left',
    stroke:'black',
    fill:'orange',
    width:'160'
});
 

let heroHealth = new Konva.Text({
    x: 235,
    y: 575,
    text: 'text',
    fontSize:46,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    align:'right',
    stroke:'black',
    fill:'#ce0b0b',
    width:'120'
});

let heroShield = new Konva.Text({
    x: 560,
    y: 575,
    text: 'text',
    fontSize:46,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    align:'right',
    stroke:'black',
    fill:'cyan',
    width:'120'
});

let heroBulletsText = new Konva.Text({
    x:100,
    y:575,
    text:'text',
    fontSize:46,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    align:'center',
    stroke:'black',
    fill:'#ce0b0b',
    width:'120'
});
 
layer.add(scoreText);
layer.add(heroHealth);
layer.add(heroShield);
layer.add(heroBulletsText);


function updateDifficult () {
    difficult=score/1000;
    if ((difficult >= 0)&&(difficult<1)) {
        countEnemies=2;
    }
    if ((difficult >= 2)&&(difficult<4)) {
        countEnemies=4;
    }
    if ((difficult >= 4)&&(difficult<8)) {
        countEnemies=8;
    }
    if ((difficult >= 8)&&(difficult<12)) {
        countEnemies =16;
    }
    if ((difficult >= 12)) {
        countEnemies = 24;
    }
 
    while (overlords.length < countEnemies/2) {
            makeEnemy('overlord', getRandomInt(-200,-80), getRandomInt(0, 440));       
    }
    while (mutalisks.length < countEnemies/2) {
             makeEnemy('mutalisk', getRandomInt(-200,-80), getRandomInt(0, 440));     
}


}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

soundTrack.play();
makeEnemy('overlord', -600,70);
makeEnemy('overlord', -500,250);
makeEnemy('overlord', -700,400);
// updateDifficult();
