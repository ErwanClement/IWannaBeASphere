var DialogueManager = (function () {
    function DialogueManager(pDialog, pUiMan) {
        this.currentIndex = null;
        this.currentIndexDialog = 0;
        this.uiMan = pUiMan;
        this.Dialogs = pDialog;
        window.addEventListener('onEndDrawDialogue', this.nextStep.bind(this));
        window.addEventListener('onTriggerDialogue', this.chargeDialog.bind(this));
        this.uiMan.drawPrettyText("text", true);
    }
    DialogueManager.prototype.chargeDialog = function () {
        if (this.Dialogs != null) {
            this.currentDialog = this.Dialogs["dialog_" + DialogueManager.eventParam];
            console.log("Dial: ", this.currentDialog["text"][0]);
            if (this.currentIndexDialog == 0)
                this.checkCallback(this.currentDialog["startCallback"]);
            this.uiMan.drawPrettyText(this.currentDialog["text"][0]);
        }
    };
    DialogueManager.prototype.nextStep = function () {
        this.currentIndexDialog++;
        if (this.currentIndexDialog >= this.currentDialog["text"].length) {
            this.checkCallback(this.currentDialog["endCallback"]);
            this.currentIndexDialog = 0;
        }
        else {
            this.uiMan.drawPrettyText(this.currentDialog["text"][this.currentIndexDialog]);
        }
    };
    DialogueManager.prototype.checkCallback = function (pAction) {
        if (pAction == null)
            return;
        switch (pAction) {
            case "DisablePlayer":
                Player.getInstance().canMove = false;
                break;
            case "EnablePlayer":
                Player.getInstance().canMove = true;
                break;
            default: console.log("No Callback");
        }
    };
    return DialogueManager;
}());
//# sourceMappingURL=DialogueManager.js.map