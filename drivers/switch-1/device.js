'use strict';

const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;
const maxMoveLevel = 255;
const minMoveLevel = 0;
class SwitchSingleLN extends ZigBeeDevice {

    onMeshInit() {
        //enable debugging
        this.enableDebug();
        this.printNode();
        // this.log('Zigbee Added');
        try {
            this.registerCapability('onOff', 'genOnOff', {
                set: value => value ? 'on' : 'off',
                setParser: () => ({}),
                get: 'onOff',
                reportParser: value => value === 1
            });
        } catch (err) {
            this.error('failed to register mapping registerCapability ', err);
        }

        // this.registerReportListener('genOnOff', 'onOff', report => {
		// 	console.log(report);
		// });

		this.registerAttrReportListener(
			'genOnOff', // Cluster
			'onOff', // Attr
			1, // Min report interval in seconds (must be greater than 1)
			3600, // Max report interval in seconds (must be zero or greater than 60 and greater than min report interval)
			1, // Report change value, if value changed more than this value send a report
			this.onSwitchOnReport.bind(this)) // Callback with value
				.then(() => {
					// Registering attr reporting succeeded
					this.log('registered attr report listener');
				})
				.catch(err => {
					// Registering attr reporting failed
					this.error('failed to register attr report listener', err);
				});
    }

    onSwitchOnReport(data) {
        this.log(data);

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
