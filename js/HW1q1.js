/***********
 * HW 1 Question 1 - Regular Polygon
 * Ed Castro-Puello
 * Jan 2024
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let axes = new THREE.AxesHelper(10);
	regularPolygonMesh(8,10,new THREE.Color(1, 0, 0), new THREE.Color(0, 0, 1));
    scene.add(axes);
}

function regularPolygonMesh(n, rad, innerColor, outerColor){
	
	for (let i = 0; i < 360; i = i + (360/n)){
		let geom = new THREE.Geometry();
		let a = new THREE.Vector3(0, 0, 0);
		let b = new THREE.Vector3().setFromSphericalCoords(rad, THREE.Math.degToRad(i),THREE.Math.degToRad(90)); 
		let c = new THREE.Vector3().setFromSphericalCoords(rad, THREE.Math.degToRad(i + (360/n)),THREE.Math.degToRad(90)); 
		geom.vertices.push(a, b, c);
		let face = new THREE.Face3(0, 1, 2);
		geom.faces.push(face);
		face.vertexColors.push(innerColor, outerColor, outerColor);
		let args = {vertexColors: THREE.VertexColors, side: THREE.DoubleSide};
		let mat = new THREE.MeshBasicMaterial(args);
		let mesh = new THREE.Mesh(geom, mat);
		scene.add(mesh);
	}
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

