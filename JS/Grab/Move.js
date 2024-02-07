export async function moveGrabbed(grabbedEntity, camera){
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

        const pos = [
            (cameraTransform.position[0] + directionVector[0] * 2.5) - 0.5, // Multiplie par la distance souhaitée
            (cameraTransform.position[1] + directionVector[1] * 2.5) - 0.5,
            (cameraTransform.position[2] + directionVector[2] * 2.5) - 0.5
        ];

        grabbedEntity.setGlobalTransform({position : pos});
}