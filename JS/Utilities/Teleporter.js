export async function Teleporter(enter,zone, TeleporterIn,TeleporterOut){
    if (enter.getName() == "teleporterToRoom1"){
        let tpCoordonnee = TeleporterOut[0].getGlobalTransform()
    }
    if (enter.getName() == "teleporterToRoom2"){
        let tpCoordonnee = TeleporterOut[1].getGlobalTransform()
    }
    if (enter.getName() == "teleporterToRoom3"){
        let tpCoordonnee = TeleporterOut[2].getGlobalTransform()
    }
    if (enter.getName() == "teleporterToRoom4"){
        let tpCoordonnee = TeleporterOut[3].getGlobalTransform()
    }
    if (enter.getName() == "teleporterOut1"){
        let tpCoordonnee = TeleporterOut[0].getGlobalTransform()
    }
    if (enter.getName() == "teleporterOut2"){
        let tpCoordonnee = TeleporterOut[1].getGlobalTransform()
    }
    if (enter.getName() == "teleporterOut3"){
        let tpCoordonnee = TeleporterOut[2].getGlobalTransform()
    }
    if (enter.getName() == "teleporterOut4"){
        let tpCoordonnee = TeleporterOut[3].getGlobalTransform()
    }
        let Playertransform = firstPersonController.getGlobalTransform();
        let lightTransform = zone.getGlobalTransform();
        Playertransform.position[0] = tpCoordonnee[0];
        Playertransform.position[1] = tpCoordonnee[1];
        Playertransform.position[2] = tpCoordonnee[2];
        firstPersonController.setGlobalTransform(Playertransform);
}