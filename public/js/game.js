var GameInit = function () {
    var GAME_TYPE = 'Canvas';
    var score = 0;
    Crafty.init(640,480);
    Crafty.canvas.init();
    //preload the needed assets
    Crafty.load(['img/defender.png', 'img/invader-2.png'], function () {
        //splice the spritemap
        Crafty.sprite(28, "img/defender.png", {
            defender: [0, 0]
        });
        Crafty.sprite(16, "img/invader-2.png", {
            invader: [0, 0]
        });
        //start the main scene when loaded
        Crafty.scene("main");
    }, function (info) {
        console.log(info);
    }, function (error) {
        console.log('error'); 
    });


    Crafty.scene("main", function () {
        console.log('load main');

        Crafty.c("Enemy", {
            Enemy: function () {
                this.requires("2D, SpriteAnimation, Collision, Grid")
                    .attr({
                        x: 120,
                        y: 40,
                        xspeed: 24,
                        yspeed: 0
                    })
                    .animate('invader_open', 0, 0, 1 )
                    .animate('invader_open', 40, -1)
                    .bind('EnterFrame', function(frame){
                        if(this.x > (Crafty.viewport.width - 26 ) && this.xspeed > 0 ){
                            this.y = this.y + 20;
                            this.xspeed = -1  * this.xspeed;
                        }
                        if(this.xspeed < 16 && this.x < 5 ){
                            this.y = this.y +20;
                            this.xspeed = -1  * this.xspeed;
                        }
                        if((frame.frame % 10)==0){
                            this.x+= this.xspeed; 
                        }
                    });
            }
        });
        Crafty.c('PlayerControls', {
            init: function() {
                this.requires('Twoway');
            },
            playerControls: function(speed) {
                this.twoway(speed);
                return this;
            }
    }); 
        Crafty.c('Starship', {
            Starship: function () {
                this.requires("2D, SpriteAnimation, Collision, Grid, WiredHitBox");
                console.log('starship')
                this.collision( [1,28], [1,19], [3, 19],[3, 17],[10,17], [11,13], [13,14], [13,12], [14,12], [14,13],[17,14], [17,17],[24,17],[24,20],[26,20],[26,28]  );
                return this;
            }
        });
        Crafty.c('Fire', {
            _key: Crafty.keys.SPACE,
            init: function() { 
                this.requires('Grid')
                .bind('KeyDown', function(e) { 
                    if (e.key !== this._key) {
                        return;
                    }
                    
                    Crafty.e("2D, DOM, Color, bullet")
                        .attr({
                            x: this._x + 32, 
                            y: this._y, 
                            w: 2, 
                            h: 4, 
                            rotation: 0, 
                            xspeed: 0, 
                            yspeed: 5
                        })
                        .color("rgb(255, 0, 0)")
                        .bind("EnterFrame", function() {

                            this.x += this.xspeed;
                            this.y -= this.yspeed;
                            
                            //destroy if it goes out of bounds
                            if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                                this.destroy();
                            }
                        });
                });
            },
            blasterFire: function(key) {
                this._key = key;
                return this;
            }

        });
/*
        var player = Crafty.e('2D, ' + GAME_TYPE + ', defender, Starship, Collision, SpriteAnimation').attr({
            xspeed: 0,
            yspeed: 0,
            decay: 0.9,
            x: Crafty.viewport.width / 2,
            y: Crafty.viewport.height - 122 
        }).bind('EnterFrame', function (frame) {
     
        })
        .origin('center')
        .Starship() ;
*/
        var player = Crafty.e("2D, DOM, Canvas, defender, Starship, PlayerControls, Collision, SpriteAnimation, RightControls, Keyboard").attr({
            xspeed: 0,
            yspeed: 0,
            decay: 0.9,
            x: Crafty.viewport.width / 2,
            y: Crafty.viewport.height - 122,
            score: 0
        }).origin("center").bind('keydown', function() {
            console.log('key');
        })
        .playerControls(2)
        .Starship();
        Crafty.c("Score", {
            init: function () {
                this.requires('2D, ' + GAME_TYPE + ', Text');
                this.attr({ x: 210, y: 0, w: 100, h: 20, points: 0 });
                this.textColor("#FFFFFF").textFont({ size: '12px' });
                this.text('0');
                this.bind("EnterFrame", function () {
                    this.text('Score: ' + score);
                });
            }
        });
        Crafty.e('Score').init(); 
         console.log(player);
        Crafty.e('2D, ' + GAME_TYPE + ', invader, Enemy, Collision').Enemy();

 
 
    });
};