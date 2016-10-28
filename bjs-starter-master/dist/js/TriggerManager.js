var TriggerManager = (function () {
    function TriggerManager() {
        this._triggerInactiveArray = [];
        window.addEventListener('onTriggerDialogue', this.disableTrigger.bind(this));
        window.addEventListener('onTeleport', this.clearActiveTrigger.bind(this));
    }
    Object.defineProperty(TriggerManager, "triggerActiveArray", {
        get: function () {
            return this._triggerActiveArray;
        },
        enumerable: true,
        configurable: true
    });
    ;
    TriggerManager.prototype.clearActiveTrigger = function () {
        TriggerManager.triggerActiveArray = [];
    };
    //Permet d'ajouter un trigger (Il est desactiver de base)
    TriggerManager.prototype.addTrigger = function (pTriggerToAdd) {
        console.log("TriggerManager: Add " + pTriggerToAdd.name);
        this._triggerInactiveArray.push(pTriggerToAdd);
        console.log("TriggerManager: Array " + this._triggerInactiveArray.length);
    };
    TriggerManager.prototype.disableTrigger = function () {
        var lObjectToMove;
        for (var j = 0; j < TriggerManager._triggerActiveArray.length; j++) {
            if (TriggerManager._triggerActiveArray[j].name == TriggerManager.eventParam) {
                lObjectToMove = TriggerManager._triggerActiveArray[j];
                this._triggerInactiveArray.push(lObjectToMove);
                var indexOrigin = TriggerManager._triggerActiveArray.indexOf(lObjectToMove);
                if (indexOrigin == -1) {
                    console.log("Error Trigger ID not found");
                    return;
                }
                TriggerManager._triggerActiveArray.splice(indexOrigin, 1);
            }
        }
    };
    //Active ou desactive un Trigger
    TriggerManager.prototype.switchTriggerArray = function (pTriggerToActivate, pActivate, pTriggerToActivateString) {
        if (pActivate === void 0) { pActivate = true; }
        if (pTriggerToActivateString === void 0) { pTriggerToActivateString = null; }
        var lOriginArray;
        var lDestinationArray;
        if (pActivate) {
            lOriginArray = this._triggerInactiveArray;
            lDestinationArray = TriggerManager._triggerActiveArray;
        }
        else {
            lOriginArray = TriggerManager._triggerActiveArray;
            lDestinationArray = this._triggerInactiveArray;
        }
        if (pTriggerToActivate.length != 0) {
            //Pour chaque objet que l'on veut ajouter ...
            for (var i = 0; i < pTriggerToActivate.length; i++) {
                var lObjectToMove = void 0;
                //... on regarde �a position dans l'array ou il est stock�, ...
                for (var j = 0; j < lOriginArray.length; j++) {
                    if (lOriginArray[j].name == pTriggerToActivate[i].name) {
                        //... on le met dans l'array desir� ...
                        lObjectToMove = lOriginArray[j];
                        lDestinationArray.push(lObjectToMove);
                        //... et on l'enleve de l'ancien.
                        var indexOrigin = lOriginArray.indexOf(lObjectToMove);
                        if (indexOrigin == -1) {
                            console.log("Error Trigger ID not found");
                            return;
                        }
                        lOriginArray.splice(indexOrigin, 1);
                    }
                }
            }
        }
        else if (pTriggerToActivateString != null) {
            for (var j = 0; j < lOriginArray.length; j++) {
                if (lOriginArray[j].name == pTriggerToActivateString) {
                    var lObjectToMove = lOriginArray[j];
                    lDestinationArray.push(lObjectToMove);
                    var indexOrigin = lOriginArray.indexOf(lObjectToMove);
                    if (indexOrigin == -1) {
                        console.log("Error Trigger ID not found");
                        return;
                    }
                    lOriginArray.splice(indexOrigin, 1);
                }
            }
        }
        else
            console.log("Error can switch");
    };
    TriggerManager._triggerActiveArray = [];
    return TriggerManager;
}());
//# sourceMappingURL=TriggerManager.js.map