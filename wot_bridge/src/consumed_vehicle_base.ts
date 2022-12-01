import * as WoT from "wot-typescript-definitions";
import request = require("request");

// Required steps to create a servient for a client
const { Servient, Helpers } = require("@node-wot/core");
const { HttpClientFactory } = require('@node-wot/binding-http');

export class ConsumedVehicle {
    public thing: WoT.ConsumedThing
    public td_url: string
    public servient = Servient
    public wotHelpers = Helpers

    constructor(td_url: string) {
        this.td_url = td_url;
        this.servient = new Servient();
        this.servient.addClientFactory(new HttpClientFactory(null));
        this.wotHelpers = new Helpers(this.servient);

        this.thing = ConsumedVehicle.tdConsume(this.td_url);
        this.observeProperties(this.thing);
        this.subscribe(this.thing);
    }

    // Read with rhythm Doo-Doo-Doo-DooDoo-DooDoo
    // I-don't-know-ifthis-willwork!

    private static tdConsume(url: string): WoT.ConsumedThing {

        return request(url, function (error, response, body) {
            if (error) {
                console.log("Error occurred when making get request on td url...\n");
                console.log(error);
                return error; // Don't have an elegant way to handle this yet
            } else {
                console.log("Successful Request: " + response.statusCode);
                console.log("TD url was queried successfully\n");
                let json = JSON.parse(body);
                return WoT.consume(json);
            }
        });
    }

    private observeProperties(thing: WoT.ConsumedThing) {
        thing.observeProperty("totalMileage", async (data) => {
            console.log("Observed 'totalMileage' property has changed! New value is:", await data.value());
        }).then(
            // Not sure what the promise here is but something happens...
        );

        thing.observeProperty("maintenanceNeeded", async (data) => {
            console.log("Observed 'maintenanceNeeded' property has changed! New value is:", await data.value());
        }).then(
            // Not sure what the promise here is but something happens...
        );

        thing.observeProperty("nextServiceDistance", async (data) => {
            console.log("Observed 'nextServiceDistance' property has changed! New value is:", await data.value());
        }).then(
            // Not sure what the promise here is but something happens...
        );
    }

    private subscribe(thing: WoT.ConsumedThing) {
        thing.subscribeEvent("eventLowOnOil", async (data) => {
            console.log("eventLowOnOil:", await data.value());
        }).then(
            // Still don't know what the promises do here...
            // Sing it with me now...
            // I-don't-know-ifthis--willwork
        );
        thing.subscribeEvent("eventLowTyrePressure", async (data) => {
            console.log("eventLowTyrePressure:", await data.value());
        }).then();
        thing.subscribeEvent("eventMaintenanceNeeded", async (data) => {
            console.log("eventMaintenanceNeeded:", await data.value());
        }).then();
    }
}