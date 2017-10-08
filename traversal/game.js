var game = {
  canvas: document.createElement("canvas"),
  stack: [],
  queue: [],
  init: function (options) {
    // options or defaults
    this.options = {
      elementWidth: options.elementWidth || 1,
      elementHeight: options.elementHeight || 1,
      map: options.map || {
        width: 100,
        height: 100,
        scale: 5,
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
        color: "#F4511E",
      }
    }

    this.options.mode = "play";
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
    $(this.canvas).on("mousemove", this.onMoveEvent);
    $(this.canvas).on("click", this.onClickEvent);
  },
  setMode: function(mode){
    this.options.mode = mode;
  },
  setWall: function (pos) {
    // TODO: check if the vertex is correct
    // console.log("pos", pos)
    pos = getScaledPos(pos, game.options.map.scale);
    this.walls.push([pos.x, pos.y]);
    // console.log("pos", pos)
    this.context.fillStyle = this.options.wall.color;
    this.context.fillRect(pos.x, pos.y, this.options.elementWidth*this.options.map.scale, this.options.elementHeight*this.options.map.scale);
  },
  setGoal: function (pos = {}) {
    pos = getScaledPos(pos, game.options.map.scale);
    this.options.goal.x = pos.x;
    this.options.goal.y = pos.y;
    this.context.fillStyle = this.options.goal.color;
    this.context.fillRect(pos.x, pos.y, this.options.elementWidth*this.options.map.scale, this.options.elementHeight*this.options.map.scale);
  },
  generateWalls: function (optns = {}) {
    this.context.fillStyle = optns.color;
    _.each(this.walls, function (wall) {
      this.context.fillRect(wall.x, wall.y, this.options.elementWidth*this.options.map.scale, this.options.elementHeight*this.options.map.scale);
    })
  },
  generatePlayer: function (optns = {}) {
    this.context.fillStyle = optns.color
    this.context.fillRect(optns.x, optns.y, this.options.elementWidth*this.options.map.scale, this.options.elementHeight*this.options.map.scale);
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
    this.nextMoves();
  },
  stop: function () { },
  onMoveEvent: function (e) {
    // scaling ref: http://devlog.disco.zone/2016/07/22/canvas-scaling/
    pos = game.canvas.relMouseCoords(e);
    // console.log(pos);
    if (game.options.mode == "generate") {
      if(game.options.mousePress)
        game.setWall(pos);
    }
  },
  onClickEvent: function(e){
    pos = game.canvas.relMouseCoords(e);
    if (game.options.mode == "play") {
      game.setGoal(pos);
    }
  },
  nextMoves: function(player = {}){
    next = [];
    p = player || this.options.player;
    for(i = -1; i < 2; i++){
      if ((p.x + i < 0) || (p.x + i) > this.options.map.width){
        continue;
      }

      if (!(p.y - 1 < 0))
        next.push([p.x + i, p.y - 1])
      if(i != 0)
        next.push([p.x + i, p.y])
      if ((p.y + 1) <= this.options.map.height)
        next.push([p.x + i, p.y + 1])
    }
    next = _.reject(next, function(move){
      return _.find(this.walls, function(wall){
        return (wall[0] == move[0] && wall[1] == move[1]);
      })
    });
    console.log("next moves", next);
    return next;
  },
  getPath: function(type){
    eval("this."+type)();
  },
  dfs: function(){
    console.log("dfs")
    if (!game.options.goal && !game.options.goal.x){
      game.setGoal([95,95])
    }

    visited = [];
    game.stack.push([game.options.player.x, game.options.player.y]);

    while(game.stack.length != 0){
      // peek
      current = game.stack[game.stack.length - 1];

      if (current[0] == game.options.goal.x && current[1] == game.options.goal.y){
        console.log("traverse", game.stack);
        return game.stack;
      }
      else {
        exists = _.find(visited, function(a){
          return (a[0] == current[0] && a[1] == current[1])
        })
        if(!exists){
          visited.push(current);

          nextNode = _.find(game.nextMoves({ x: current[0], y: current[1] }), function(a){
            return !(a[0] == current[0] && a[1] == current[1])
          })
          console.log("whats next", nextNode)
          if(nextNode){
            game.stack.push(nextNode);
            continue;
          } else {
            game.stack.pop()
          }
        }
      }
    }

  }
}

