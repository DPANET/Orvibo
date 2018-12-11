'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
const maxMoveLevel = 255;
const minMoveLevel = 0;
class SwitchSingleLN extends ZigBeeDevice {

    onMeshInit() {
        // enable debugging
        // this.enableDebug();
        // this.printNode();
        // this.log('Zigbee Added');
        try {
            this.registerCapability('onoff', 'genOnOff', {
                set: value => value ? 'on' : 'off',
                setParser: () => ({}),
                get: 'onOff',
                reportParser: value => value === 1
            });
        } catch (err) {
            this.error('failed to registe mapping registerCapability ', err);
        }
        this.registerAttrReportListener('genOnOff', 'onOff', 1, 3600, 1,
            this.onSwitchOnReport.bind(this), 0, true);
    }

    onSwitchOnReport(value) {
        this.log(value);

        this.log('Received data =', data);
        this.setCapabilityValue('onoff', data === 1)
            .then(() => { })
            .catch(err => {
                // Registering attr reporting failed
                this.error('failed to set on/off setCapabilityValue', err);
            });

    }
}



module.exports = SwitchSingleLN;
