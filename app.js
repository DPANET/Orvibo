'use strict';

const Homey = require('homey');
class OrviboApp extends Homey.App {

    onInit() {
        this.log(`Orvibo is running! `);
    }

}

module.exports = OrviboApp;