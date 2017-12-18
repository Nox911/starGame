// init data
let gameWidth = 1000,
    gameHeight = 650,
    heroSpeed=8,
    heroBulletsCount=10000,
    heroBullets=[],
    heroBulletSpeed=5,
    heroGodModeRecovery=0,
    heroGodModeReady=0,
    pilots=[],
    lastFire=Date.now(),
    lastTouch=Date.now(),
    health=100,
    shield=100,
    dispHealth=100,
    dispShield=100,
    overlords=[],
    overlordSpeed=0.75,
    mutalisks=[],
    mutaliskSpeed=1,
    mutaliskBullets=[],
    mutaliskBulletSpeed=3,
    scourges=[],
    scourgeSpeed=4,
    devourers=[],
    devourerSpeed=1,
    devourerBullets=[],
    devourerBulletSpeed=3,
    kerrigan={},
    kerriganAttackTime=0,
    score=0,
    countEnemies=2,
    difficult=0,
    activeShieldAnim=0;

// SOUNDS
const   soundTrack = new Audio('sounds/soundtrack.mp3'),
        overlordDeath = new Audio('sounds/overlord_death.mp3'),
        mutaliskDeath = new Audio('sounds/mutalisk_death.mp3'),
        heroAttack = new Audio('sounds/hero_attack.mp3'),
        mutaliskHit = new Audio('sounds/mutalisk_hit.mp3'),
        shieldHit = new Audio('sounds/shield_hit.mp3'),
        scourgeDeath = new Audio('sounds/scourge_death.mp3'),
        kerriganSpeech = new Audio('sounds/kerrigan_speech.mp3'),
        heroSpeech = new Audio('sounds/hero_speech.mp3'),
        godModeSpeech = new Audio('sounds/godMode_speech.mp3'),
        gameOverTrack = new Audio('sounds/gameOver_sound.mp3');

//mute game 
function muteGame (n) {
    soundTrack.volume=n;
    overlordDeath.volume=n;
    mutaliskDeath.volume=n;
    heroAttack.volume=n;
    mutaliskHit.volume=n;
    shieldHit.volume=n;
    scourgeDeath.volume=n;
    kerriganSpeech.volume=n;
    heroSpeech.volume=n;
    godModeSpeech.volume=n;
    gameOverTrack.volume=n;
}

// create Stage of Konva
const stage = new Konva.Stage({
    container: 'game',
    width: gameWidth,
    height: gameHeight
});

// create Layer of Konva
const layer = new Konva.Layer();

// create Animations map:
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
    ],
    shieldActive: [
        400, 100, 100, 100,
        300, 100, 100, 100,
        200, 100, 100, 100,
        100, 100, 100, 100,
        000, 100, 100, 100,
        100, 100, 100, 100,
        200, 100, 100, 100,
        300, 100, 100, 100,
        400, 100, 100, 100,
        500, 100, 100, 100,
        600, 100, 100, 100,
        700, 100, 100, 100,
        800, 100, 100, 100,
        700, 100, 100, 100,
        600, 100, 100, 100,
        500, 100, 100, 100 
    ],
    die: [
        1,209,188,150,
        192,209,188,150,
        383,209,188,150,
        574,209,188,150,
        765,209,188,150,
        956,209,188,150,
        1147,209,188,150,
        1338,209,188,150,
        1529,209,188,150,
        1720,209,188,150
    ]
  };

const animationsHeroAbility = {
    idle: [ 
        1, 1, 82, 89,
        86, 1, 82, 89,
        171, 1, 82, 89,
        256, 1, 82, 89,
        341, 1, 82, 89,
        426, 1, 82, 89,
        511, 1, 82, 89,
        596, 1, 82, 89,
        681, 1, 82, 89,
        766, 1, 82, 89,
        851, 1, 82, 89,
        936, 1, 82, 89,
        1021, 1, 82, 89,
        1106, 1, 82, 89,
        1191, 1, 82, 89,
    ],
    energyBullet: [
        1,253,51,8,
        55,253,51,8,
        109,253,51,8,
        163,253,51,8,
        217,253,51,8,
        271,253,51,8
    ],
    energyBulletRed: [
        1,267,51,8,
        55,267,51,8,
        109,267,51,8,
        163,267,51,8,
        217,267,51,8,
        271,267,51,8
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
      ],
      godMode : [
        78,239,80,80
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
    bulletHit: [
        1,147,62,62,
        66,147,62,62,
        131,147,62,62,
        196,147,62,62,
        261,147,62,62,
        1,213,62,62,
        66,213,62,62,
        131,213,62,62,
        196,213,62,62,
        261,213,62,62
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

const animationsScourge = {
    move: [
        1, 1, 31, 27,
        35,1, 31, 27,
        69, 1, 31, 27,
        103, 1, 31, 27,
        137, 1, 31, 27,
    ],
    die : [
        0,32,68,60,
        72,32,68,60,
        143,32,68,60,
        214,32,68,60,
        285,32,68,60,
        356,32,68,60,
        427,32,68,60
    ]
};

const animationsDevourer = {
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
    bulletHit: [
        1,147,62,62,
        66,147,62,62,
        131,147,62,62,
        196,147,62,62,
        261,147,62,62,
        1,213,62,62,
        66,213,62,62,
        131,213,62,62,
        196,213,62,62,
        261,213,62,62
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

const animationsKerrigan = {
    idle: [
      1, 1, 59, 55,
      63, 1, 59, 55,
      125, 1, 59, 55,
      187, 1, 59, 55,
      249, 1, 59, 55,
      311, 1, 59, 55,
    373,1, 59, 55,
    435,1, 59, 55,

    ],
    attack: [
        1, 59, 59, 55,
        63, 59, 59, 55,
        125, 59, 59, 55,
        187, 59, 59, 55,
        249, 59, 59, 55,
        311, 59, 59, 55,
        373,59, 59, 55,
        435,59, 59, 55,
    ],
    goAway: [
        1, 117, 59, 55,
        63, 117, 59, 55,
        125, 117, 59, 55,
        187, 117, 59, 55,
        249, 117, 59, 55,
        311, 117, 59, 55,
        373,117, 59, 55,
        435,117, 59, 55,
    ]
};
  
// animations map source
const heroImg = new Image();
heroImg.src = 'img/hero.png';

const overlordImg = new Image();
overlordImg.src = 'img/overlord.png';
  
const mutaliskImg = new Image();
mutaliskImg.src = 'img/mutalisk.png';

const scourgeImg = new Image();
scourgeImg.src = 'img/scourge.png';

const devourerImg = new Image();
devourerImg.src = 'img/devourer.png';

const kerriganImg = new Image();
kerriganImg.src = 'img/kerrigan.png';

const heroFaceImg = new Image();
heroFaceImg.src = 'img/heroFace.png';

const heroAbilityImg = new Image();
heroAbilityImg.src = 'img/heroAbility.png';

// create Hero sprite with Konva Sprite
const hero = new Konva.Sprite({
      x: 1700, // start position X
      y: 240, // start position Y   
      image: heroImg, // animations map source
      animation: 'idle', //start animation
      animations: animationsHero, // animations map
      frameRate: 6,  
      frameIndex: 0 //start frame
  });
layer.add(hero); // add hero to layer
stage.add(layer); // add layer to stage
hero.start();     // start hero animation  

// create hero ability animations with Konva Sprite
const heroAbility = new Konva.Sprite({
      x:hero.attrs.x+10,
      y:hero.attrs.y,
      scaleX:1.2,
      scaleY:1.2,
      image: heroAbilityImg,
      animation: 'idle',
      animations: animationsHeroAbility, 
      frameRate: 12, 
      frameIndex: 0 
  });
hero.ability='default';
hero.action='idle';
layer.add(heroAbility);
heroAbility.start();

// create hero face animation 
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

// hero face default animation 
function heroFaceDefault (){
    if (hero.ability!=='god'){
        if (health>=70&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
            heroFace.attrs.animation = 'idle';           
        } 
        else if (health<70&&health>=35&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
         heroFace.attrs.animation = 'idleDamaged';
        }
        else if (health<35&&Date.now() - lastFire >200&&Date.now() - lastTouch >200) {
            heroFace.attrs.animation = 'idlePreDeath';
        }   
    }
}

// hero face animations when hero attacks 
function heroFaceAttack (){
    if(hero.ability!=='god'){
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

// hero face animations when hero takes damage
function heroFaceTakeDamage () {
    if(hero.ability!=='god'){
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
    }
}

// input listening
function handleInput() {
    // hero action if has pressed DOWN or S button
    if(kerrigan.action==='out'&&hero.action!=='die') {
    if(input.isDown('DOWN') || input.isDown('s')) {
        if (hero.attrs.y + 1 < gameHeight -185) { 
            hero.setY(hero.attrs.y + heroSpeed);
            if (hero.action!=='shieldActive') {
                hero.attrs.animation = 'idle';
            }
        }
    }
    // hero action if has pressed UP or W button   
    if(input.isDown('UP') || input.isDown('w')) {
        if (hero.attrs.y - 1 > 0) {
            hero.setY(hero.attrs.y - heroSpeed);
            if (hero.action!=='shieldActive') {
                hero.attrs.animation = 'idle';
            }
        }
    } 
    // hero action if has pressed LEFT or A button
    if(input.isDown('LEFT') || input.isDown('a')) {
        if (hero.attrs.x + 1 > 0 ) {
            hero.setX(hero.attrs.x - heroSpeed);
            if (hero.action!=='shieldActive') {
                hero.attrs.animation = 'idle';
            }
        }
    }
    // hero action if has pressed LEFT or A button       
    if(input.isDown('RIGHT') || input.isDown('d')) {
        if (hero.attrs.x - 1 < gameWidth -100) {
            hero.setX(hero.attrs.x + heroSpeed); 
            if (hero.action!=='shieldActive') {
                hero.attrs.animation = 'idle';
            }          
        }
    }
    // hero action if has pressed SPACE button     
    if((input.isDown('SPACE')) && (Date.now() - lastFire >200) && (heroBulletsCount>0)) {
        if (hero.ability==='god') {
        makeBullet('heroEnergyBullet',hero.attrs.x +35,hero.attrs.y + 12,'energyBulletRed');
        makeBullet('heroEnergyBullet',hero.attrs.x +35,hero.attrs.y + 80,'energyBulletRed');
        heroFaceAttack();
        }
        else {

        makeBullet('heroEnergyBullet',hero.attrs.x -15,hero.attrs.y + 47,'energyBullet');
        heroFaceAttack();
        }
    }

    // hero ability 'GOD MODE' ON
    if((input.isDown('g')) && hero.ability!=='god'&&heroGodModeReady===1) {
        heroGodModeRecovery=Date.now();
        hero.ability='god';
        heroFace.attrs.frameIndex=0;
        heroFace.attrs.animation = 'godMode';
        layer.add(heroAbility);
        godModeSpeech.play();
        heroGodModeReady=0;
        godModeText.setAttr('text','CHARGE');
        godModeText.setAttr('fill','yellow');
        godModeText.setAttr('fontSize','18');
        godModeText.setAttr('x','373');
        godModeText.setAttr('stroke','transparent');
        }
    }
    // pause game
    if(input.isDown('p')) {
        pauseGame();
    }
}

//create enemies
function makeEnemy(type, x,y) {
    let overlord,
        mutalisk,
        scourge,
        devourer;

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
            overlord.action='move';
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
            mutalisk.action='move';
            mutalisk.time=70;
            mutalisk.position=getRandomInt(80,250);
            mutalisks.push(mutalisk);   
            layer.add(mutalisk);
            stage.add(layer);
            mutalisk.start();
            break;
        };
        case 'scourge': {
            scourge = new Konva.Sprite( {
                x:x,
                y:y,
                image:scourgeImg,
                animation:'move',
                animations: animationsScourge,
                frameRate:10,
                frameIndex:0    
            });
            scourge.action='move';
            scourges.push(scourge);    
            layer.add(scourge);
            stage.add(layer);
            scourge.start();
            break;
        };
        case 'devourer': {
            devourer = new Konva.Sprite( {
                x:x,
                y:y,
                image:devourerImg,
                animation:'idle',
                animations: animationsDevourer,
                frameRate:6,
                frameIndex:0    
            });
            devourer.action='move';
            devourer.time=10;
            devourer.position=getRandomInt(80,250);
            devourers.push(devourer);    
            layer.add(devourer);
            stage.add(layer);
            devourer.start();
            break;
        };
        case 'kerrigan': {
            kerrigan = new Konva.Sprite( {
                x:x,
                y:y,
                image:kerriganImg,
                animation:'idle',
                animations: animationsKerrigan,
                frameRate:8,
                frameIndex:0    
            });
            kerrigan.action='move';  
            layer.add(kerrigan);
            stage.add(layer);
            kerrigan.start();
            break;
        };
    };
}

//hero GOD MODE off 
function godModeOff () {
    if (Date.now()-heroGodModeRecovery>5000&&hero.ability==='god') {
        hero.ability='default';
        heroAbility.remove();
        hero.attrs.animation='idle';
        hero.action='idle';
    }
    if (Date.now()-heroGodModeRecovery>40000) {
        heroGodModeReady=1;
        godModeText.setAttr('text','READY');
        godModeText.setAttr('fill','red');
        godModeText.setAttr('fontSize','20');
        godModeText.setAttr('x','378');
        godModeText.setAttr('stroke','black');
    }

}

// hero ability moving
function moveHeroAbility () {
        heroAbility.setX(hero.attrs.x+10);
        heroAbility.setY(hero.attrs.y);
}

// displaying hero parametrs
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
    heroBulletsText.setAttr('text',heroBulletsCount);   
}

// Create bullets
function makeBullet(type, x, y,anim) {
    let heroEnergyBullet,
        mutaliskBullet,
        devourerBullet;
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
            mutaliskBullet.action='move';
            mutaliskBullets.push(mutaliskBullet);
            layer.add(mutaliskBullet);
            stage.add(layer);
            mutaliskBullet.start();
            break;
        };
        case ('heroEnergyBullet') : {
            heroEnergyBullet = new Konva.Sprite({
                x: x,
                y: y,
                image: heroAbilityImg,
                animation: anim,
                animations: animationsHeroAbility,
                frameRate: 12,
                frameIndex: 0
                });
            heroBullets.push(heroEnergyBullet);
            layer.add(heroEnergyBullet);
            stage.add(layer);
            heroEnergyBullet.start();
            lastFire = Date.now();
            heroBulletsCount--;
            if (heroAttack.currentTime===0) {
                heroAttack.play();
            }
            else {
                heroAttack.pause();
                heroAttack.currentTime = 0;
                heroAttack.play();
            }               
            break;
        };
    }
}

// MOVING

// overlord moving
function moveOverlord () {
    overlords.forEach(function(overlord){
        if(overlord.action!=='die') {
        overlord.setX(overlord.attrs.x + overlordSpeed);
        overlord.attrs.animation = 'idle';
        overlord.action='move';
        }
    });
}

// mutalisk moving
function moveMutalisk () {
    mutalisks.forEach(function(mutalisk){
        if ((mutalisk.attrs.x < mutalisk.position)&&(mutalisk.action!=='die')) {
        mutalisk.setX(mutalisk.attrs.x + mutaliskSpeed);
        mutalisk.attrs.animation = 'idle';
        mutalisk.action='go';
        };
    });
}

// scourge moving
function moveScourge() {
    scourges.forEach(function(scourge){
        if ((scourge.action!=='die')) {
        scourge.setX(scourge.attrs.x + scourgeSpeed);
        scourge.attrs.animation = 'move';
        scourge.action='move';
        };
    });
}

// devourer moving
function moveDevourer () {
    devourers.forEach(function(devourer){
        if ((devourer.attrs.x < devourer.position)&&(devourer.action!=='die')) {
        devourer.setX(devourer.attrs.x + devourerSpeed);
        devourer.attrs.animation = 'idle';
        devourer.action='go';
        };
    });
}

// DIYING

//hero diying 
function heroAnimDie() {
    if ((hero.action==='die') && (hero.attrs.frameIndex===8)) {
        // hero.stop();
        hero.remove();
        gameOver();
    }
}

// overlord diying
function overlordDie() {
    overlords.forEach(function(overlord,index) {
        if ((overlord.action==='die') && (overlord.attrs.frameIndex>8)) {
            overlord.stop();
            overlord.remove();
            overlords.splice(index,1);
            score+=100;
            updateDifficult();
        }
    });
}

// mutalisk diying
function mutaliskDie() {
    mutalisks.forEach(function(mutalisk,index) {
        if ((mutalisk.action==='die') && (mutalisk.attrs.frameIndex>7)) {
            mutalisk.stop();
            mutalisk.remove();
            mutalisks.splice(index,1);
            score+=200;
            updateDifficult();
        }
    });
}

function scourgeDie() {
    scourges.forEach(function(scourge,index) {
        if ((scourge.action==='die') && (scourge.attrs.frameIndex===6)) {
            scourge.stop();
            scourge.remove();
            scourges.splice(index,1);
            score+=150;
            updateDifficult();
        }
    });
}

// devourer diying
function devourerDie() {
    devourers.forEach(function(devourer,index) {
        if ((devourer.action==='die') && (devourer.attrs.frameIndex>7)) {
            devourer.stop();
            devourer.remove();
            devourers.splice(index,1);
            score+=200;
            updateDifficult();
        }
    });
}

//ENEMIES ATTACKING

//mutalisk attacking
function mutaliskAttack() {
    let attackPeriod = 150;
    mutalisks.forEach(function(mutalisk,index) {
        if ((mutalisk.attrs.x>=70) && (mutalisk.action!=='die')){
            mutalisk.time++;   
            if (mutalisk.time > attackPeriod && mutalisk.attrs.animation === 'idle') {
                mutalisk.action = 'attack';
                mutalisk.attrs.animation = 'idle';
                mutalisk.time -= attackPeriod;
            };             
            // mutalisk create bullet
            if (mutalisk.action === 'attack') {
                makeBullet('mutaliskBullet', mutalisk.attrs.x+40,mutalisk.attrs.y+40);
                mutalisk.action = 'move';
            };
         }
    });     
}

//devourer attacking
function devourerAttack() {
    let attackPeriod = 150;
    devourers.forEach(function(devourer,index) {
        if ((devourer.attrs.x>=70) && (devourer.action!=='die')){
            devourer.time++;   
            if (devourer.time > attackPeriod && devourer.attrs.animation === 'idle') {
                devourer.action = 'attack';
                devourer.attrs.animation = 'idle';
                devourer.time -= attackPeriod;
            };             
            // devourer create bullet
            if (devourer.action === 'attack') {
                makeBullet('devourerkBullet', devourer.attrs.x+40,devourer.attrs.y+40);
                devourer.action = 'move';
            };
         }
    });     
}

// BULLET MOVING

// mutalisk bullet moving
function moveMutaliskBullet () {
    mutaliskBullets.forEach(function(mutaliskBullet,index){
        mutaliskBullet.setX(mutaliskBullet.attrs.x + mutaliskBulletSpeed);
        if(mutaliskBullet.action!=='hit'){
        mutaliskBullet.attrs.animation = 'bullet';
        }
        if (mutaliskBullet.attrs.x > gameWidth) {
            mutaliskBullet.remove();
            mutaliskBullets.splice(index,1);
        }
    });
}

// devourer bullet moving
function moveDevourerBullet () {
    devourerBullets.forEach(function(devourerBullet,index){
        devourerBullet.setX(devourerBullet.attrs.x + devourerBulletSpeed);
        if(devourerBullet.action!=='hit'){
        devourerBullet.attrs.animation = 'bullet';
        }
        if (devourerBullet.attrs.x > gameWidth) {
            devourerBullet.remove();
            devourerBullets.splice(index,1);
        }
    });
}

// hero bullet moving
function moveHeroBullet () {
    heroBullets.forEach(function(heroBullet,index){
        heroBullet.setX(heroBullet.attrs.x - heroBulletSpeed);
        // heroBullet.attrs.animation = 'energyBullet';
        heroBullet.action='attack';
        if (heroBullet.attrs.x < -22) {
            heroBullet.remove();
            heroBullets.splice(index,1);
        }
    });
}

//BULLET HITING 

// mutalisk bullet hit
function hitMutaliskBullet() {
    mutaliskBullets.forEach(function(bullet,index){
        if (bullet.action==='hit'&&bullet.attrs.frameIndex>8) {         
            bullet.stop();
            bullet.remove();
            mutaliskBullets.splice(index,1);
        }
    });
}

// devourer bullet hit
function hitDevourerBullet() {
    devourerBullets.forEach(function(bullet,index){
        if (bullet.action==='hit'&&bullet.attrs.frameIndex>8) {         
            bullet.stop();
            bullet.remove();
            devourerBullets.splice(index,1);
        }
    });
}

// hero diying and shield regeneration
function heroDie() {   
   shield = shield + 0.01;   
   if (shield > 100) {
       shield = 100;
   }
   if (health <= 0&&hero.action!=='die') {
    health = 0;
    hero.attrs.frameIndex=0;
    hero.action='die';
    hero.attrs.animation='die';
    }   
}

//shield active animation 
function shieldActive(){
    activeShieldAnim = Date.now();
    hero.attrs.animation='shieldActive';
    hero.action='shieldActive';
}

function deactivateShield() {
    if (Date.now()-activeShieldAnim>1000&&hero.action!=='die') {
        hero.attrs.animation='idle';
        hero.action='idle';
    }
}

// TOUCHING AND HITING

// collidies between two shape
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}
 
// collidies between two rectangle
function boxCollides(pos, size, pos2, size2) {  
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}
 
// check collisions between hero and enimies
function checkCollisions() {
    
    let heroPos = [hero.attrs.x+10,hero.attrs.y+5],
        heroSize = [90,90],
        heroBulletPos = [],
        heroBulletPosPrev=[],
        heroBulletSize = [20,8],       
        mutaliskPos = [],
        mutaliskSize=[35,30],
        mutaliskBulletPos=[],
        mutaliskBulletSize = [18,18],
        overlordPos=[],
        overlordSize=[50,60],
        scourgePos=[],
        scourgeSize=[20,20],
        devourerPos = [],
        devourerSize=[50,60],
        devourerBulletPos=[],
        devourerBulletSize = [18,18],
        gameRightCorner=[gameWidth+100,0],
        enemiesSomePosition=0;


// for colisions between enemies bullets and hero
    mutaliskBullets.forEach(function(bullet,index) {
        mutaliskBulletPos=[bullet.attrs.x, bullet.attrs.y];
        if (boxCollides(mutaliskBulletPos, mutaliskBulletSize, heroPos, heroSize)) {
            if(bullet.action!=='hit'){
                bullet.action='hit';
                bullet.setY(bullet.attrs.y-20);

                bullet.attrs.animation='bulletHit';
                bullet.attrs.frameIndex=0;
                lastTouch = Date.now();
                heroFaceTakeDamage ();
                if(hero.ability!=='god'){
                    if(shield<8){
                        mutaliskHit.play();
                        health-=8-shield;
                        shield=0;
                    }
                    else {
                        shield-=8;
                        shieldHit.play();
                        shieldActive();
                    }
                }
            }
        }  
    });
    devourerBullets.forEach(function(bullet,index) {
        devourerBulletPos=[bullet.attrs.x, bullet.attrs.y];
        if (boxCollides(devourerBulletPos, devourerBulletSize, heroPos, heroSize)) {
            if(bullet.action!=='hit'){
                bullet.action='hit';
                bullet.setY(bullet.attrs.y-20);

                bullet.attrs.animation='bulletHit';
                bullet.attrs.frameIndex=0;
                lastTouch = Date.now();
                heroFaceTakeDamage ();
                if(hero.ability!=='god'){
                    if(shield<8){
                        mutaliskHit.play();
                        health-=8-shield;
                        shield=0;
                    }
                    else {
                        shield-=8;
                        shieldHit.play();
                        shieldActive();
                    }
                }
            }
        }  
    });
// for collisions between heroBullets and enimies
    heroBullets.forEach(function (bullet,index) {
        enemiesSomePosition=0;
        heroBulletPos = [bullet.attrs.x, bullet.attrs.y];
        mutalisks.forEach(function(mutalisk) {
            mutaliskPos = [mutalisk.attrs.x+15,mutalisk.attrs.y+23];
            if (mutalisk.action != 'die') {
                if (boxCollides(mutaliskPos,mutaliskSize,heroBulletPos,heroBulletSize)) {
                    console.log('mutal must die');
                    mutaliskDeath.play();
                        if(enemiesSomePosition===0) {
                        bullet.stop();
                        bullet.remove();
                        heroBullets.splice(index,1);
                        };
                        enemiesSomePosition++;
                    mutalisk.action='die';
                    mutalisk.attrs.animation='die';
                    mutalisk.frameIndex(0);
                }
            }
        });
        overlords.forEach(function(overlord,number) {
            overlordPos = [overlord.attrs.x+15,overlord.attrs.y+15];
            if (overlord.action != 'die') {
                if (boxCollides(overlordPos,overlordSize,heroBulletPos,heroBulletSize)) {
                    console.log('over must die');
                    if (enemiesSomePosition===0){
                        bullet.stop();
                        bullet.remove();

                        heroBullets.splice(index,1);
                    }
                    enemiesSomePosition++;
                    overlordDeath.play();
                    overlord.action='die';
                    overlord.attrs.animation='die';
                    overlord.frameIndex(0);                   
                }
            }
        });
        scourges.forEach(function(scourge,number) {
            scourgePos = [scourge.attrs.x+8,scourge.attrs.y+7];
            if (scourge.action != 'die') {
                if (boxCollides(scourgePos,scourgeSize,heroBulletPos,heroBulletSize)) {
                    console.log('scourge must die');
                    if (enemiesSomePosition===0){
                        bullet.stop();
                        bullet.remove();

                        heroBullets.splice(index,1);
                    }
                    enemiesSomePosition++;
                    scourgeDeath.play();
                    scourge.action='die';
                    scourge.attrs.animation='die';
                    scourge.attrs.frameIndex=0;                   
                }
            }
        });
    });        
// for collisions between hero and enemies
    mutalisks.forEach(function(mutalisk) {
        mutaliskPos = [mutalisk.attrs.x+15,mutalisk.attrs.y+23];
        if (mutalisk.action != 'die') {
            if (boxCollides(mutaliskPos,mutaliskSize,heroPos,heroSize)) {
                console.log('mutal must die');
                mutaliskDeath.play();
                mutalisk.action='die';
                mutalisk.attrs.animation='die';
                mutalisk.frameIndex(0);
                if(hero.ability!=='god'){
                    lastTouch = Date.now();
                    heroFaceTakeDamage ();
                    if(shield>=5) {
                        shield-=5;
                        shieldHit.play();
                        shieldActive();
                    }
                    else {
                        health-=5-shield;
                        shield=0;
                    }
                }
            }
        }
    });

    devourers.forEach(function(devourer) {
        devourerPos = [devourer.attrs.x+15,devourer.attrs.y+23];
        if (devourer.action != 'die') {
            if (boxCollides(devourerPos,devourerSize,heroPos,heroSize)) {
                console.log('devourer must die');
                // devourerDeath.play();
                devourer.action='die';
                devourer.attrs.animation='die';
                devourer.frameIndex(0);
                if(hero.ability!=='god'){
                    lastTouch = Date.now();
                    heroFaceTakeDamage ();
                    if(shield>=5) {
                        shield-=5;
                        shieldHit.play();
                        shieldActive();
                    }
                    else {
                        health-=5-shield;
                        shield=0;
                    }
                }
            }
        }
    });

    overlords.forEach(function(overlord) {
        overlordPos = [overlord.attrs.x+15,overlord.attrs.y+15];
        if (overlord.action != 'die') {
            if (boxCollides(overlordPos,overlordSize,heroPos,heroSize)) {
                console.log('over must die');
                overlordDeath.play();
                overlord.action='die';
                overlord.attrs.animation='die';
                overlord.frameIndex(0);
                if(hero.ability!=='god'){
                    lastTouch = Date.now();
                    heroFaceTakeDamage ();
                    if(shield>=12) {
                        shield-=12;
                        shieldHit.play();
                        shieldActive();
                    }
                    else {
                        health-=12-shield;
                        shield=0;
                    }
                }
            }
        }
    });

    scourges.forEach(function(scourge) {
        scourgePos = [scourge.attrs.x+8,scourge.attrs.y+7];
        if (scourge.action != 'die') {
            if (boxCollides(scourgePos,scourgeSize,heroPos,heroSize)) {
                console.log('scourge must die');
                scourgeDeath.play();
                scourge.action='die';
                scourge.attrs.animation='die';
                scourge.attrs.frameIndex=0;
                if(hero.ability!=='god'){
                    lastTouch = Date.now();
                    heroFaceTakeDamage ();
                    if(shield>=10) {
                        shield-=10;
                        shieldHit.play();
                        shieldActive();
                    }
                    else {
                        health-=10-shield;
                        shield=0;
                    }
                }
            }
        }
    });

    // for collisions if enemie has moved to the end of the screen
    overlords.forEach(function(overlord) {
        overlordPos = [overlord.attrs.x,overlord.attrs.y];
        if (overlord.action != 'die') {
            if (boxCollides(overlordPos,overlordSize,gameRightCorner,[10,gameHeight])) {
                console.log('over must die and destroy our planet');
                overlordDeath.play();
                overlord.action='die';
                overlord.attrs.animation='die';
                overlord.frameIndex(0);
                health-=3;
            }
        }
    });

    scourges.forEach(function(scourge) {
        scourgePos = [scourge.attrs.x,scourge.attrs.y];
        if (scourge.action != 'die') {
            if (boxCollides(scourgePos,scourgeSize,gameRightCorner,[10,gameHeight])) {
                console.log('scourge must die and destroy our planet');
                scourgeDeath.play();
                scourge.action='die';
                scourge.attrs.animation='die';
                scourge.attrs.frameIndex=0;
                health-=3;
            }
        }
    });

}
//TEXTS

let scoreText = new Konva.Text({
    x: 730,
    y: 618,
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

let pauseText = new Konva.Text({
    x: 730,
    y: 573,
    text:'Pause Game',
    fontSize:30,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    stroke:'black',
    fill:'green'
});

let muteText = new Konva.Text({
    x: 926,
    y: 605,
    text:'MUTE',
    fontSize:24,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    stroke:'black',
    fill:'green'
});

let godModeText = new Konva.Text({
    x: 378,
    y: 620,
    text:'Charge',
    fontSize:20,
    fontStyle:'bold',
    fontFamily:'Helvetica Neue',
    stroke:'black',
    fill:'red'
});
 
layer.add(scoreText);
layer.add(heroHealth);
layer.add(heroShield);
layer.add(heroBulletsText);
layer.add(pauseText);
layer.add(godModeText);
layer.add(muteText);

// increase amount of enemies
function updateDifficult () {
    if(kerrigan.action==='out'){
        difficult=score/1000;
        if ((difficult >= 0)&&(difficult<1)) {
            countEnemies=2;
        }
        if ((difficult >= 1)&&(difficult<2)) {
            countEnemies=4;
        }
        if ((difficult >= 2)&&(difficult<4)) {
            countEnemies=8;
        }
        if ((difficult >= 4)&&(difficult<9)) {
            countEnemies =12;
        }
        if ((difficult >= 9)&&(difficult<16)) {
            countEnemies =16;
        }      
        if ((difficult >= 16)&&(difficult<30)) {
            countEnemies =20;
        }   
        //you will die;)
        if ((difficult >= 30)) {
            countEnemies = 28;
        }
        while (overlords.length < countEnemies/2) {
            makeEnemy('overlord', getRandomInt(-200,-80), getRandomInt(0, 440));       
        }
        while (mutalisks.length+1 < countEnemies/3) {
             makeEnemy('mutalisk', getRandomInt(-200,-80), getRandomInt(0, 440));     
        }
        while (scourges.length+2 < countEnemies/4) {
        makeEnemy('scourge', getRandomInt(-200,-80), getRandomInt(30, 410));     
        }
        // while (devourers.length < countEnemies/2) {
        //     makeEnemy('devourer', getRandomInt(-200,-80), getRandomInt(30, 410));     
        // }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// repeating soundtrack music
function soundtrackPlay () {
    if (soundTrack.currentTime>180)
    {
        soundTrack.currentTime=107;
    }
}

// infinity game loop
let gameLoop = new Konva.Animation(function(frame) {
    if(kerrigan.action!=='out') {
        moveKerrigan ();
        movePilot();
        collisionPilot();
        diePilot();
    }
    handleInput();
    heroFaceDefault();
    deactivateShield();
    moveHeroAbility ();
    godModeOff ();
    moveOverlord();
    moveMutalisk ();
    moveScourge();
    // moveDevourer();
    mutaliskAttack();
    moveMutaliskBullet ();
    hitMutaliskBullet();
    // moveDevourerBullet ();
    // hitDevourerBullet();
    overlordDie();
    mutaliskDie();
    scourgeDie();
    // devourerDie();
    moveHeroBullet ();
    heroDie();
    heroAnimDie();
    checkCollisions();
    showHeroParam ();
    soundtrackPlay();
}, layer);

// pause button
pauseText.on('mouseenter', function () {
    this.setFill('#ce0b0b');
    stage.container().style.cursor = 'pointer';
});
pauseText.on('mouseleave', function () {
    this.setFill('green');
    stage.container().style.cursor = 'default';
});
pauseText.on('click', function() {
    pauseGame();
});

// mute button
muteText.on('mouseenter', function () {
    this.setFill('#ce0b0b');
    stage.container().style.cursor = 'pointer';
});
muteText.on('mouseleave', function () {
    if (soundTrack.volume === 0) {
        this.setFill('grey');
    }
    else {
        this.setFill('green');
    }

    stage.container().style.cursor = 'default';
});
muteText.on('click', function() {
    if (soundTrack.volume ===1) {
        muteGame(0);
        this.setFill('grey');
    }
    else {
        muteGame(1);
        this.setFill('green');
    }
});

//end game
function gameOver() { 
    soundTrack.pause();
    gameOverTrack.play();
    gameLoop.stop();
    document.getElementById('score').innerText = score;
    document.getElementById('dead').style.display = "block";
    document.getElementById('startPage').classList.remove('slideToTop');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('resumeGame').classList.add('hidden');
    document.getElementById('descriptionButton').classList.add('hidden');
    document.getElementById('reload').classList.remove('hidden');
}

// FOR INTRO SCENE
function createIntroScene() {
    makeEnemy('kerrigan', -400,260);
    createPilot(1950,50);
    createPilot(1880,130);
    createPilot(1880,380);
    createPilot(1950,460);
}
//pilots move
function createPilot (x,y) {
    const pilot = new Konva.Sprite({
        x: x, 
        y: y, 
        scaleX:.7,
        scaleY:.7,  
        image: heroImg, 
        animation: 'idle', 
        animations: animationsHero, 
        frameRate: 6,  
        frameIndex:getRandomInt(0, 7) 
    });
    pilot.action='move';
    layer.add(pilot); 
    stage.add(layer); 
    pilot.start();
    pilots.push(pilot);     
}

function movePilot() {
    if (kerrigan.action!=='out'){
        if (hero.attrs.x>650){
        hero.setX(hero.attrs.x-1);
        }
        pilots.forEach(function(pilot,index) {
            if(pilot.attrs.x>600&&pilot.action==='move') {
                pilot.setX(pilot.attrs.x-1);
            }
            else if (pilot.action!=='die') {
                pilot.action='waiting';
            }
        });
    }
}

function collisionPilot() {
    if(kerrigan.action==='attack'){
        if(scourges[0].attrs.x>pilots[0].attrs.x&&pilots[0].action!=='die'){
            pilots.forEach(function(pilot){
                pilot.attrs.frameIndex=0;
                pilot.action='die';
                pilot.attrs.animation='die';
                kerrigan.action='goAway';
            });
            scourges.forEach(function(scourge){
                scourgeDeath.play();
                scourge.action='die';
                scourge.attrs.animation='die';
                scourge.attrs.frameIndex=0;
            });
 
        }
    }
}

function diePilot(){
    pilots.forEach(function(pilot,index){
        if(pilot.action==='die'&&pilot.attrs.frameIndex===9){
            pilot.stop();
            pilot.remove();
            pilots.splice(index,1);

        }
    });
}

// kerrigan move 
function moveKerrigan () {
    if (kerrigan.attrs.x<300&&kerrigan.action==='move'&&pilots[0].action==='waiting') {
        kerrigan.setX(kerrigan.attrs.x+1);
    }
    if (kerrigan.attrs.x===300&&kerrigan.action==='move') {
        kerrigan.attrs.animation='attack';
        kerriganAttack.action='attack';
        kerrigan.attrs.frameIndex=0;
        kerrigan.attrs.frameRate=1;
        kerriganAttack();
        kerriganSpeech.play();
    }
    if (kerrigan.action==='attack'&&kerrigan.attrs.frameIndex===7){
        kerrigan.stop();
    }
    if(kerrigan.action==='goAway') {
        kerrigan.action='goBack';
        kerrigan.attrs.frameRate=6;
        kerrigan.attrs.animation='goAway';
        kerrigan.start();
    }
    if (kerrigan.action==='goBack'){
        kerrigan.setX(kerrigan.attrs.x-1);
    }
    if(kerrigan.attrs.x<-80&&kerrigan.action==='goBack') {
        kerrigan.stop();
        kerrigan.remove();
        kerrigan.action='out';
        heroSpeech.play();
        makeEnemy('overlord',-100,270);
        heroAbility.remove();
    }
}

//kerrigan attack

function kerriganAttack () {
    makeEnemy('scourge', -300,65);
    makeEnemy('scourge', -300,155);
    makeEnemy('scourge', -300,273);
    makeEnemy('scourge', -300,405);
    makeEnemy('scourge', -300,485);
    kerrigan.action='attack';
}

// BUTTON ON THE FIRST SCREEN
function startGame () {
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('startPage').classList.add('slideToTop');
    document.getElementById('startGame').classList.add('started');
    gameLoop.start();
    soundTrack.play();
    createIntroScene();
}
function pauseGame () {
    document.getElementById('startPage').classList.remove('slideToTop');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('resumeGame').classList.remove('hidden');
    gameLoop.stop();
    soundTrack.pause();
}
function resumeGame () {
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('startPage').classList.add('slideToTop');
    gameLoop.start();
    soundTrack.play();
}
function descriptionButton () {
    document.getElementById('startPage').classList.add('slideToTop');
    document.getElementById('descriptionPage').classList.remove('slideToTop');
}
function backButton () {
    document.getElementById('startPage').classList.remove('slideToTop');
    document.getElementById('descriptionPage').classList.add('slideToTop');
}

function reloadPage () {
    document.location.reload();
}
