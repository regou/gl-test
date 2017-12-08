const THREE = global.THREE = require('three');
const testUtils = require('./utils');

describe('Elements', function () {

	test('TextMesh ok',async function () {
		const {renderer,canvas,camera,scene,target} = testUtils.init(1, 2, 3);

		const TextMesh = require('../src/TextMesh');

		let msh = new TextMesh("HELLO WORLD", 100, "black", "yellow");

		scene.add(msh);

		await testUtils.genPng(renderer,target,'TextMesh_ok',true);

		// await testUtils.assertWithSpec(renderer,scene,camera,target,'TextMesh_ok');

	});



});
