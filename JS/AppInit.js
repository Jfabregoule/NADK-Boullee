import { publicToken, mainSceneUUID, characterControllerSceneUUID } from "../config.js";

export async function InitApp() {

	// Session initialization
	await SDK3DVerse.startSession({
		userToken: publicToken,
		sceneUUID: mainSceneUUID,
		canvas: document.getElementById("display-canvas"),
		connectToEditor: true,
		startSimulation: "on-assets-loaded",
	});

	// Simulation initialization
	await SDK3DVerse.engineAPI.startSimulation();

	// First person controller initialization
	await InitFirstPersonController(characterControllerSceneUUID);

	// Init console log for C++
	const engineOutputEventUUID = "9d62edc3-d096-40fd-ba7d-60550c050cf1";
	SDK3DVerse.engineAPI.registerToEvent(engineOutputEventUUID, "log", (event) => console.log(event.dataObject.output));

	// Démarrer la jeu
	//await Game();
}