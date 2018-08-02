
function resetDatabase(dbName){

	var resetDatabaseState = false;
	var dropDatabaseState = db._dropDatabase(dbName);

	if(dropDatabaseState){

		var createDatabaseState = db._createDatabase(dbName);

		if(createDatabaseState){

			resetDatabaseState = true;

		}

	}

	return resetDatabaseState;

}

function createGraph(graphName, listEdges){

	var createGraphState = false;
	var graphModule = require("@arangodb/general-graph");
	var edgeDefinitions = graphModule._edgeDefinitions();

	for (var i = 0; i < listEdges.length; i++) {

		graphModule._extendEdgeDefinitions(edgeDefinitions, graphModule._relation(listEdges[i]["edgeName"], listEdges[i]["collectionsFrom"], listEdges[i]["collectionsTo"]));

	}

	var createState = graphModule._create(graphName, edgeDefinitions);

	if(createState != null){

		createGraphState = true;

	}

	return createGraphState;

}

//format example for listEdges: [{edgeName: "viaje", collectionsFrom: ["origen"], collectionsTo: ["destino"]}]
function loadGraph(dbName, graphName, listEdges){

	var dbSystem = "_system";
	var useDatabaseState = db._useDatabase(dbSystem);

	if(useDatabaseState){

		var resetDatabaseState = resetDatabase(dbName);

		if(resetDatabaseState){

			var useDatabaseState = db._useDatabase(dbName);

			if(useDatabaseState){

				var createGraphState = createGraph(graphName, listEdges);

				if(createGraphState){

					var useDatabaseState = db._useDatabase(dbSystem);

					if(useDatabaseState){

						require("@arangodb").print("Ok: Grafo '" + graphName + "' creado con exito");

					}else {
						
						require("@arangodb").print("Error: No se pudo acceder a la base de datos " + dbSystem);

					}

				}else {

					require("@arangodb").print("Error: No se pudo crear el grafo " + graphName);
					
				}

			}else{

				require("@arangodb").print("Error: No se pudo acceder a la base de datos " + dbName);

			}

		}else {
			
			require("@arangodb").print("Error: No se pudo resetear la base de datos " + dbName);

		}

	}else {
		
		require("@arangodb").print("Error: No se pudo acceder a la base de datos " + dbSystem);

	}

}