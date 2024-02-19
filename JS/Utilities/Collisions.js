import { createfocusedbeam } from "../FocusedBeam/Create.js";
import { destroyfocusedbeam } from "../FocusedBeam/Destroy.js";
import { PlayCinematic } from "../Cinematic/Cinematic.js";
import { WallEnigma } from "../Enigmas/WallEnigma.js";
import { Teleporter } from "./Teleporter.js";

export async function checkColls(lights, actionQueue, player, firstPersonController, hasSeenCinematic, FirstCinematicTrigger,TeleporterIn,TeleporterOut, enigmaDetectors, enigmaEntities, wallOne, wallTwo, grabbable, colors, focusedBeams, lightTemplate){

    let isShooting;
    SDK3DVerse.engineAPI.onEnterTrigger((entering, zone) => 
    {
        if (entering == firstPersonController && TeleporterIn.includes(zone) || TeleporterOut.includes(zone)){
            let tpCoordonnee = Teleporter(zone,TeleporterIn,TeleporterOut);
            let Playertransform = firstPersonController.getGlobalTransform();
            Playertransform.position[0] = tpCoordonnee.position[0] - 2;
            Playertransform.position[1] = tpCoordonnee.position[1] + 2;
            Playertransform.position[2] = tpCoordonnee.position[2];
            firstPersonController.setGlobalTransform(Playertransform);
        }
        if (entering == firstPersonController && lights.includes(zone))
        {
            actionQueue.push(() => {
                isShooting = createfocusedbeam(player, lightTemplate, focusedBeams);
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
            PlayCinematic();
            hasSeenCinematic = true;
        }
        WallEnigma(entering, zone, enigmaDetectors, enigmaEntities, wallOne, wallTwo, colors);
    });

    SDK3DVerse.engineAPI.onExitTrigger((exiting, zone) =>
    {
        if (grabbable.includes(exiting) && cubeBox.includes(zone))
        {
            exiting.setGlobalTransform({position : [0, 0, 0]});
        }
        if (exiting == firstPersonController && lights.includes(zone))
            actionQueue.push(() => {
                isShooting = destroyfocusedbeam(player, focusedBeams)
            }
        )
    });
    return isShooting;
}