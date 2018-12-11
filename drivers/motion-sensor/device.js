'use strict';
const Homey = require('homey');
const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class OrviboSensor extends ZigBeeDevice {
	onMeshInit() {

		// Register attribute listener for occupancy
		// this._attrReportListeners['0_msOccupancySensing'] = this._attrReportListeners['0_msOccupancySensing'] || {};
		// this._attrReportListeners['0_msOccupancySensing']['occupancy'] = this.onOccupancyReport.bind(this);
		
		try {
			this.registerCapability('alarm_motion', 'msOccupancySensing', {
				get: 'occupancy',
				reportParser: value => value === 1
			});


		} catch (err) {
			this.error('failed to register mapping registerCapability ', err);
		}

		this.registerAttrReportListener(
			'msOccupancySensing', // Cluster
			'occupancy', // Attr
			1, // Min report interval in seconds (must be greater than 1)
			3600, // Max report interval in seconds (must be zero or greater than 60 and greater than min report interval)
			0, // Report change value, if value changed more than this value send a report
			this.onOccupancyReport.bind(this),0) // Callback with value
				.then(() => {
					// Registering attr reporting succeeded
					this.log('registered attr report listener');
				})
				.catch(err => {
					// Registering attr reporting failed
					this.error('failed to register attr report listener', err);
				});
	}

	onOccupancyReport(value) {
		this.log('alarm_motion', value === 1);

		// Set and clear motion timeout
		try {
			
		clearTimeout(this.motionTimeout);
		this.motionTimeout = setTimeout(() => {
			this.log('manual alarm_motion reset');
			this.setCapabilityValue('alarm_motion', false);
		}, (this.getSetting('alarm_motion_reset_window') || 300) * 1000);

		// Update capability value
		this.setCapabilityValue('alarm_motion', value === 1);
		} catch (error) {
			this.error('failed to set value', err);
		}
	}
}

module.exports = OrviboSensor;
