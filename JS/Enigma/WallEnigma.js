export async function WallEnigma(entity, detector, enigmaDetectors, enigmaEntities, wallOne, wallTwo, colors){
    if (enigmaEntities.includes(entity) && enigmaDetectors.includes(detector)){
        console.log("ifEntered");
        if (entity.getName() == 'cubeEntity' && detector.getName() == 'wallDetector'){
            wallOne.setVisibility(false);
            wallOne.detachComponent('physics_material');
            console.log("wallOne");
        }
        if (entity.getName() == 'redCube' && detector.getName() == 'redDetector'){
            console.log("red");
            colors.toggleRed();
        }
        if (entity.getName() == 'purpleCube' && detector.getName() == 'purpleDetector'){
            console.log("purple");
            colors.togglePurple();
        }
        if (entity.getName() == 'lightCube' && detector.getName() == 'lightDetector'){
            console.log("light");
            colors.toggleLight();
        }

        if (colors.allTrue()){
            wallTwo.setVisibility(false);
            wallTwo.detachComponent('physics_material');
            console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
        }
    }
}