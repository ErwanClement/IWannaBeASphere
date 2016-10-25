var Game = (function () {
    function Game(canvasId) {
        //Array qui contiendra tout les elements qui auront un doAction
        this.gameElement = [];
        var canvas = document.getElementById(canvasId);
        Game.engine = new BABYLON.Engine(canvas, true);
        Game.scene = null;
        window.addEventListener("resize", function () {
            Game.engine.resize();
        });
        this._run();
    }
    Game.prototype._run = function () {
        var _this = this;
        this._initScene();
        Game.scene.executeWhenReady(function () {
            // Remove loader
            var loader = document.querySelector("#loader");
            loader.style.display = "none";
            //Load le Dialogue des Json ...
            var loaderDialogue = new BABYLON.AssetsManager(Game.scene);
            var textTask = loaderDialogue.addTextFileTask("dialogs", "dialogs.json");
            textTask.onSuccess = function (task) {
                //... et cr�er les manager li�sv (UIManager et Sound Manager
                _this.uiMan = new UIManager(Game.scene);
                _this.dialogueMan = new DialogueManager(JSON.parse(task.text), _this.uiMan);
            };
            textTask.onError = function (task) { console.log("errorload"); };
            loaderDialogue.load();
            Game.engine.runRenderLoop(function () {
                //On fait le doAction de tout les gameElements
                for (var _i = 0, _a = _this.gameElement; _i < _a.length; _i++) {
                    var gameElem = _a[_i];
                    gameElem.doAction();
                }
                Game.scene.render();
            });
        });
    };
    //Cr�ation de la scene, de la light et du Trigger Manager
    Game.prototype._initScene = function () {
        Game.scene = new BABYLON.Scene(Game.engine);
        Game.scene.collisionsEnabled = true;
        this.triggerMan = new TriggerManager();
        var light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), Game.scene);
        light.intensity = 0.7;
        this._initGame();
        //window.addEventListener("keyup", (e: KeyboardEvent) => { console.log(TriggerManager.triggerActiveArray); });
    };
    Game.prototype._initGame = function () {
        //Game.scene.debugLayer.show();
        BABYLON.SceneLoader.ImportMesh("", "scenes/", "toilette.babylon", Game.scene, function () { });
        this.player = Player.getInstance();
        this.gameElement.push(this.player);
        //TEST: Creation d'un trigger de dialogue
        var mesh = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_01", { size: 1 }, Game.scene);
        mesh.position.y = 3;
        mesh.position.x = 4;
        mesh.alphaIndex = 0;
        this.triggerMan.addTrigger(mesh);
        this.triggerMan.switchTriggerArray([mesh]);
        //Creation et Parametrage de la camera
        this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-1, 1, 0), Game.scene);
        this.camera.target = this.player.mesh;
        this.camera.rotationOffset = -90;
        this.camera.maxCameraSpeed = 5;
        //this.camera.cameraAcceleration = 0.05;
        //this.camera.radius = 30; // how far from the object to follow
        //this.camera.heightOffset = 8; // how high above the object to place the camera
        //this.camera.rotationOffset = 180; // the viewing angle
        //this.scene.activeCamera = camera;
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map