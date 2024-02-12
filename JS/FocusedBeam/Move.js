export async function movefocusedbeam(player, isShooting, camera, triggerBoxes, players, mirrors) {

    const children = await player.getChildren();

    if (isShooting === true && children[2]) {

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
        cameraTransform.position[1] - 0.5,
        cameraTransform.position[2] + directionVector[2]
        ];

        const rayLength = 100;
        const filterFlags = SDK3DVerse.PhysicsQueryFilterFlag.record_touches;
        // Returns dynamic body (if the ray hit one) in block, and all static bodies encountered along the way in touches

        const{ block, touches } = await SDK3DVerse.engineAPI.physicsRaycast(origin, directionVector, rayLength, filterFlags)

        // Vérifiez si la position Y de l'entité a changé
        const epsilon = 0.0001; // Tolerance
        if (Math.abs(children[2].getGlobalTransform().position[1] - cameraTransform.position[1]) > epsilon) {
        cameraTransform.position[1] -= 1;
        }
        // Calcule de la taille du rayon
        let FinalTransform = cameraTransform;
        // Vérifie s'il y a des touches
        while(touches && touches.length > 0 && (triggerBoxes.includes(touches[0].entity) || players.includes(touches[0].entity)))
        {
            touches.shift();
        }
        if (touches[0] && touches[0].entity && mirrors.includes(touches[0].entity))
        {
            let id = mirrors.findIndex(element => element === touches[0].entity);
            if (MirrorsShoot[id] == false)
                await shootMirror(touches[0].entity);
            touches.shift();
        }
        if (touches && touches.length > 0 && touches[0] && touches[0].position) {
            let distance = Math.sqrt(
                Math.pow(cameraTransform.position[0] - touches[0].position[0], 2) +
                Math.pow(cameraTransform.position[1] - touches[0].position[1], 2) +
                Math.pow(cameraTransform.position[2] - touches[0].position[2], 2)
            );
            FinalTransform.scale = [1, 1, distance];
        } else {
            // touches est undefined ou touches[0].position est undefined
            FinalTransform.scale = [1, 1, 100]; // ou une autre valeur par défaut
        }
            // Mettez à jour la transformée de l'entité
        children[2].setGlobalTransform(FinalTransform);
    }
}