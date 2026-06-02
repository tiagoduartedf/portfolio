// aka: Associative Array, Dictionary

/*
* complexity

* insertion: O(1)
* deletion: O(1)
* search: O(1)
*/

class MyMap {
	constructor() {
		this._data = {};
		this._size = 0;
	}
	
	set(key, value) {
		if(!this._data.hasOwnProperty(key)) {
			this._size++;
		}
		
		this._data[key] = value;
	}
	
	delete(key) {
		if(this._data.hasOwnProperty(key)) {
			this._size--;
			delete this._data[key];
		}
	}
	
	has(key) {
		return this._data.hasOwnProperty(key);
	}
	
	get(key) {
		return this._data[key];
	}
	
	size() {
		return this._size;
	}
}

const m = new MyMap();
console.log("Empty map: ", m);

m.set("key 1", { name: "Tiago", order: 10 });
m.set("key 2", { name: "Duarte", order: 6});
console.log("Map with two elements: ", m);

console.log("check key 1: ", m.has("key 1") );
console.log("get key 1: ", m.get("key 2") );


console.log("size before deleting key1: ", m.size());
m.delete("key2");
console.log("size after deleting key2: ", m.size());

