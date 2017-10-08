$(function(){
  game.start();

  $("#gameMode").on("change", function(){
    game.setMode($("#gameMode").val());
  })
})

function search(){
  game.getPath("dfs");
}