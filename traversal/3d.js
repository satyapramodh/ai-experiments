var scene = new THREE.Scene();
scene.background = new THREE.Color(0x7CB342);
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// cube

// var geometry = new THREE.SphereGeometry(0.5, 20, 20);
var geometry = new THREE.TetrahedronBufferGeometry(0.5, 0);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);
var canvas = renderer.domElement;
// var mousePosition = new THREE.Vector2();
var canvasPosition = $(canvas).position();
scene.add(cube);

camera.position.z = 5;

var direction = new THREE.Vector3(0, 0, 0);

function animate() {
  cube.position.add(direction)
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// add object to scene
document.body.addEventListener("click", getClicked3DPoint, false);

function addCube(x,y,z) {
  var geometry = new THREE.CubeGeometry(0.5, 0.5, 0.5 );

  var material = new THREE.MeshBasicMaterial({ color: 0x0200ac });

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.add(new THREE.Vector2(x,y))
  //scene is global
  scene.add(mesh);
}

function getClicked3DPoint(evt) {
  evt.preventDefault();
  console.log("screen", evt.screenX, evt.screenY)
  console.log("client", evt.clientX, evt.clientY)
};