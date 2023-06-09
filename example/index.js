import CasePathImporter, {DataImporter} from "screeps-db-importer-test";

// CasePathImporter
CasePathImporter("default/performanceServer");

// DataImporter
const dataToUpload = {
  // rooms.objects collection
    "rooms.objects": [
      // an object with whatever value you want
      {
        "type": "extension",
        "room": "W1N1",
        "x": 17,
        "y": 10,
        // set username as this will be converted to userId
        "username": "W1N1",
        "store": {
          "energy": 3000
        },
        "storeCapacityResource": {
          "energy": 30000
        },
        "hits": 50000,
        "hitsMax": 100000
      }
    ]
  }
DataImporter(dataToUpload)