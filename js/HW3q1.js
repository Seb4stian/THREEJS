/***********
 * Homework 3 q1
 * Triange Fractal
 * Eduardo Castro-Puello
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let Triangle;
let len = 16;
let mat;



function createScene() {
    let nbrLevels = controls.nbrLevels;
    let color = new THREE.Color(controls.color);
    let opacity = controls.opacity;
    let matArgs = {color: color, transparent: true, opacity: opacity};
    mat = new THREE.MeshLambertMaterial(matArgs);
    Triangle = makeTriangleFrac(nbrLevels, mat, len);
    let light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
    let light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(20, 40, -40);
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
    scene.add(Triangle);
}

function makeTriangleFrac(level, mat, len=10) {
    if (level == 0) {
        let geom = new THREE.CylinderGeometry(len, len, 2, 3);
		let mesh = new THREE.Mesh(geom, mat);
		mesh.rotation.x = Math.PI/4;
		mesh.rotation.y = -Math.PI/1;
		
        return mesh;
    }
    else {
        let triangle = makeTriangleFrac(level-1, mat, len);
        let root = new THREE.Object3D();
        root.scale.set(1/2, 1/2, 1/2);
		let clone1 = triangle.clone();
        clone1.position.set(0-15, -15, 0);
        root.add(clone1);
		let clone2 = triangle.clone();
        clone2.position.set(27.5-15, -15, 0);
        root.add(clone2);
		let clone3 = triangle.clone();
        clone3.position.set(13.82-15, 17-15, -17);
        root.add(clone3);
        return root;
    }
}

var controls = new function() {
    this.nbrLevels = 10;
    this.opacity = 1.0;
    this.color = '#ff3232';
    this.type = '2D Cantor';
}

function initGui() {
    var gui = new dat.GUI();
    gui.add(controls, 'nbrLevels', 0, 10).step(1).onChange(update);
    gui.add(controls, 'opacity', 0.1, 1.0).step(0.1);
    gui.addColor(controls, 'color');
}

function update() {
    if (Triangle)
        scene.remove(Triangle);
    Triangle = makeTriangleFrac(controls.nbrLevels, mat, len);
    scene.add(Triangle);
}



function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    mat.color = new THREE.Color(controls.color);
    mat.opacity = controls.opacity;
    renderer.render(scene, camera);
}



function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);
    renderer.setAnimationLoop(function () {
        render();
    });

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, 24, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
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
initGui();
addToDOM();
