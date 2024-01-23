/***********
 * HW 1 Question 2 - Regular Cylinder
 * Ed Castro-Puello
 * Jan 2024
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let axes = new THREE.AxesHelper(10);
	createCylinder(8,10,15);
    scene.add(axes);
}

function createCylinder(n, rad, len){
	let geomA = new THREE.Geometry();
	let geomB = new THREE.Geometry();
	let args = {color: 0xffff00, linewidth: 4};
	let mat = new THREE.LineBasicMaterial(args);
	for (let i = 0; i <= 360; i = i + (360/n)){
		
		//let a = new THREE.Vector3(0, 0, 0);
		let a = new THREE.Vector3().setFromCylindricalCoords(rad, THREE.Math.degToRad(i), len/2); 
		let b = new THREE.Vector3().setFromCylindricalCoords(rad, THREE.Math.degToRad(i), -len/2); 
		 
		geomA.vertices.push(a);
		geomB.vertices.push(b);
		
		let geomC = new THREE.Geometry();
		geomC.vertices.push(a, b);
		var lineC = new THREE.Line(geomC, mat, THREE.LineStrip);
		scene.add(lineC);
		//let face = new THREE.Face3(0, 1, 2);
		//geom.faces.push(face);
		//face.vertexColors.push(innerColor, outerColor, outerColor);
		
	}
	
		//let mesh = new THREE.Mesh(geom, mat);
	var lineA = new THREE.Line(geomA, mat, THREE.LineStrip);
	scene.add(lineA);
	var lineB = new THREE.Line(geomB, mat, THREE.LineStrip);
	scene.add(lineB);
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


init();
createScene();
addToDOM();
render();
animate();

