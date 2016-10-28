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
                //... et cr�er les manager li�sv (UIManager, Sound Manager et du triggerMan)
                _this.triggerMan = new TriggerManager();
                _this.uiMan = new UIManager(Game.scene);
                _this.dialogueMan = new DialogueManager(JSON.parse(task.text), _this.uiMan, _this.triggerMan);
                _this.soundMan = new SoundManager(JSON.parse(task.text));
                _this._initGame();
            };
            textTask.onError = function (task) { console.log("errorload"); };
            loaderDialogue.onFinish = function (tasks) {
                var loaderSounds = new BABYLON.AssetsManager(Game.scene);
                SoundManager.loadMusics(loaderSounds);
                //SoundManager.loadSounds(loaderSounds);
                loaderSounds.load();
            };
            loaderDialogue.load();
            //Load les sons ...
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
        window.addEventListener('onTeleport', this.chargeLevel2.bind(this));
        Game.scene = new BABYLON.Scene(Game.engine);
        Game.scene.collisionsEnabled = true;
        var light = new BABYLON.HemisphericLight('', new BABYLON.Vector3(0, 1, 0), Game.scene);
        light.intensity = 0.7;
        //Creation et Parametrage de la camera
        this.camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), Game.scene);
        this.camera.rotationOffset = -90;
        this.camera.maxCameraSpeed = 1;
        //this.camera.cameraAcceleration = 0.05;
        this.camera.radius = 8; // how far from the object to follow
        this.camera.heightOffset = 2; // how high above the object to place the camera
        //    this.camera.rotationOffset = -90; // the viewing angle
        //this.scene.activeCamera = camera;
        //window.addEventListener("keyup", (e: KeyboardEvent) => { console.log(TriggerManager.triggerActiveArray); });
    };
    Game.prototype._initGame = function () {
        //Game.scene.debugLayer.show();
        var _this = this;
        BABYLON.SceneLoader.ImportMesh("", "scenes/", "etage1.babylon", Game.scene, function (meshes) {
            _this.currentLevel = meshes;
            _this.clearColision();
        });
        //TEST: Creation d'un trigger de dialogue
        /*let mesh = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_01", { size: 1 }, Game.scene);
        mesh.position.y = 0.5;
        mesh.position.x = 4;
        this.triggerMan.addTrigger(mesh);

        let mesh2 = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_02", { size: 1 }, Game.scene);
        mesh2.position.y = 0.5;
        mesh2.position.x = -4;
        mesh2.position.z = -4;
        this.triggerMan.addTrigger(mesh2);
        this.triggerMan.switchTriggerArray([mesh]);

        let mesh3 = BABYLON.MeshBuilder.CreateBox("Trigger-Dial_03", { size: 1 }, Game.scene);
        mesh3.position.y = 0.5;
        mesh3.position.x = 4;
        mesh3.position.z = -4;
        this.triggerMan.addTrigger(mesh3);*/
        //EndTest
        this.player = Player.getInstance();
        this.gameElement.push(this.player);
        this.camera.target = this.player.mesh;
    };
    Game.prototype.chargeLevel2 = function () {
        var _this = this;
        for (var i = this.currentLevel.length - 1; i > 0; i--) {
            this.currentLevel[i].dispose();
        }
        BABYLON.SceneLoader.ImportMesh("", "scenes/", "etage2.babylon", Game.scene, function (meshes) {
            _this.currentLevel = meshes;
            _this.clearColision();
        });
    };
    Game.prototype.clearColision = function () {
        for (var i = this.currentLevel.length - 1; i > 0; i--) {
            /*if (this.currentLevel[i].name.indexOf("Mur") != -1)
                break;*/
            if (this.currentLevel[i].name.indexOf("Trigger-Dial") != -1) {
                this.triggerMan.addTrigger(this.currentLevel[i]);
                this.currentLevel[i].alphaIndex = 0;
            }
            this.currentLevel[i].checkCollisions = false;
        }
        this.triggerMan.switchTriggerArray(this.triggerMan._triggerInactiveArray, true);
        console.log(TriggerManager.triggerActiveArray);
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map