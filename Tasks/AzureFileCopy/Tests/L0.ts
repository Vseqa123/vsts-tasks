/// <reference path="../../../definitions/mocha.d.ts"/>
/// <reference path="../../../definitions/node.d.ts"/>
/// <reference path="../../../definitions/Q.d.ts"/>

import Q = require('q');
import assert = require('assert');
import path = require('path');

var psm = require('../../../Tests/lib/psRunner');
var shell = require('shelljs');
var ps = shell.which('powershell.exe');
var psr = null;

describe('AzureFileCopy Suite', function () {
    this.timeout(20000);

    before((done) => {
        if (ps) {
            psr = new psm.PSRunner();
            psr.start();
        }
        done();
    });

    after(function () {
        psr.kill();
    });

    if(ps) {
        it('Validate AzureFileCopy.Utility Get-AzureUtility', (done) => {
            psr.run(path.join(__dirname, 'L0ValidateGetAzureUtility.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Validate-AzurePowershellVersion', (done) => {
            psr.run(path.join(__dirname, 'L0ValidateAzurePSVersion.ps1'), done);
        });
       /*it('Validate AzureFileCopy.Utility Get-StorageKey', (done) => {
            psr.run(path.join(__dirname, 'L0ValidateGetStorageKey.ps1'), done);
        });*/
        it('Validate AzureFileCopy.Utility Get-StorageKey', (done) => {
            psr.run(path.join(__dirname, 'L0UtilityThrowError.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Upload-FilesToAzureContainer', (done) => {
            psr.run(path.join(__dirname, 'L0UploadFilesToAzureContainer.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Does-AzureVMMatchTagFilterCriteria', (done) => {
            psr.run(path.join(__dirname, 'L0DoesAzureVMMatchTagFilter.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-TagBasedFilteredAzureVMs', (done) => {
            psr.run(path.join(__dirname, 'L0GetTagBasedFilteredAzureVMs.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-MachineBasedFilteredAzureVMs', (done) => {
            psr.run(path.join(__dirname, 'L0GetMachineBasedFilteredAzureVMs.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-FilteredAzureVMsInResourceGroup', (done) => {
            psr.run(path.join(__dirname, 'L0GetFilteredAzureVmsInResourceGroup.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-FilteredAzureClassicVMsInResourceGroup', (done) => {
            psr.run(path.join(__dirname, 'L0GetFilteredAzureClassicVmsInRG.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-FilteredAzureRMVMsInResourceGroup', (done) => {
            psr.run(path.join(__dirname, 'L0GetFilteredAzureRMVmsInResourceGroup.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-MachineNameFromId', (done) => {
            psr.run(path.join(__dirname, 'L0GetMachineNameFromId.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-MachinesFqdnsForLB', (done) => {
            psr.run(path.join(__dirname, 'L0GetMachinesFqdnForLB.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-FrontEndPorts', (done) => {
            psr.run(path.join(__dirname, 'L0GetFrontEndPorts.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-AzureRMVMsConnectionDetailsInResourceGroup', (done) => {
            psr.run(path.join(__dirname, 'L0GetRMVMConnectionDetailsInRG.ps1'), done);
        });
        /*it('Validate AzureFileCopy.Utility  Check-AzureCloudServiceExists', (done) => {
            psr.run(path.join(__dirname, 'L0CheckCloudServiceExists.ps1'), done);
        });
        */
        it('Validate AzureFileCopy.Utility Get-AzureVMResourcesProperties', (done) => {
            psr.run(path.join(__dirname, 'L0GetAzureVMResourcesProperties.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-SkipCACheckOption', (done) => {
            psr.run(path.join(__dirname, 'L0GetSkipCACheckOption.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Get-AzureVMsCredentials', (done) => {
            psr.run(path.join(__dirname, 'L0GetAzureVMsCredentials.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Copy-FilesParallelyToAzureVMs', (done) => {
            psr.run(path.join(__dirname, 'L0CopyFilesParallelyToAzureVMs.ps1'), done);
        });
        it('Validate AzureFileCopy.Utility Copy-FilesToAzureVMsFromStorageContainer', (done) => {
            psr.run(path.join(__dirname, 'L0CopyFilesToAzureVMsFromStorageContainer.ps1'), done);
        });
        //Validate-CustomScriptExecutionStatus
        
        it('Validate AzureFileCopy.Utility Validate-CustomScriptExecutionStatus', (done) => {
            psr.run(path.join(__dirname, 'L0ValidateCustomScriptExecutionStatus.ps1'), done);
        });
    }   
});