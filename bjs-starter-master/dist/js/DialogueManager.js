var DialogueManager = (function () {
    function DialogueManager(pDialog, pUiMan, pTriggerMan) {
        this.currentIndex = null;
        this.currentIndexDialog = 0;
        this.uiMan = pUiMan;
        this.triggerMan = pTriggerMan;
        this.Dialogs = pDialog;
        window.addEventListener('onEndDrawDialogue', this.nextStep.bind(this));
        window.addEventListener('onTriggerDialogue', this.chargeDialog.bind(this));
    }
    DialogueManager.prototype.chargeDialog = function () {
        if (this.Dialogs != null) {
            this.currentDialog = this.Dialogs["dialog_" + DialogueManager.eventParam];
            console.log("Dial: ", this.currentDialog["text"][0]);
            this.uiMan.drawPrettyText(this.currentDialog["text"][0]);
        }
    };
    DialogueManager.prototype.nextStep = function () {
        this.currentIndexDialog++;
        if (this.currentIndexDialog >= this.currentDialog["text"].length) {
            if (this.currentDialog["endCallback"] != null) {
                var lLenght = this.currentDialog["endCallback"].length;
                for (var i = 0; i < lLenght; i++)
                    this.checkCallback(this.currentDialog["endCallback"][i]["fct"], this.currentDialog["endCallback"][i]["param"]);
            }
            this.currentIndexDialog = 0;
        }
        else {
            this.uiMan.drawPrettyText(this.currentDialog["text"][this.currentIndexDialog]);
        }
    };
    DialogueManager.prototype.checkCallback = function (pAction, pParam) {
        if (pAction == null)
            return;
        switch (pAction) {
            case "DisablePlayer":
                Player.getInstance().canMove = false;
                break;
            case "EnablePlayer":
                Player.getInstance().canMove = true;
                break;
            case "Teleport":
                break;
            case "EnableTrigger":
                this.triggerMan.switchTriggerArray([], true, "Trigger-Dial_" + pParam);
                console.log("Trigger-Dial_" + pParam);
                break;
            case "DisableTrigger":
                this.triggerMan.switchTriggerArray([], false, "Trigger-Dial_" + pParam);
                console.log("Trigger-Dial_" + pParam);
                break;
            default: console.log("No Callback");
        }
    };
    return DialogueManager;
}());
//# sourceMappingURL=DialogueManager.js.map