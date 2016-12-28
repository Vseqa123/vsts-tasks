var computeManagementClient = require("azure-arm-compute");
import util = require("util");
import tl = require("vsts-task-lib/task");
import azure_utils = require("./AzureUtil");
import deployAzureRG = require("./DeployAzureRG");
import Q = require('q');

export class MGExtensionManager {
    private taskParameters: deployAzureRG.AzureRGTaskParameters;
    private credentials;
    private subscriptionId: string;
    private azureUtils;
    private failureCount: number;
    private successCount: number;
    private errors: string;
    private vmCount: number;
    private deferred;
    private operation: string;
    private computeClient;

    constructor(taskParameters: deployAzureRG.AzureRGTaskParameters) {
        this.taskParameters = taskParameters;
        this.credentials = this.taskParameters.credentials;
        this.subscriptionId = this.taskParameters.subscriptionId;
        this.azureUtils = new azure_utils.AzureUtil(this.taskParameters);
        this.successCount = 0;
        this.failureCount = 0;
        this.vmCount = 0;
        this.operation = "";
        this.computeClient = new computeManagementClient(this.credentials, this.subscriptionId);
        return this;
    }

    private setTaskResult() {
        if (this.failureCount + this.successCount == this.vmCount) {
            if (this.failureCount > 0) {
                console.log("Operation " + this.operation + " did not succeed for all the VMs");
            }
            else {
                console.log("Operation " + this.operation + " succeeded for all the VMs");
            }
            this.deferred.resolve("");
        }
    }

    private postOperationCallBack = (error, result, request, response) => {
        if (error) {
            this.failureCount++;
            this.errors += error.message;
            this.errors += "\n";
        } else {
            this.successCount++;
        }
        this.setTaskResult();
    }

    private installMGExtensionOnVMs = (listOfVms) => {
        this.vmCount = listOfVms.length;
        for (var i = 0; i < listOfVms.length; i++) {
            var vmName = listOfVms[i]["name"];
            var extensionParameters = this.FormExtensionParameters(listOfVms[i], "enable");
            this.operation = "Install " + extensionParameters["extensionName"];
            console.log("Adding " + extensionParameters["extensionName"] + " extension to virtual machine " + vmName);
            this.computeClient.virtualMachineExtensions.createOrUpdate(this.taskParameters.resourceGroupName, extensionParameters["vmName"], extensionParameters["extensionName"], extensionParameters["parameters"], this.postOperationCallBack);
        }
    }

    public installMGExtension() {
        this.deferred = Q.defer<string>();
        var vmListPromise = this.azureUtils.getVMDetails();
        vmListPromise.then(this.installMGExtensionOnVMs);
        return this.deferred.promise;
    }

    private removeMGExtensionFromVMs = (listOfVms) => {
        this.vmCount = listOfVms.length;
        for (var i = 0; i < listOfVms.length; i++) {
            var vmName = listOfVms[i]["name"];
            var extensionParameters = this.FormExtensionParameters(listOfVms[i], "uninstall");
            this.operation = "Remove " + extensionParameters["extensionName"];
            console.log("Uninstalling " + extensionParameters["extensionName"] + " extension from virtual machine " + vmName);
            this.computeClient.virtualMachineExtensions.deleteMethod(this.taskParameters.resourceGroupName, extensionParameters["vmName"], extensionParameters["extensionName"], extensionParameters["parameters"], this.postOperationCallBack);
        }
    }

    public removeMGExtension() {
        this.deferred = Q.defer<string>();
        var vmListPromise = this.azureUtils.getVMDetails();
        vmListPromise.then(this.removeMGExtensionFromVMs);
        return this.deferred.promise;
    }

    private FormExtensionParameters(virtualMachine, extensionAction) {
        var vmId = virtualMachine["id"];
        var vmName = virtualMachine["name"];
        var vmOsType = virtualMachine["storageProfile"]["osDisk"]["osType"];
        var vmLocation = virtualMachine["location"];

        if (vmOsType == "Windows") {
            var extensionName = "TeamServicesAgent";
            var virtualMachineExtensionType: string = 'TeamServicesAgent';
            var typeHandlerVersion: string = '1.0';
        }
        else if (vmOsType == "Linux") {
            extensionName = "TeamServicesAgentLinux";
            virtualMachineExtensionType = 'TeamServicesAgentLinux';
            typeHandlerVersion = '1.0';
        }
        var autoUpgradeMinorVersion: boolean = true;
        var publisher: string = 'Microsoft.VisualStudio.Services';
        var extensionType: string = 'Microsoft.Compute/virtualMachines/extensions';
        //var collectionUri = tl.getVariable('system.TeamFoundationCollectionUri');
        //var teamProject = tl.getVariable('system.teamProject');
        var collectionUri = "https://testking123.visualstudio.com/";
        var teamProject = "AzureProj";
        var uriLength = collectionUri.length;
        if (collectionUri[uriLength - 1] == '/') {
            collectionUri = collectionUri.substr(0, uriLength - 1);
        }
        var tags = "";
        if (!!virtualMachine["tags"]) {
            console.log("Copying VM tags")
            tags = virtualMachine["tags"];
        }

        var publicSettings = { VSTSAccountName: collectionUri, TeamProject: teamProject, MachineGroup: this.taskParameters.machineGroupName, AgentName: "", Tags: tags };
        var protectedSettings = { PATToken: this.taskParameters.vstsPATToken };
        var parameters = { type: extensionType, virtualMachineExtensionType: virtualMachineExtensionType, typeHandlerVersion: typeHandlerVersion, publisher: publisher, autoUpgradeMinorVersion: autoUpgradeMinorVersion, location: vmLocation, settings: publicSettings, protectedSettings: protectedSettings };
        console.log("VM Location: " + vmLocation);
        return { vmName: vmName, extensionName: extensionName, parameters: parameters };
    }

}