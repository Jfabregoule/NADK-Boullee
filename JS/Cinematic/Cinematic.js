export async function PlayCinematic(){
    
    // let firstPersonControllers = await SDK3DVerse.engineAPI.findEntitiesByNames('First Person Controller');
    // let firstPersonController = firstPersonControllers[0];
    // const children = await firstPersonController.getChildren();
    // const firstPersonCamera = children.find((child) =>
    // 	child.isAttached("camera")
    // );

    //const camera = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];

    //let transform = camera.getTransform();
    const camera = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];
    await SDK3DVerse.engineAPI.cameraAPI.travel(camera, [200, 200, 200], [0,0,0,1], 10, camera.getTransform().position, camera.getTransform().orientation);
    //let transform = { position : [100, 100, 100], orientation : [0, 0, 0, 1], scale : [1, 1, 1] }
    //camera.setTransform(transform);
    console.out("Salut c la cam");
}

export async function StopCinematic(){
    // set cam to fpscam
    //await SDK3DVerse.engineAPI.cameraAPI.setViewports([firstPersonCamera]);


    // let transform = camera.getTransform();
    // await SDK3DVerse.engineAPI.cameraAPI.travel(camera, [-3.007635, 5.210598, 68.501045], camera.getTransform().orientation, 1, camera.getTransform().position, camera.getTransform().orientation);
    // camera.setTransform(transform);
}