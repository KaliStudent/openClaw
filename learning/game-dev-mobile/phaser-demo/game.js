/**
 * Tap Rush - A mobile-first casual game demo
 * 
 * Gameplay: Colored circles appear. Tap them before they vanish.
 * Miss 3 and it's game over. Difficulty scales with time.
 * 
 * Built with Phaser 3 - demonstrates:
 * - Mobile-responsive canvas
 * - Touch input
 * - Tweens/animations
 * - Scene management
 * - Progressive difficulty
 * - LocalStorage persistence
 */

// --- Scenes ---

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    create() {
        // Generate circle textures procedurally
        const colors = {
            red: 0xff4757,
            blue: 0x3742fa,
            green: 0x2ed573,
            gold: 0xffd700
        };

        for (const [name, color] of Object.entries(colors)) {
            const gfx = this.make.graphics();
            gfx.fillStyle(color, 1);
            gfx.fillCircle(40, 40, 38);
            gfx.fillStyle(0xffffff, 0.3);
            gfx.fillCircle(30, 30, 12);
            gfx.generateTexture(`target_${name}`, 80, 80);
            gfx.destroy();
        }

        // Particle texture
        const p = this.make.graphics();
        p.fillStyle(0xffffff, 1);
        p.fillCircle(4, 4, 4);
        p.generateTexture('particle', 8, 8);
        p.destroy();

        this.scene.start('Menu');
    }
}


class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // Background gradient effect
        const bg = this.add.rectangle(w/2, h/2, w, h, 0x16213e);

        // Title
        this.add.text(w/2, h * 0.28, 'TAP RUSH', {
            fontSize: `${Math.min(w * 0.12, 64)}px`,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(w/2, h * 0.38, 'Tap circles before they vanish!', {
            fontSize: `${Math.min(w * 0.045, 20)}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#a0a0c0',
            align: 'center'
        }).setOrigin(0.5);

        // Play button
        const btn = this.add.rectangle(w/2, h * 0.55, 180, 56, 0x3742fa, 1)
            .setInteractive({ useHandCursor: true });
        const btnLabel = this.add.text(w/2, h * 0.55, 'PLAY', {
            fontSize: '26px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [btn, btnLabel],
            scaleX: 1.05, scaleY: 1.05,
            duration: 700, yoyo: true, repeat: -1,
            ease: 'Sine.easeInOut'
        });

        btn.on('pointerdown', () => this.scene.start('Game'));

        // High score
        const best = localStorage.getItem('tapRush_best') || 0;
        if (best > 0) {
            this.add.text(w/2, h * 0.7, `Best: ${best}`, {
                fontSize: '20px', fontFamily: 'Arial', color: '#ffd700'
            }).setOrigin(0.5);
        }
    }
}


class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.spawnDelay = 1200;
        this.lifetime = 2200;
        this.active = true;

        // UI
        this.scoreLabel = this.add.text(16, 16, '0', {
            fontSize: '28px', fontFamily: 'Arial', fontStyle: 'bold', color: '#fff'
        });
        this.livesLabel = this.add.text(w - 16, 16, this.heartsString(), {
            fontSize: '24px', fontFamily: 'Arial'
        }).setOrigin(1, 0);
        this.levelLabel = this.add.text(w/2, 16, 'Lv 1', {
            fontSize: '16px', fontFamily: 'Arial', color: '#888'
        }).setOrigin(0.5, 0);

        // Spawn loop
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawn,
            callbackScope: this,
            loop: true
        });

        // Level up every 8s
        this.time.addEvent({
            delay: 8000,
            callback: this.levelUp,
            callbackScope: this,
            loop: true
        });
    }

    heartsString() {
        return '\u2764\uFE0F'.repeat(this.lives) + '\uD83D\uDDA4'.repeat(3 - this.lives);
    }

    spawn() {
        if (!this.active) return;
        const w = this.scale.width;
        const h = this.scale.height;
        const pad = 50;

        const x = Phaser.Math.Between(pad, w - pad);
        const y = Phaser.Math.Between(70, h - pad);

        const types = ['target_red', 'target_blue', 'target_green', 'target_gold'];
        const weights = [40, 30, 20, 10];
        const points = [1, 1, 2, 5];
        const idx = this.weightedRandom(weights);

        const img = this.add.image(x, y, types[idx])
            .setScale(0)
            .setInteractive();

        // Pop in
        this.tweens.add({
            targets: img, scale: 1,
            duration: 120, ease: 'Back.easeOut'
        });

        // Gold pulses
        if (idx === 3) {
            this.tweens.add({
                targets: img, scale: 1.15,
                duration: 250, yoyo: true, repeat: -1
            });
        }

        // Auto-miss after lifetime
        const lt = idx === 3 ? this.lifetime * 0.6 : this.lifetime;
        const timer = this.time.delayedCall(lt, () => {
            if (!img.active) return;
            this.miss(img);
        });

        // Tap
        img.on('pointerdown', () => {
            if (!img.active) return;
            timer.destroy();
            this.hit(img, points[idx]);
        });
    }

    hit(img, pts) {
        this.score += pts;
        this.scoreLabel.setText(this.score.toString());

        // Float text
        const ft = this.add.text(img.x, img.y, `+${pts}`, {
            fontSize: pts >= 5 ? '26px' : '20px',
            fontFamily: 'Arial', fontStyle: 'bold',
            color: pts >= 5 ? '#ffd700' : '#2ed573'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: ft, y: img.y - 40, alpha: 0,
            duration: 500, onComplete: () => ft.destroy()
        });

        // Quick pop
        this.tweens.add({
            targets: img, scale: 1.3, alpha: 0,
            duration: 100, onComplete: () => img.destroy()
        });

        if (navigator.vibrate) navigator.vibrate(8);
    }

    miss(img) {
        this.lives--;
        this.livesLabel.setText(this.heartsString());
        this.cameras.main.shake(150, 0.01);
        if (navigator.vibrate) navigator.vibrate(40);

        this.tweens.add({
            targets: img, scale: 0, alpha: 0,
            duration: 150, onComplete: () => img.destroy()
        });

        if (this.lives <= 0) this.gameOver();
    }

    levelUp() {
        if (!this.active) return;
        this.level++;
        this.levelLabel.setText(`Lv ${this.level}`);
        this.spawnDelay = Math.max(400, this.spawnDelay - 80);
        this.lifetime = Math.max(900, this.lifetime - 120);
        this.spawnTimer.delay = this.spawnDelay;
    }

    gameOver() {
        this.active = false;
        this.spawnTimer.destroy();

        const best = parseInt(localStorage.getItem('tapRush_best') || '0');
        const isNew = this.score > best;
        if (isNew) localStorage.setItem('tapRush_best', this.score.toString());

        this.time.delayedCall(400, () => {
            this.scene.start('GameOver', {
                score: this.score,
                level: this.level,
                newBest: isNew
            });
        });
    }

    weightedRandom(weights) {
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < weights.length; i++) {
            r -= weights[i];
            if (r <= 0) return i;
        }
        return weights.length - 1;
    }
}


class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    create(data) {
        const w = this.scale.width;
        const h = this.scale.height;
        const { score, level, newBest } = data;

        this.add.text(w/2, h * 0.2, 'GAME OVER', {
            fontSize: `${Math.min(w * 0.1, 44)}px`,
            fontFamily: 'Arial', fontStyle: 'bold', color: '#ff4757'
        }).setOrigin(0.5);

        this.add.text(w/2, h * 0.34, `${score}`, {
            fontSize: '48px', fontFamily: 'Arial', fontStyle: 'bold', color: '#fff'
        }).setOrigin(0.5);

        this.add.text(w/2, h * 0.42, `Level ${level}`, {
            fontSize: '18px', fontFamily: 'Arial', color: '#aaa'
        }).setOrigin(0.5);

        if (newBest) {
            const hs = this.add.text(w/2, h * 0.52, 'NEW BEST!', {
                fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold', color: '#ffd700'
            }).setOrigin(0.5);
            this.tweens.add({ targets: hs, scale: 1.1, duration: 400, yoyo: true, repeat: -1 });
        }

        // Again
        const btn = this.add.rectangle(w/2, h * 0.68, 200, 52, 0x2ed573).setInteractive();
        this.add.text(w/2, h * 0.68, 'PLAY AGAIN', {
            fontSize: '22px', fontFamily: 'Arial', fontStyle: 'bold', color: '#fff'
        }).setOrigin(0.5);
        btn.on('pointerdown', () => this.scene.start('Game'));

        // Menu
        const mb = this.add.text(w/2, h * 0.8, 'Menu', {
            fontSize: '18px', fontFamily: 'Arial', color: '#aaa'
        }).setOrigin(0.5).setInteractive();
        mb.on('pointerdown', () => this.scene.start('Menu'));
    }
}


// --- Game Config ---
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#1a1a2e',
    scene: [BootScene, MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
