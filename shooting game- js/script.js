const introSong = new Audio("./music/introSong.mp3")
const gameOverSong = new Audio("./music/gameOver.mp3")
const shooting = new Audio("./music/shoooting.mp3")
const heavyWeaponSound = new Audio("./music/heavyWeapon.mp3")
const hugeWeaponSound = new Audio("./music/hugeWeapon.mp3")
const killEnemy = new Audio("./music/killEnemy.mp3")



introSong.play()



const canvas = document.createElement("canvas");

canvas.width = innerWidth
canvas.height = innerHeight

document.querySelector(".myGame").appendChild(canvas);

const context = canvas.getContext("2d");

let difficulty = 2
let lightWeapon = 10
let heavyWeapon = 20
let hugeWeapon = 50
let score = 0
const form = document.querySelector("form")
let scoreBoard = document.querySelector(".scoreBoard")







// ----------------------------------------submit---------------------------------------

document.querySelector("input").addEventListener("click",(e)=>{
e.preventDefault()

animation()
introSong.pause()

form.style.display = "none"
scoreBoard.style.display = "inline"

const diffValue = document.querySelector("#difficulty").value


if (diffValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return difficulty = 2
}


if (diffValue === "Medium") {
    setInterval(spawnEnemy, 1500);
    return difficulty = 4
    
}

if (diffValue ==="Hard") {
    setInterval(spawnEnemy, 1000);
    return difficulty = 7

    
}

if (diffValue === "Insane") {
    setInterval(spawnEnemy, 750);
    return difficulty = 10
    
}

})


// ------------------------------------ endScreen --------------------------------------



function gameOver() {
    gameOverSong.play()
    killEnemy.pause()
    shooting.pause()
    introSong.pause()
    hugeWeaponSound.pause()
    heavyWeaponSound.pause()
    let gameOverDiv = document.createElement("div")
    let gameOverBtn = document.createElement("button")
    let highScore = document.createElement("div")


    highScore.innerHTML = `Score :${
        localStorage.getItem("highScore") ? localStorage.getItem("highScore"):score
    }`


    const oldHighScore = localStorage.getItem("highScore") && localStorage.getItem("highScore")

    if (oldHighScore < score) {
        localStorage.setItem("highScore",score)
        highScore.innerHTML = `High Score ${score}`
    }


    gameOverDiv.appendChild(highScore)
    gameOverDiv.appendChild(gameOverBtn)
gameOverBtn.innerText = "Play Again"

gameOverBtn.onclick = ()=>{
    window.location.reload()
}
gameOverDiv.classList.add("gameover")

document.querySelector("body").appendChild(gameOverDiv)

}






//---------------------------------------------------------------------------------------

let playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}


// ----------------------------------palyer calss---------------------------------------

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }


    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);

        context.stroke()

        context.fillStyle = this.color
        context.fill()
    }

}
//-----------------------------------




// --------------------------weapon class------------------------------

class Weapon {
    constructor(x, y, radius, color,velocity,damage) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.damage = damage
    }


    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);

        context.stroke()

        context.fillStyle = this.color
        context.fill()
    }


    update(){
        this.draw()
this.x += this.velocity.x
this.y += this.velocity.y
    }

}

//------------------------------


// --------------------------enemy class------------------------------

class Enemy {
    constructor(x, y, radius, color,velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }


    draw() {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);

        context.stroke()

        context.fillStyle = this.color
        context.fill()
    }


    update(){
        this.draw()
this.x += this.velocity.x
this.y += this.velocity.y
    }

}

//------------------------------




// --------------------------HugeWeapon class------------------------------

class HugeWeapon {
    constructor(x, y, color,) {
        this.x = x
        this.y = y
        this.color = color
    }


    draw() {
        context.beginPath()
        context.fillStyle = this.color
        context.fillRect(this.x,this.y,200,canvas.height);
        
    }


    update(){
        this.draw()
this.x += 20
    }

}

//------------------------------


// --------------------------particle class------------------------------

let friction = 0.99


class Particle {
    constructor(x, y, radius, color,velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }


    draw() {
        context.save()
        context.globalAlpha = this.alpha;
        context.beginPath()
        context.arc(this.x, this.y, this.radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);

        context.stroke()

        context.fillStyle = this.color
        context.fill()
        context.restore();
        
    }


    update(){
        
        this.draw()
this.x += this.velocity.x
this.y += this.velocity.y
this.alpha -= 0.01
this.velocity.x *= friction
this.velocity.y *= friction
    }

}

//------------------------------




const enemies = []
const weapons = []
const megaWeapon = []
const particles = []
let me = new Player(playerPosition.x, playerPosition.y, 15, `white`)





function spawnEnemy(){
const enemySize = Math.random()*(40-5)+5

const enemyColor =`hsl(${Math.floor(Math.random()*360)},100%,50%)`

let random;



if (Math.random() < 0.5) {
    random={
        x:Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
        y: Math.random() * canvas.height,
    }
}else{
    random={
        x: Math.random()* canvas.width,
        y:Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    }
}


const angle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x,
    )



const velocity = {
    x: Math.cos(angle) * difficulty,
    y: Math.sin(angle) * difficulty,
}


    enemies.push(new Enemy(random.x,random.y,enemySize, enemyColor,velocity))
}


setInterval(spawnEnemy, 1000);






let animationId;

function animation() {
  animationId =  requestAnimationFrame(animation)

context.fillStyle = "rgba(49,49,49,0.2)"

context.fillRect(0, 0, canvas.width, canvas.height)

    me.draw()


particles.forEach((particle,particleInd)=>{
    if (particle.alpha <= 0) {
        particles.splice(particleInd,1)
    }else{

        particle.update()
    }
})


megaWeapon.forEach((bigWeapon,bigWeaponInd)=>{
    if (bigWeapon.x > canvas.width) {
        megaWeapon.splice(bigWeaponInd,1)
    }else{
        bigWeapon.update()
    }
})


    weapons.forEach((weapon,weaponInd)=>{
        weapon.update()


if (weapon.x + weapon.radius < 1 || weapon.y + weapon.radius < 1 || weapon.x - weapon.radius > canvas.width || weapon.y + weapon.radius > canvas.height) {
   weapons.splice(weaponInd , 1) 
}


    })
    
  enemies.forEach((enemy,enemyInd)=>{
enemy.update()

const distanceBetweenEnemyAndPlayer = Math.hypot(me.x - enemy.x,me.y - enemy.y)



if (distanceBetweenEnemyAndPlayer - me.radius - enemy.radius < 1) {
cancelAnimationFrame(animationId)
gameOver()

}

megaWeapon.forEach((bigWeapon)=>{
const distanceBetweenEnemyAndHugeWeapon = bigWeapon.x - enemy.x

if (distanceBetweenEnemyAndHugeWeapon <= 200 && distanceBetweenEnemyAndHugeWeapon >= -200) {
  score += 10
  scoreBoard.innerHTML = `Score : ${score}`
    setTimeout(() => {
        
        enemies.splice(enemyInd,1)
        
    }, 0);
}

})


weapons.forEach((weapon,weaponInd)=>{

    const distanceBetweenEnemyAndWeapon = Math.hypot(weapon.x - enemy.x,weapon.y - enemy.y)


if (distanceBetweenEnemyAndWeapon - weapon.radius - enemy.radius < 1) {
 
if (enemy.radius > weapon.damage + 5) {

    gsap.to(enemy,{
       radius : enemy.radius - weapon.damage,
    })
    
    weapons.splice(weaponInd,1)
    
}else{
    for (let i = 0; i < enemy.radius * 5; i++) {
        particles.push(new Particle(weapon.x,weapon.y,Math.random()*2,enemy.color,{x:(Math.random()-0.5 )* (Math.random()*5),y:(Math.random()-0.5 )* (Math.random()*5) }))
        
    }
    score += 10

    scoreBoard.innerHTML = `Score : ${score}`
    setTimeout(() => {
        killEnemy.play()
        enemies.splice(enemyInd,1)
      weapons.splice(weaponInd,1)
   }, 0);
}
 
  
}

})

  })
}




canvas.addEventListener("click",(e)=>{
    shooting.play()
    
const angle = Math.atan2(
    e.clientY - canvas.height /2,
    e.clientX - canvas.width /2,
    )



const velocity = {
    x: Math.cos(angle)*7,
    y: Math.sin(angle)*7,
}

weapons.push(new Weapon(canvas.width/2,canvas.height/2,7, `white`,velocity,lightWeapon))

})




canvas.addEventListener("contextmenu",(e)=>{
    
    e.preventDefault()

    heavyWeaponSound.play()
if (score <= 0) {
    return;
}

score -= 2

scoreBoard.innerHTML = `Score : ${score}`

    const angle = Math.atan2(
        e.clientY - canvas.height /2,
        e.clientX - canvas.width /2,
        )
    
    
    
    const velocity = {
        x: Math.cos(angle)*3,
        y: Math.sin(angle)*3,
    }
    
    weapons.push(new Weapon(canvas.width/2,canvas.height/2,15, `cyan`,velocity,heavyWeapon))
    
    })


    addEventListener("keypress",(e)=>{
hugeWeaponSound.play()
        if (score <= 0) {
            return;
        }
        
        score -= 50
        
        scoreBoard.innerHTML = `Score : ${score}`

if (e.key === " ") {
    megaWeapon.push(new HugeWeapon(0,0, `#00ff08`,hugeWeapon))
}
    })




addEventListener("resize",()=>{
canvas.width = innerWidth
canvas.height = innerHeight
})



