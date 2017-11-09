const THREE = global.THREE = require('three');

const testUtils = require('./utils');



describe('Raw', function () {
	test('vertex ok',async function () {
		var ls = testUtils.init(-1, 3, 3);

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
		ls.scene.add(cube)


		ls.renderer.render(ls.scene, ls.camera, ls.target, true);

		await testUtils.genPng(ls.renderer,ls.target,'vertex_ok');
		let isSame = await testUtils.isSameImage('vertex_ok');
		expect(isSame).toBe(true)
	});


	test('three ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(-1, 3, 3);


		var bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
		var bodyMaterial = new THREE.MeshLambertMaterial({color: 0x398cf1});
		var body = new THREE.Mesh(bodyGeometry, bodyMaterial);

		body.position.set(0,0,0);
		scene.add(body);

		renderer.render(scene, camera, target, true);


		await testUtils.genPng(renderer,target,'three_ok');

		let isSame = await testUtils.isSameImage('three_ok');

		expect(isSame).toBe(true)

	});
});

