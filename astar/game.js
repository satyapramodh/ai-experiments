var game = {
  canvas: document.createElement("canvas"),
  init: function (options) {
    // options or defaults
    this.options = {
      elementWidth: options.elementWidth || 1,
      elementHeight: options.elementHeight || 1,
      map: options.map || {
        width: 50,
        height: 50,
        scale: 8,
        color: "#7CB342"
      },
      player: options.player || {
        x: 0,
        y: 0,
        color: "#4527A0"
      },
      wall: options.wall || {
        color: "#5D4037"
      },
      goal: options.goal || {
        color: "#F4511E"
      }
    }

    this.options.mode = "none";
    this.walls = [];
    // generate map
    this.generateMap(this.options.map)
    // generate walls
    this.generateWalls(this.options.wall)
    // generate player
    this.generatePlayer(this.options.player)

    // set listeners
    $(this.canvas).on("mousedown", function(){
      game.options.mousePress = true;
    });
    $(this.canvas).on("mouseup", function () {
      game.options.mousePress = false;
    });
    $(this.canvas).on("mousemove", this.onClickEvent);
  },
  setMode: function(mode){
    this.options.mode = mode;
  },
  setWall: function (x, y) {
    // TODO: check if the vertex is correct
    pos = getScaledPos(pos, game.options.map.scale);
    this.walls.push([pos.x, pos.y]);
    this.context.fillStyle = this.options.wall.color;
    this.context.fillRect(pos.x, pos.y, this.options.elementWidth, this.options.elementHeight);
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
    this.canvas.width = optns.width * optns.scale;
    this.canvas.height = optns.height * optns.scale;
    this.context = this.canvas.getContext("2d");
    this.context.scale(optns.scale, optns.scale)
    this.context.fillStyle = optns.color;
    this.context.fillRect(0, 0, optns.width * optns.scale, optns.height * optns.scale)
    $(".map").prepend(this.canvas);
  },
  start: function (options = {}) {
    this.init(options);
  },
  stop: function () { },
  setGoal: function(pos = {}){
    pos = getScaledPos(pos, game.options.map.scale);
    this.goal = [pos.x, pos.y];
    this.context.fillStyle = this.options.goal.color;
    this.context.fillRect(pos.x, pos.y, this.options.elementWidth, this.options.elementHeight);
  },
  onClickEvent: function (e) {
    // scaling ref: http://devlog.disco.zone/2016/07/22/canvas-scaling/
    pos = game.canvas.relMouseCoords(e);
    console.log(pos);
    if (game.options.mode == "generate") {
      if(game.options.mousePress)
        game.setWall(pos.x, pos.y);
    } else{
      if (game.options.mousePress)
        game.setGoal(pos);
    }

  }
}

