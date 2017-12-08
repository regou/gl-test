const THREE = global.THREE = require('three');

const testUtils = require('./utils');

describe('Raw', function () {
	test('vertex ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(-1, 3, 3);

		let geometry = new THREE.BoxGeometry( 3, 1, 2 )
		let	material = new THREE.ShaderMaterial()
		let vec4 = new THREE.Vector4( 1.0, 0.0, 0.0, 1.0 );//red


		material.vertexShader = `
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
		material.fragmentShader = `
uniform vec4 solidColor;
void main() {
	gl_FragColor = solidColor;
}
`
		material.uniforms = { solidColor: { type: "v4", value: vec4 } };



		let cube = new THREE.Mesh(geometry, material)
		cube.position.set(0,0,0);
		scene.add(cube)


		await testUtils.assertWithSpec(renderer,scene,camera,target,'vertex_ok');
	});


	test('three ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(-1, 3, 3);


		var bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
		var bodyMaterial = new THREE.MeshLambertMaterial({color: 0x398cf1});
		var body = new THREE.Mesh(bodyGeometry, bodyMaterial);

		body.position.set(0,0,0);
		scene.add(body);

		await testUtils.assertWithSpec(renderer,scene,camera,target,'three_ok');

	});


	test('Sprite ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(1, 2, 3);

		function draw() {
			var canvas = document.createElement('canvas');
			var size = 256; // CHANGED
			canvas.width = size;
			canvas.height = size;
			var context = canvas.getContext('2d');
			context.fillStyle = '#ff0000'; // CHANGED
			context.textAlign = 'center';
			context.font = '24px Arial';
			context.fillText("some text", size / 2, size / 2);
			return canvas;
		}

		var amap = new THREE.Texture(draw());
		amap.needsUpdate = true;

		var mat = new THREE.SpriteMaterial({
			map: amap,
			transparent: false,
			useScreenCoordinates: false,
			color: 0xffffff // CHANGED
		});

		var sp = new THREE.Sprite(mat);
		sp.scale.set( 10, 10, 1 ); // CHANGED
		scene.add(sp);

		await testUtils.assertWithSpec(renderer,scene,camera,target,'Sprite_ok');

	});

});

