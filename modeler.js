"use strict";
const modelObjectsInArray = (arr)=>{
    let model = {};
    for (let i = 0; i < arr.length; i++){
        merge(model, propertiesFromObject(arr[i]));
    }

    return model;
};

// TODO: Deal with null values.
const propertiesFromObject = (source)=>{
    if (typeof source === "object") {
        // go through every property
        let propsObj = {};

        for (let property in source) {
            if (source.hasOwnProperty(property) && typeof source[property] === "object" && source[property] !== null) {
                if (source[property] instanceof Array) {
                    // TODO: Deal with arrays with elements of different types.
                    propsObj[property] = {type: "array", element: modelObjectsInArray(source[property])};
                } else {
                    propsObj[property] = {type: "object", properties: propertiesFromObject(source[property])};
                }
            } else {
                propsObj[property] = {type: typeof source[property]};
            }
        }

        return propsObj;
    } else {
        // it's not really an "object," is it?
        return {type: typeof source};
    }
};

const merge = (destination, source)=>{
    let modelObj = {};

    for (let property in source) {
        if (source.hasOwnProperty(property) && typeof source[property] === "object" && source[property] !== null && destination[property]) {
            merge(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
};

class ObjectModel {
    constructor(input, modelName){
        modelName = modelName || this.constructor.name;

        // check to see if input is an array
        if (!(input instanceof Array)){
            throw new TypeError("Object Modeler input must be an array.");
        }

        let model = function(){
            merge(this, modelObjectsInArray(input));
        };
        Object.defineProperty(model, 'name', {value: modelName});

        return new model();
    }
}

module.exports = (input, modelName)=>{
    // give em a new model object
    return new ObjectModel(input, modelName);
};