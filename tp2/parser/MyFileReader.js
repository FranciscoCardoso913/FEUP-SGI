import * as THREE from 'three';

/**
 *  1. in a given class file MyWhateverNameClass.js in the constructor call:
 * 
 *  this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
 *  this.reader.open("scenes/<path to json file>.json");	
 * 
 *  The last argumet in the constructor is a method that is called when the json file is loaded and parsed (see step 2).
 * 
 *  2. in the MyWhateverNameClass.js class, add a method with signature: 
 *     onSceneLoaded(data) {
 *     }
 * 
 *  This method is called once the json file is loaded and parsed successfully. The data argument is the entire scene data object. 
 * 
 */

class MyFileReader {

	/**
	   constructs the object
	*/
	constructor(onSceneLoadedCallback) {
		this.errorMessage = null;
		this.onSceneLoadedCallback = onSceneLoadedCallback;
	}

	open(jsonfile) {
		return fetch(jsonfile)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				this.onSceneLoadedCallback(data);
				return data; // Return the parsed data
			})
			.catch((error) => {
				console.error("Unable to fetch data:", error);
				throw error; // Re-throw the error so it propagates to the caller
			});
	}
	

}

export { MyFileReader };
