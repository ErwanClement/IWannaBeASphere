var SoundManager = (function () {
    function SoundManager(pJson) {
        SoundManager.currentSoundDialogue = new BABYLON.Sound("start", "sounds/01.mp3", Game.scene, function () { }, { autoplay: false, loop: false });
        SoundManager.Dialogs = pJson;
        SoundManager.soundCounter = 56;
        //window.addEventListener('onEndDrawDialogue', this.nextStep.bind(this));
    }
    SoundManager.loadSounds = function (assetManager) {
        //SoundManager.Dialogs.forEach((item, index) => {
        //    console.log(item); // 9, 2, 5
        //    console.log(index); // 0, 1, 2
        //});
        for (var key in SoundManager.Dialogs) {
            //var value = SoundManager.Dialogs[key];
            var binaryTask = assetManager.addBinaryFileTask(key, "sounds/" + key.substring(7, 9) + ".mp3");
            binaryTask.onSuccess = function (task) {
                SoundManager.Dialogs[key] = new BABYLON.Sound(key, "sounds/" + key.substring(7, 9) + ".mp3", Game.scene, SoundManager.soundReady, { autoplay: true, loop: false });
            };
        }
        //for (var i = 0; i < SoundManager.Dialogs.length; i++) {
        //    var binaryTask = assetManager.addBinaryFileTask(SoundManager.Dialogs.keys(SoundManager.Dialogs[i])[0], "sounds/" + parseInt(SoundManager.Dialogs.keys(SoundManager.Dialogs[i])[0]).toString() + ".mp3");
        //    binaryTask.onSuccess = function (task) {
        //        SoundManager.Dialogs[i] = new BABYLON.Sound(SoundManager.Dialogs.keys(SoundManager.Dialogs[i])[0], "sounds/" + parseInt(SoundManager.Dialogs.keys(SoundManager.Dialogs[i])[0]).toString() + ".mp3", Game.scene, SoundManager.soundReady, { autoplay: false, loop: false });
        //    }
        //}
    };
    SoundManager.loadMusics = function (assetManager) {
        var binaryTask1 = assetManager.addBinaryFileTask("mall", "sounds/mall.mp3");
        binaryTask1.onSuccess = function (task) {
            SoundManager.mall = new BABYLON.Sound("mall", "sounds/mall.mp3", Game.scene, function () { console.log("mall pret!"); }, { autoplay: true, loop: true, volume: 0.05 });
        };
        var binaryTask2 = assetManager.addBinaryFileTask("disco", "sounds/disco.mp3");
        binaryTask2.onSuccess = function (task) {
            SoundManager.disco = new BABYLON.Sound("disco", "sounds/disco.mp3", Game.scene, function () { console.log("disco pret!"); }, { autoplay: false, loop: false });
        };
    };
    SoundManager.soundReady = function () {
        SoundManager.soundCounter -= 1;
        if (SoundManager.soundCounter == 0)
            console.log("les sons sont prêt!");
    };
    SoundManager.playSound = function (pID) {
        //A améliorer avec callback et tout
        //SoundManager.currentSoundDialogue = SoundManager.Dialogs[pID];
        //SoundManager.currentSoundDialogue.play();s
        //SoundManager.Dialogs[pID].play();
        if (SoundManager.currentSoundDialogue.isPlaying) {
            SoundManager.currentSoundDialogue.stop();
        }
        SoundManager.currentSoundDialogue = new BABYLON.Sound(pID, "sounds/" + pID.substring(7, 9) + ".mp3", Game.scene, function () { }, { autoplay: true, loop: false });
    };
    SoundManager.stopSound = function () {
        SoundManager.currentSoundDialogue.stop();
    };
    SoundManager.playMusic = function (pName) {
        switch (pName) {
            case "mall":
                if (!SoundManager.mall.isPlaying)
                    SoundManager.mall.play();
                break;
            case "disco":
                if (!SoundManager.disco.isPlaying)
                    SoundManager.disco.play();
                break;
            default: console.log("play music " + pName);
        }
    };
    SoundManager.stopMusic = function (pName) {
        switch (pName) {
            case "mall":
                if (SoundManager.mall.isPlaying)
                    SoundManager.mall.stop();
                break;
            case "disco":
                if (SoundManager.disco.isPlaying)
                    SoundManager.disco.stop();
                break;
            default: console.log("stop music " + pName);
        }
    };
    return SoundManager;
}());
//# sourceMappingURL=SoundManager.js.map