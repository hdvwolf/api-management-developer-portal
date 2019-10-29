import * as ko from "knockout";
import template from "./resetDetails.html";
import { Component } from "@paperbits/common/ko/decorators";
import { ProvisionService } from "../../services/provisioningService";
import { ViewManager } from "@paperbits/common/ui";

@Component({
    selector: "reset-details-workshop",
    template: template,
    injectable: "resetDetailsWorkshop"
})

export class ResetDetailsWorkshop {
    public readonly response: ko.Observable<string>;
    public readonly isYes: ko.Computed<boolean>;
    constructor (
        private readonly viewManager: ViewManager,
        private provisioningService: ProvisionService,
    ) {
        this.response = ko.observable("");
        this.isYes = ko.computed(() => this.response() == "yes");
    }

    public async reset(): Promise<void> {
        try {
            this.viewManager.notifySuccess("Website reset", `The website is being resetted...`);
            await this.provisioningService.cleanup();
            await this.provisioningService.provision();
            this.viewManager.closeWorkshop("content-workshop");
            const toast = this.viewManager.addToast("Website reset", `Website has been reset successfully...`, [
                {
                    title: "Reset",
                    iconClass: "paperbits-check-2",
                    action: async (): Promise<void> => {
                        this.viewManager.removeToast(toast);
                    }
                },
            ]);
        } 
        catch (error) {
            this.viewManager.notifyError("Confirm", `Unable to reset website. Please try again later.`);
        }
    }
}