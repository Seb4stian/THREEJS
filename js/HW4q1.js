/***********
 * HW 4 Question 1 - Random Boxes
 * Ed Castro-Puello
 * Feb 2024
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let nbrBoxes = 100; 
let minSide = 5; 
let maxSide = 20; 
let minHeight = 5; 
let maxHeight = 60;
let boxes;


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
	
	var light5 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light5.position.set(220, 0, 0);
	scene.add(light5);
	
	var light6 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light6.position.set(-220, 0, 0);
	scene.add(light6);
	
	boxes = randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight); 
	scene.add(boxes);
	
    //scene.add(axes);
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

    this.nbrBoxes = 100;
    this.minSide = 5;
	this.maxSide = 20;
	this.minHeight = 5;
	this.maxHeight = 60;
    //this.color = '#0000FF';
}

function initGui() {
    var gui = new dat.GUI();
    gui.add(controls, 'nbrBoxes', 1, 200).step(1).onChange(update);
    gui.add(controls, 'minSide', 1, 10).step(1).onChange(update);
	gui.add(controls, 'maxSide', 10, 50).step(1).onChange(update);
	gui.add(controls, 'minHeight', 1, 10).step(1).onChange(update);
	gui.add(controls, 'maxHeight', 10, 100).step(1).onChange(update);
    //gui.addColor(controls, 'color').onChange(update);
}
function update() {
    scene.remove(boxes);
	boxes = randomBoxes(controls.nbrBoxes, controls.minSide, controls.maxSide, controls.minHeight, controls.maxHeight); 
	scene.add(boxes);
}

init();
createScene();
initGui();
addToDOM();
render();
animate();