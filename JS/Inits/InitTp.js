export async function InitTp(){
    let TeleporterIn = [];
    let TeleporterOut = [];
    let tp = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterToRoom1'));
    TeleporterIn.push(...tp);
    tp = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterToRoom2'));
    TeleporterIn.push(...tp);
    tp = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterToRoom3'));
    TeleporterIn.push(...tp);
    tp = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterToRoom4'));
    TeleporterIn.push(...tp);


    let tpOut = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterOut1'));
    TeleporterOut.push(...tpOut);
    tpOut = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterOut2'));
    TeleporterOut.push(...tpOut);
    tpOut = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterOut3'));
    TeleporterOut.push(...tpOut);
    tpOut = (await SDK3DVerse.engineAPI.findEntitiesByNames('teleporterOut4'));
    TeleporterOut.push(...tpOut);

    return [TeleporterIn, TeleporterOut]; 
}