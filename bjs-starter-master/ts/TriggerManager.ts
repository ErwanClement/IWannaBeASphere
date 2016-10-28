class TriggerManager {
    private static _triggerActiveArray: Array<BABYLON.Mesh> = [];
    private _triggerInactiveArray: Array<BABYLON.Mesh> = [];
    public static eventParam: string;

    constructor() {
        window.addEventListener('onTriggerDialogue', this.disableTrigger.bind(this));
        window.addEventListener('onTeleport', this.clearActiveTrigger.bind(this));
    }


    public static get triggerActiveArray(): Array<BABYLON.Mesh> {
        return this._triggerActiveArray;
    };

    public clearActiveTrigger() {
        TriggerManager.triggerActiveArray = [];
    }



    //Permet d'ajouter un trigger (Il est desactiver de base)
    public addTrigger(pTriggerToAdd: BABYLON.Mesh) {
        console.log("TriggerManager: Add " + pTriggerToAdd.name);
        this._triggerInactiveArray.push(pTriggerToAdd);
        console.log("TriggerManager: Array " + this._triggerInactiveArray.length);
    } 

    public disableTrigger() {
        let lObjectToMove: BABYLON.Mesh;
        for (let j = 0; j < TriggerManager._triggerActiveArray.length; j++) {
            if (TriggerManager._triggerActiveArray[j].name == TriggerManager.eventParam) {
                 lObjectToMove = TriggerManager._triggerActiveArray[j];
                 this._triggerInactiveArray.push(lObjectToMove);
                 let indexOrigin = TriggerManager._triggerActiveArray.indexOf(lObjectToMove)
                 if (indexOrigin == -1) {
                     console.log("Error Trigger ID not found");
                     return;
                 }
                 TriggerManager._triggerActiveArray.splice(indexOrigin, 1);
           }
        }
    }

    //Active ou desactive un Trigger
    public switchTriggerArray(pTriggerToActivate: Array<BABYLON.Mesh>, pActivate: boolean = true, pTriggerToActivateString: string = null): void {
        let lOriginArray: Array<BABYLON.Mesh>;
        let lDestinationArray: Array<BABYLON.Mesh>;
        if (pActivate) {
            lOriginArray = this._triggerInactiveArray;
            lDestinationArray = TriggerManager._triggerActiveArray;
        } else {
            lOriginArray = TriggerManager._triggerActiveArray;
            lDestinationArray = this._triggerInactiveArray;
        }

        if (pTriggerToActivate.length != 0) {
            //Pour chaque objet que l'on veut ajouter ...
            for (let i = 0; i < pTriggerToActivate.length; i++) {
                let lObjectToMove: BABYLON.Mesh;
                //... on regarde �a position dans l'array ou il est stock�, ...
                for (let j = 0; j < lOriginArray.length; j++) {
                    if (lOriginArray[j].name == pTriggerToActivate[i].name) {
                        //... on le met dans l'array desir� ...
                        lObjectToMove = lOriginArray[j];
                        lDestinationArray.push(lObjectToMove);
                        //... et on l'enleve de l'ancien.
                        let indexOrigin = lOriginArray.indexOf(lObjectToMove)
                        if (indexOrigin == -1) {
                            console.log("Error Trigger ID not found");
                            return;
                        }
                        lOriginArray.splice(indexOrigin, 1);
                    }
                }
            }
        } else if (pTriggerToActivateString != null) {
            for (let j = 0; j < lOriginArray.length; j++) {
                if (lOriginArray[j].name == pTriggerToActivateString) {
                    let lObjectToMove: BABYLON.Mesh = lOriginArray[j];
                    lDestinationArray.push(lObjectToMove);
                    let indexOrigin = lOriginArray.indexOf(lObjectToMove)
                    if (indexOrigin == -1) {
                        console.log("Error Trigger ID not found");
                        return;
                    }
                    lOriginArray.splice(indexOrigin, 1);
                }
            }
        } else console.log("Error can switch");
    }
}