/*
---------------------------------------------------------------------------------------------
|																							|
|										Imports												|
|																							|
---------------------------------------------------------------------------------------------
*/

import { phantomMeshUUID } from "./config.js";
import { InitApp } from "./JS/Inits/InitApp.js";
import { Enemy } from "./JS/Enemies/Enemies.js";
import { InitGrabbable } from "./JS/Inits/InitGrabbable.js";
import { movefocusedbeam } from "./JS/FocusedBeam/Move.js";
import { setFPSCameraController } from "./JS/Utilities/LockScreen.js";
import { GetTags } from "./JS/Utilities/Tags.js";
import { checkColls } from "./JS/Utilities/Collisions.js";
import { Interact } from "./JS/Grab/Interact.js";
import { Grab } from "./JS/Grab/Grab.js";
import { moveGrabbed } from "./JS/Grab/Move.js";
import { ButtonEnigma } from "./JS/Enigmas/ButtonEnigma.js";
import { InitEnigma } from "./JS/Inits/InitEnigma.js";
import { PlayCinematic, StopCinematic } from "./JS/Cinematic/Cinematic.js";

/*
---------------------------------------------------------------------------------------------
|																							|
|										Init App											|
|																							|
---------------------------------------------------------------------------------------------
*/

window.addEventListener("load", (event) => {

	// Initialise et lance le jeu
	InitApp().then(() => {

		// Récupère les éléments HTML du menu et du canvas
		const menu = document.getElementById("menu");
		const startButton = document.getElementById("startButton");
		const canvasContainer = document.getElementById("display-canvas");

		PlayCinematic();
		
		// Display Menu
		menu.style.display = "block";
		//setFPSCameraController(document.getElementById("display-canvas"));
		// Gestionnaire d'événements pour le bouton "Start"
		startButton.addEventListener("mouseup", () => {

			// Lock mouse on screen
			setFPSCameraController(document.getElementById("display-canvas"));

			// Masque le menu
			menu.style.display = "none";

			// Affiche le canvas
			canvasContainer.style.display = "block";

			//
			StopCinematic();
			// Start the Game
			Game();
		});
	});
});

/*
//-------------------------------------------------------------------------------------------------------------------------------------------------------
|																																						|
|																																						|
|							---------------------------------------------------------------------------------------------								|
|							|																							|								|
|							|										  Game   											|								|
|							|																							|								|
|							---------------------------------------------------------------------------------------------								|
|																																						|
|																																						|
//-------------------------------------------------------------------------------------------------------------------------------------------------------
*/

async function Game(){
	
	/*
	---------------------------------------------------------------------------------------------
	|																							|
	|											Inits											|
	|																							|
	---------------------------------------------------------------------------------------------
	*/

	let hasSeenCinematic = false;
	let isShooting;
	const actionQueue = [];

	const players = await SDK3DVerse.engineAPI.findEntitiesByNames('Player');
	const player = players[0];

	let firstPersonControllers = await SDK3DVerse.engineAPI.findEntitiesByNames('First Person Controller');
	let firstPersonController = firstPersonControllers[0];

	// Switch back to FPS cam

	
	const components = await firstPersonController.getChildren();
	const camera = components[0];
	SDK3DVerse.setMainCamera(camera);
	console.log("CAMERA : ");
	console.log(camera);

	//console.log("camera"+ camera);
	// Lancer la cinématique
	//PlayCinematic(camera);

	const lightTemplate = new SDK3DVerse.EntityTemplate();
	lightTemplate.attachComponent("scene_ref", { value: '5cbfd358-45d9-4442-b4bf-dd1b4db5776f' });
	lightTemplate.attachComponent('local_transform', { position : [0, 0, 0] });

	let lights = [];

	isShooting = false;

	let tmp = await SDK3DVerse.engineAPI.findEntitiesByNames('Cinematic trigger');
	let FirstCinematicTrigger = tmp[0];

	let cubeBox = await SDK3DVerse.engineAPI.findEntitiesByNames('Cube box');

	let triggerBoxes = [];
	let buttons = [];
	triggerBoxes.push(...tmp);
	triggerBoxes.push(...cubeBox);

	let mirrors = [];
	let MirrorsShoot = [];

	for (let i = 0; i < mirrors.length; i++)
		MirrorsShoot[i] = false;

	let focusedBeams = [];

	let isGrabbing = false;
	let grabbedEntity;
	let grabbable = [];

	let isBehavior = true;

	let tagged = [];

	const wallOne = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall'))[0];
	const wallTwo = (await SDK3DVerse.engineAPI.findEntitiesByNames('wall2'))[0];
	const codeInteract = (await SDK3DVerse.engineAPI.findEntitiesByNames('codeInteract'))[0]

	class Colors {

		constructor() {
			this.red = false;
			this.purple = false;
			this.light = false;
		}

		toggleRed() {
			this.red = !this.red;
		}

		togglePurple() {
			this.purple = !this.purple;
		}

		toggleLight() {
			this.light = !this.light;
		}

		allTrue() {
			if(this.red && this.purple && this.light) {
				return true;
			}
			return false;
		}
	}
	const colors = new Colors;
	let code = ['1','2','3'];
	let codeTry = []
	let lastBtn  = null

	// Tags
	await GetTags(tagged, mirrors, buttons, lights, MirrorsShoot, triggerBoxes);


	// Collision
	let [enigmaDetectors, enigmaEntities] = await InitEnigma();
	isShooting = await checkColls(lights, actionQueue, player, firstPersonController, hasSeenCinematic, FirstCinematicTrigger, enigmaDetectors, enigmaEntities, wallOne, wallTwo, grabbable, colors, focusedBeams, lightTemplate);

	// Beam
	window.requestAnimationFrame(actionQueueLoop);
	async function actionQueueLoop() {
	if(!actionQueue.length) {
		window.requestAnimationFrame(actionQueueLoop);
		return;
	}

	const action = actionQueue.shift();
	await action();
	window.requestAnimationFrame(actionQueueLoop);
	}
	
	// Enemy
	const camerapagnan = firstPersonController.getTransform();
	const playapagnan = camerapagnan.position;
	const enemy1 = new Enemy([playapagnan[0], playapagnan[1], playapagnan[2]], phantomMeshUUID, "bb8c7a41-ddfc-4a54-af44-a3f71f3cb484", 1, 3 / 60, 1, 10, 1);
	enemy1.initializeEnemy().then(() => {
		function boucle() {
			if (isBehavior) {
				enemy1.wanderLogic();
			}
			else
			{
				enemy1.followLogic(camera);
			}
			window.requestAnimationFrame(boucle);
		}
		window.requestAnimationFrame(boucle);
	})

	function changeBehavior(event) {
		if (event.key === 'p' || event.key === 'P') {
			isBehavior = !isBehavior;
		}
	}
	document.addEventListener('keypress', changeBehavior);

	// Grab
	await InitGrabbable(grabbable);
	document.addEventListener('keyup', async (event)=>{
		if(event.key == 'f'){
			[isGrabbing, grabbedEntity] = await Grab(grabbedEntity, isGrabbing, camera, grabbable);
			Interact(camera, buttons);
		}
	})

	// Mirrors
	let angle = 0;
	let rad = 0;
	function degToRad(deg){ 
		return deg * Math.PI/180
	}

	document.addEventListener('keyup',(event)=>{
		if(event.key == 'r'){
			rotateMirror();
		}
	})

	async function ResizeBeam(mirror)
	{
		let beam;
		let children = await mirror.getChildren();
		for (let i = 0; i < children.length; i++)
		{
			if (focusedBeams.includes(children[i]))
				beam = children[i];
		}
		let mirrorTransform = mirror.getGlobalTransform();

		// Vecteur initial pointant vers l'avant (par exemple, l'axe -Z)
		const forwardVector = { x: 0, y: 0, z: -1 };

		// Effectuer la rotation du vecteur en fonction du quaternion
		const 	x = mirrorTransform.orientation[0],
				y = mirrorTransform.orientation[1],
				z = mirrorTransform.orientation[2],
				w = mirrorTransform.orientation[3];

		// Appliquer la rotation du quaternion à ce vecteur
		const 	x2 = x + x,
				y2 = y + y,
		 		z2 = z + z,
		 		xx = x * x2,
		 		xy = x * y2,
		 		xz = x * z2,
		 		yy = y * y2,
		 		yz = y * z2,
		 		zz = z * z2,
		 		wx = w * x2,
		 		wy = w * y2,
		 		wz = w * z2;

		const rotatedDirection = {
			x: forwardVector.x * (1.0 - (yy + zz)) + forwardVector.y * (xy - wz) + forwardVector.z * (xz + wy),
			y: forwardVector.x * (xy + wz) + forwardVector.y * (1.0 - (xx + zz)) + forwardVector.z * (yz - wx),
			z: forwardVector.x * (xz - wy) + forwardVector.y * (yz + wx) + forwardVector.z * (1.0 - (xx + yy))
		};

		// Normaliser le vecteur résultant
		const magnitude = Math.sqrt(rotatedDirection.x * rotatedDirection.x + rotatedDirection.y * rotatedDirection.y + rotatedDirection.z * rotatedDirection.z);
		const directionVector = {
			x: rotatedDirection.x / magnitude,
			y: rotatedDirection.y / magnitude,
			z: rotatedDirection.z / magnitude
		};

		const origin = [
			mirrorTransform.position[0] + directionVector.x, // Multiplie par la distance souhaitée
			mirrorTransform.position[1] + 1,
			mirrorTransform.position[2] + directionVector.y
		];

		const rayLength = 100;
		const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.record_touches;

		// Effectuer le raycast
		const { block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, [directionVector.x, directionVector.y, directionVector.z], rayLength, filterFlags);
		for (let i = 0; i < touches.length; i++)
		{
			if (mirrors.includes(touches[i].entity))
				shootMirror(touches[i].entity);
		}
		let FinalTransform = mirrorTransform;
		while (touches && touches.length > 1 && (focusedBeams.includes(touches[0].entity) || touches[0].entity == mirror || lights.includes(touches[0].entity)))
			touches.shift();
		if (touches && touches.length > 1) {
			console.log(mirrorTransform.position);
			console.log(touches[0]);
			let distance = Math.sqrt(
				Math.pow(mirrorTransform.position[0] - touches[0].position[0], 2) +
				Math.pow(mirrorTransform.position[1] - touches[0].position[1], 2) +
				Math.pow(mirrorTransform.position[2] - touches[0].position[2], 2)
			);
			console.log(distance);
			FinalTransform.scale = [1, 1, distance];
		} else {
			// touches est undefined ou touches[0].position est undefined
			FinalTransform.scale = [1, 1, 100]; // ou une autre valeur par défaut
		}
		FinalTransform.position[0] += directionVector.x / 8;
		FinalTransform.position[1] += 1;
		FinalTransform.position[2] += directionVector.z / 8;
		beam.setGlobalTransform(FinalTransform);
	}

	async function shootMirror(mirror)
	{
		let index = mirrors.findIndex(element => element === mirror);
		if (index != -1 && MirrorsShoot[index] == false)
		{
			MirrorsShoot[index] = true;
			//let mirrorTransform = mirror.getComponent('local_transform');
			let lightParentEntity = mirror;
			let lightSceneEntity = await lightTemplate.instantiateTransientEntity(
			"Light",
			lightParentEntity,
			true
		);
		let orientation = lightSceneEntity.getGlobalTransform().orientation;

		lightSceneEntity.setGlobalTransform({orientation : orientation});
		let position = lightSceneEntity.getGlobalTransform().position;
		position[1] += 1;
		lightSceneEntity.setGlobalTransform({position : position});
		ResizeBeam(mirror);
		focusedBeams.push(lightSceneEntity);
		}
	}

	async function rotateMirror(){
		const cameraTransform = camera.getTransform();

		// dirVect
		let directionVector = [
			SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[8],   // X
			SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[9],   // Y
			SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0].getWorldMatrix()[10]   // Z
		];

		// Normalise le vecteur si nécessaire
		const magnitude = Math.sqrt(
			directionVector[0] ** 2 + directionVector[1] ** 2 + directionVector[2] ** 2
		);
		directionVector = [
			-directionVector[0] / magnitude,
			-directionVector[1] / magnitude,
			-directionVector[2] / magnitude
		];

		const origin = [
		cameraTransform.position[0] + directionVector[0], // Multiplie par la distance souhaitée
		cameraTransform.position[1] + directionVector[1],
		cameraTransform.position[2] + directionVector[2]
		];

		const rayLength = 1;
		const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.dynamic_block | SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
		// Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches
		const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags);
		if (block != null){
			if (block.entity.getName() == 'mirror'){
				let transform = block.entity.getGlobalTransform();
				angle += 45;
				rad  = degToRad(angle);
				transform.orientation = [0,Math.sin((rad/2)),0,Math.cos((rad/2))];
				block.entity.setGlobalTransform(transform);
				let index = mirrors.findIndex(element => element === block.entity);
				if (MirrorsShoot[index] == true)
					ResizeBeam(block.entity);
			}
		}
	}

	
	// Enigma
	document.addEventListener('keyup',async (event)=>{
		if(event.key == 'f' || event.key == 'F'){
			[codeTry, lastBtn] = await ButtonEnigma(code, codeTry, camera, lastBtn, codeInteract);
		}
	})



	/*
	//-------------------------------------------------------------------------------------------------------------------------------------------------------
	|																																						|
	|																																						|
	|							---------------------------------------------------------------------------------------------								|
	|							|																							|								|
	|							|										Game Loop											|								|
	|							|																							|								|
	|							---------------------------------------------------------------------------------------------								|
	|																																						|
	|																																						|
	//-------------------------------------------------------------------------------------------------------------------------------------------------------
	*/

	function loop() {
		setFPSCameraController(document.getElementById("display-canvas"));
		movefocusedbeam(player, isShooting, camera, triggerBoxes, players, mirrors);
		if (isGrabbing)
			moveGrabbed(grabbedEntity, camera);
		window.requestAnimationFrame(loop);
	}
	window.requestAnimationFrame(loop);
}