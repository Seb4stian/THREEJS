/***********
 * HW 3 Question 2 - Regular Polygon
 * Ed Castro-Puello
 * Jan 2024
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let n = 49;
let radius = 2;
let angle = Math.PI / 4;
let dist = 0.5;
const geometry = new THREE.SphereGeometry( 1, 12, 12 ); 
const material = new THREE.MeshLambertMaterial( { color: 'blue' } ); 
const sphere = new THREE.Mesh( geometry, material );
let Helix;

function createScene() {
    let axes = new THREE.AxesHelper(10);
	var light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
	scene.add(light);
	var light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(0, 0, -40);
	scene.add(light2); 
	 
	//scene.add( sphere );
	Helix = createHelix(sphere, n, radius, angle, dist);
	scene.add(Helix);
    scene.add(axes);
}
function createHelix(object, n, radius, angle, dist) {
	let root = new THREE.Object3D();
	for (let i = 0; i < n; i++) {
		let clone = object.clone();
		x = radius*Math.cos(i*angle);
		y = radius*Math.sin(i*angle);
		clone.position.set(x, y, i*dist);
		root.add(clone);
	}
	return root;
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}


function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
	renderer.render(scene, camera);
}


function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}
var controls = new function() {
    this.n = 49;
    this.radius = 2;
	this.angle = Math.PI / 4;
	this.dist = 0.5;
    //this.color = '#0000FF';
}

function initGui() {
    var gui = new dat.GUI();
    gui.add(controls, 'n', 0, 60).step(1).onChange(update);
    gui.add(controls, 'radius', 1, 10).step(1).onChange(update);
	gui.add(controls, 'angle', 0, 2*Math.PI).step(Math.PI / 4).onChange(update);
	gui.add(controls, 'dist', 0.5, 5).step(0.5).onChange(update);
    //gui.addColor(controls, 'color').onChange(update);
}
function update() {
    scene.remove(Helix);
	Helix = createHelix(sphere, controls.n, controls.radius, controls.angle, controls.dist)
    scene.add(Helix);
}

init();
createScene();
initGui();
addToDOM();
render();
animate();


