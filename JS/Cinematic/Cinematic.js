export async function PlayCinematic(){
    const cameraList = await SDK3DVerse.engineAPI.findEntitiesByNames("IntroCamera");
    const camera = cameraList[0];
    console.log(camera);
	SDK3DVerse.setMainCamera(camera);
    
    await SDK3DVerse.engineAPI.cameraAPI.travel(camera, [200, 200, 200], camera.getGlobalTransform().orientation, 20, camera.getGlobalTransform().position, camera.getGlobalTransform().orientation);
    // Lock camera
    //setFPSCameraController(document.getElementById("display-canvas"));
}

export async function StopCinematic(){
    await SDK3DVerse.engineAPI.cameraAPI.stopTravel();
}