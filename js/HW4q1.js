/***********
 * HW 4 Question 1 - Random Boxes
 * Ed Castro-Puello
 * Feb 2024
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
    light.position.set(0, 0, 220);
	scene.add(light);
	var light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(0, 0, -220);
	scene.add(light2);

	var light3 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light3.position.set(0, 100, 0);
	scene.add(light3);
	
	var light4 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light4.position.set(0, -100, 0);
	scene.add(light4);
	
	let boxes = randomBoxes(100, 5, 20, 5, 60); 
	scene.add(boxes);
	
    scene.add(axes);
}

function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight){
	
	let root = new THREE.Object3D();
	let geom = new THREE.BoxGeometry(200, 0.4, 200);
	let matArgs = {color: 'grey', transparent: true, opacity: 1};
    let mat = new THREE.MeshLambertMaterial(matArgs);
	root.add(new THREE.Mesh(geom, mat));
	for (let i = 0; i < nbrBoxes; i++) {
		let side = getRandomFloat(minSide, maxSide);
		let height = getRandomFloat(minHeight, maxHeight);
		let geomB = new THREE.BoxGeometry(side, height, side);
		let matArgsB = {color: getRandomColor(0.8, 0.1, 0.8), transparent: true, opacity: 0.8};
		let matB = new THREE.MeshLambertMaterial(matArgsB);
		let boxB = new THREE.Mesh(geomB, matB);
		let x = getRandomFloat(-100,100);
		let y = getRandomFloat(-100,100);
		if (x-side/2 < -100){
			x = -100+side;
		}
		if (x+side/2 > 100){
			x = 100-side;
		}
		if (y-side/2 < -100){
			y = -100+side;
		}
		if (y+side/2 > 100){
			y = 100-side;
		}
		boxB.position.set(x, height/2, y);
		root.add(boxB);
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
	camera.position.set(0, 100, 250);
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