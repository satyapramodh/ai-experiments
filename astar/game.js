var game = {
  canvas: document.createElement("canvas"),
  init: function (options) {
    // options or defaults
    this.options = {
      elementWidth: options.elementWidth || 1,
      elementHeight: options.elementHeight || 1,
      map: options.map || {
        width: 400,
        height: 400,
        color: "#7CB342"
      },
      player: options.player || {
        x: 0,
        y: 0,
        color: "#4527A0"
      },
      wall: options.wall || {
        color: "#5D4037"
      }
    }

    this.options.mode = "generate";
    this.walls = [];
    // generate map
    this.generateMap(this.options.map)
    // generate walls
    this.generateWalls(this.options.wall)
    // generate player
    this.generatePlayer(this.options.player)

    // set listeners
    $(this.canvas).on("mousedown", function(){
      if(game.options.mode == "generate")
        game.options.generateWallMode = true;
    });
    $(this.canvas).on("mouseup", function () {
      if(game.options.mode == "generate")
        game.options.generateWallMode = false;
    });
    $(this.canvas).on("mousemove", this.onClickEvent);
  },
  setMode: function(mode){
    this.options.mode = mode;
  },
  setWall: function (x, y) {
    // TODO: check if the vertex is correct
    this.walls.push([x, y]);
    this.context.fillStyle = this.options.wall.color;
    this.context.fillRect(x, y, this.options.elementWidth, this.options.elementHeight);
  },
  generateWalls: function (optns = {}) {
    this.context.fillStyle = optns.color;
    _.each(this.walls, function (wall) {
      this.context.fillRect(wall.x, wall.y, this.options.elementWidth, this.options.elementHeight);
    })
  },
  generatePlayer: function (optns = {}) {
    this.context.fillStyle = optns.color
    this.context.fillRect(optns.x, optns.y, this.options.elementWidth, this.options.elementHeight);
  },
  generateMap: function (optns = {}) {
    this.canvas.width = optns.width;
    this.canvas.height = optns.height;
    this.context = this.canvas.getContext("2d");
    this.context.scale(8,8)
    this.context.fillStyle = optns.color;
    this.context.fillRect(0, 0, optns.width, optns.height)
    $(".map").prepend(this.canvas);
  },
  start: function (options = {}) {
    this.init(options);
  },
  stop: function () { },
  onClickEvent: function (e) {
    // scaling ref: http://devlog.disco.zone/2016/07/22/canvas-scaling/
    if (game.options.generateWallMode){
      pos = game.canvas.relMouseCoords(e);
      console.log(pos);
      game.setWall(Math.round(pos.x / 8), Math.round(pos.y / 8));
    }
  }
}

