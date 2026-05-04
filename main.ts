// --- 1. Game State & Graphics ---
let isGameStarted = false
scene.setBackgroundColor(9) // Sky Blue

// The Iconic Flappy Bird Sprite
let birdImg = img`
    . . . . . . . . . . . . . . . . 
    . . . . . . 5 5 5 5 5 . . . . . 
    . . . . . 5 5 5 5 5 5 5 . . . . 
    . . . . 5 5 5 5 1 1 f f 1 . . . 
    . . . . 5 5 5 5 1 1 f f 1 . . . 
    . . . 5 5 5 5 5 5 5 5 5 1 . . . 
    . . 1 1 1 5 5 5 5 5 5 5 . . . . 
    . 1 1 1 1 1 5 5 5 5 5 5 . . . . 
    . 1 1 1 1 1 5 5 5 2 2 2 2 . . . 
    . . 1 1 1 5 5 5 2 2 2 2 2 2 . . 
    . . . 5 5 5 5 5 5 2 2 2 2 . . . 
    . . . . 5 5 5 5 5 5 5 5 . . . . 
    . . . . . . . . . . . . . . . . 
`

// The Tube Sprite (16x32)
let tubeImg = img`
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . e e e e e e e e e e e e e . . 
    . e e e e e e e e e e e e e . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . e e e e e e e e e e e e e . . 
    . e e e e e e e e e e e e e . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
    . 7 7 7 6 7 7 7 7 7 7 7 7 7 . . 
`

// --- 2. Create the Bird ---
let bird = sprites.create(birdImg, SpriteKind.Player)
bird.setPosition(30, 60)
bird.ay = 0 // No gravity until game starts

// --- 3. Start Screen Menu ---
game.showLongText("FLAPPY BIRD\\nPress A to Flap", DialogLayout.Center)
isGameStarted = true
bird.ay = 450 // Enable gravity once text is cleared
info.setScore(0)

// --- 4. Controls ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (isGameStarted) {
        bird.vy = -120
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    }
})

// --- 5. Obstacle Spawning ---
game.onUpdateInterval(1800, function () {
    if (!isGameStarted) return

    let gapY = Math.randomRange(30, 90)

    // Create Top Tube
    let topPipe = sprites.create(tubeImg, SpriteKind.Enemy)
    topPipe.setFlag(SpriteFlag.AutoDestroy, true)
    topPipe.vx = -60
    topPipe.scale = 4
    topPipe.setPosition(180, gapY - 85)

    // Create Bottom Tube
    let bottomPipe = sprites.create(tubeImg, SpriteKind.Enemy)
    bottomPipe.setFlag(SpriteFlag.AutoDestroy, true)
    bottomPipe.vx = -60
    bottomPipe.scale = 4
    bottomPipe.setPosition(180, gapY + 85)

    // Points Sound
    music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
    info.changeScoreBy(1)
})

// --- 6. Collision & Death ---
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    die()
})

function die() {
    isGameStarted = false
    music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
    game.over(false)
}

// --- 7. Boundary Check ---
game.onUpdate(function () {
    if (bird.y > 120 || bird.y < 0) {
        die()
    }
})

// --- 8. Moving Ground Effect ---
// This draws a line at the bottom that moves to simulate speed// --- Fixed Moving Ground Effect ---
let ground = sprites.create(img`
    e e e e e e e e e e e e e e e e 
    d d d d d d d d d d d d d d d d 
`, SpriteKind.Food)
ground.setPosition(80, 120)
ground.scale = 10

game.onUpdate(function () {
    if (isGameStarted) {
        ground.x -= 2
        if (ground.right < 0) {
            ground.left = 160
        }
    }
})