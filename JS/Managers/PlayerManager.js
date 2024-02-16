export class PlayerManager {

    constructor() {

        this.players;
        this.player;
        this.controllers;
        this.controller;
        this.camera;

    }

    async Init() {

        this.players = await SDK3DVerse.engineAPI.findEntitiesByNames('Player');
        this.player = (this.players)[0];

        this.controllers = await SDK3DVerse.engineAPI.findEntitiesByNames('First Person Controller');
        this.controller = (this.controllers)[0];

        this.camera = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];
    }
}