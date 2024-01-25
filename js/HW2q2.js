/***********
 * HW 2 Question 2 - pyramid of tori
 * Ed Castro-Puello
 * Jan 2024
 ***********/

var camera, scene, renderer;
var cameraControls;
var gui;
var currentMat, wireframeMat, currentMesh;
var currentObjectName;
var clock = new THREE.Clock();
let root = null;


let controls = new function() {
    this.NumTorus = 14
	this.BigRadius = 15;
	this.SmallRadius = 0.4;
    this.Go = update;
}

function createScene() {
 
    update(14, 15, 1);
    var light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
    var light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(0, 0, -40);
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
	let axes = new THREE.AxesHelper(10);
	scene.add(axes);
}


function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 20, 60);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

    initGui();
}
function PiramideOnTorus(NumTorus, BigRadius, SmallRadius){
	let root = new THREE.Object3D();
	for (let i = 0; i < NumTorus; i++){
		let innerColor = getRandomColor();
		geom = new THREE.TorusGeometry(BigRadius-((BigRadius-SmallRadius)/NumTorus)*i, SmallRadius, 24, 36);
		currentMat = new THREE.MeshLambertMaterial({color: innerColor, flatShading: true});
		Torus = new THREE.Mesh(geom, currentMat);
		Torus.position.z = -i;
		root.add(Torus);
		root.rotation.x = Math.PI / 2;
	}
	geom = new THREE.SphereGeometry(SmallRadius, 24, 24);
	let innerColor = getRandomColor();
	currentMat = new THREE.MeshLambertMaterial({color: innerColor, flatShading: true});
	Sphere = new THREE.Mesh(geom, currentMat)
	Sphere.position.z = -NumTorus;
	root.add(Sphere);
	return root;
}
function update() {
	let NumTorus = controls.NumTorus;
    let BigRadius = controls.BigRadius;
	let SmallRadius = controls.SmallRadius;
    if (root)
        scene.remove(root);
    root = PiramideOnTorus(NumTorus, BigRadius, SmallRadius);
    scene.add(root);
}

function initGui() {

	let gui = new dat.GUI();
    gui.add(controls, 'NumTorus', 5, 20).step(1).name('Num. Torus');
	gui.add(controls, 'BigRadius', 4, 20).name('Torus Big radius');
    gui.add(controls, 'SmallRadius',0.1,1).name('Torus Small radius');
    gui.add(controls, 'Go');
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}



init();
createScene();
addToDOM();
animate();