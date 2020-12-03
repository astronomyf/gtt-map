const express = require("express");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const request = require("request");
const router = express.Router();
const db = require("./../config/db.config");

router.get("/bus/:bus", (req, res) => {
  const { bus } = req.params;

  const requestSettings = {
    method: "GET",
    url: "http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx",
    encoding: null,
  };

  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
        new Uint8Array(body)
      );

      const currentBusToSend = feed.entity.filter(
        (e) => e.vehicle.trip.routeId === `${bus}U`
      );

      res.json(currentBusToSend);
    } else {
      console.log("Error");
    }
  });
});

router.get("/route/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT shape_id, shape_pt_lat, shape_pt_lon FROM shapes WHERE shape_id = ?",
    id,
    (err, rows) => {
      if (err) throw err;

      let listOfCoords = [];

      if (rows.length > 0) {
        for (const el of rows) {
          listOfCoords.push({ lat: el.shape_pt_lat, lon: el.shape_pt_lon });
        }

        res.json({ id: id, coords: listOfCoords });
      } else {
        res.json({ error: true, message: "The id does not exist." });
      }
    }
  );
});

module.exports = router;
