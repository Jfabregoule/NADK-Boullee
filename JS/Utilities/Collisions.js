import { createfocusedbeam } from "../FocusedBeam/Create.js";
import { destroyfocusedbeam } from "../FocusedBeam/Destroy.js";
import { PlayCinematic } from "../oui/Cinematic.js";
import { WallEnigma } from "../Enigma/WallEnigma.js";

export async function checkColls(lights, actionQueue, player, firstPersonController, hasSeenCinematic, FirstCinematicTrigger, enigmaDetectors, enigmaEntities, wallOne, wallTwo, grabbable){

    SDK3DVerse.engineAPI.onEnterTrigger((entering, zone) => 
    {
        if (entering == firstPersonController && lights.includes(zone))
        {
            actionQueue.push(() => {
                isShooting = createfocusedbeam(player);
            });
            console.log(zone.getComponent('tags').value[1]);
            if (zone.getComponent('tags').value[1] == "elevate")
            {
                let Playertransform = firstPersonController.getGlobalTransform();
                let lightTransform = zone.getGlobalTransform();
                Playertransform.position[0] = lightTransform.position[0];
                Playertransform.position[1] = camera.getTransform().position[1] - 2.5;
                Playertransform.position[2] = lightTransform.position[2];
                firstPersonController.setGlobalTransform(Playertransform);
            }
        }

        else if (entering == firstPersonController && zone == FirstCinematicTrigger && !hasSeenCinematic)
        {
            console.log("Cinematic");
            PlayCinematic();
            hasSeenCinematic = true;
        }
        WallEnigma(entering, zone, enigmaDetectors, enigmaEntities, wallOne, wallTwo);
    });

    SDK3DVerse.engineAPI.onExitTrigger((exiting, zone) =>
    {
        if (grabbable.includes(exiting) && cubeBox.includes(zone))
        {
            exiting.setGlobalTransform({position : [0, 0, 0]});
        }
        if (exiting == firstPersonController && lights.includes(zone))
            actionQueue.push(() => destroyfocusedbeam(perso));
    });
}