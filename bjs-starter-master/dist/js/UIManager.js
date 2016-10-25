var UIManager = (function () {
    function UIManager(pScene) {
        this.eventEnd = new Event('onEndDrawDialogue');
        this.drawTime = 150;
        this.drawEnd = true;
        this.scene = pScene;
        this.UIText = new BABYLON.Text2D("", {
            id: "text",
            marginAlignment: "h: center, v:center",
            fontName: "20pt Arial",
        });
        this.UI = new BABYLON.ScreenSpaceCanvas2D(this.scene, {
            id: "ScreenCanvas",
            size: new BABYLON.Size(1000, 150),
            backgroundFill: "#4040408F",
            backgroundRoundRadius: 50,
            x: window.innerWidth / 2 - 1000,
            children: [this.UIText]
        });
        this.UI.levelVisible = false;
        this.UI.actionManager = new BABYLON.ActionManager(this.scene);
    }
    UIManager.prototype.drawPrettyText = function (pString, test) {
        if (test === void 0) { test = false; }
        console.log(pString);
        if (pString == null || pString == undefined || pString == "")
            return;
        this.UI.levelVisible = true;
        this.clearPrettyDrawVar();
        this.stringToDraw = pString;
        this.UI.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, this.onClickText.bind(this)));
        this.intervalFunct = setInterval(this.addCharToDrewText.bind(this), this.drawTime);
    };
    UIManager.prototype.addCharToDrewText = function () {
        this.currentDrawString = "";
        for (var i = 0; i < this.stringToDraw.length; i++) {
            if (i >= this.countDrawLetter) {
                this.UIText.text = this.currentDrawString;
                this.countDrawLetter++;
                return;
            }
            this.currentDrawString += this.stringToDraw[i];
        }
        this.UIText.text = this.stringToDraw;
        this.drawEnd = true;
        clearInterval(this.intervalFunct);
    };
    ;
    UIManager.prototype.clearPrettyDrawVar = function () {
        this.UIText.text = " ";
        this.stringToDraw = " ";
        this.currentDrawString = " ";
        this.countDrawLetter = 0;
        this.drawEnd = false;
    };
    UIManager.prototype.onClickText = function () {
        if (this.drawEnd) {
            this.UI.actionManager.actions = [];
            this.UI.levelVisible = false;
            window.dispatchEvent(this.eventEnd);
        }
        else {
            clearInterval(this.intervalFunct);
            this.drawEnd = true;
            this.UIText.text = this.stringToDraw;
        }
    };
    return UIManager;
}());
//# sourceMappingURL=UIManager.js.map