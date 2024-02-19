export function Teleporter(zone, TeleporterIn,TeleporterOut){
    let tpCoordonnee;
    if (zone.getName() == "teleporterToRoom1"){
        tpCoordonnee = TeleporterOut[0].getGlobalTransform()
    }
    if (zone.getName() == "teleporterToRoom2"){
        tpCoordonnee = TeleporterOut[1].getGlobalTransform()
    }
    if (zone.getName() == "teleporterToRoom3"){
        tpCoordonnee = TeleporterOut[2].getGlobalTransform()
    }
    if (zone.getName() == "teleporterToRoom4"){
        tpCoordonnee = TeleporterOut[3].getGlobalTransform()
    }
    if (zone.getName() == "teleporterOut1"){
        tpCoordonnee = TeleporterIn[0].getGlobalTransform()
    }
    if (zone.getName() == "teleporterOut2"){
        tpCoordonnee = TeleporterIn[1].getGlobalTransform()
    }
    if (zone.getName() == "teleporterOut3"){
        tpCoordonnee = TeleporterIn[2].getGlobalTransform()
    }
    if (zone.getName() == "teleporterOut4"){
        tpCoordonnee = TeleporterIn[3].getGlobalTransform()
    }
    
    return tpCoordonnee;
}