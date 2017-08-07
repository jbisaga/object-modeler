/* - - - - - - - - - - - - - MODEL FROM OBJECTS - - - - - - - - - - - - - - - -
 *  This is an experimental module that will model object prototype from an 
 *  array of objects.
 *
 *  The input will be an array of objects of any similarity.
 *  The output will be an object with properties from both, each of which
 *  denotes the type of the input property given.
 *
 *  Example:
 *  for an input of
 *  [
 *      {
 *          foo: 'asdf',
 *          bar: 22
*       },
*       {
*           foo: 'qwerty',
*           baz: false
*       }
 *  ]
 *
 *  the expected output would be
 *
 *  {
 *      foo: 'string',
 *      bar: 'int',
 *      baz: 'bool'
 *  }
 *
 *  This is obviously also designed to work recursively to n levels of
 *  recursion for objects of any depth.
 *
 *  Written by John Bisaga
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
"use strict";

const propertiesFromObject = (source)=>{
    let propsObj = {};

    for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null) {
            propsObj[property] = propertiesFromObject(source[property]);
        } else {
            propsObj[property] = typeof source[property];
        }
    }

    return propsObj;
};

const merge = (destination, source)=>{
    let modelObj = {};

    for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) {
            merge(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
};

class ObjectModel {
    constructor(input, modelName){
        modelName = modelName || this.constructor.name;

        let model = function(){
            for (let i = 0; i < input.length; i++){
                merge(this, propertiesFromObject(input[i]));
            }
        };
        Object.defineProperty(model, 'name', {value: modelName});

        return new model();
    }
}

module.exports = (input, modelName)=>{
    // give em a new model object
    return new ObjectModel(input, modelName);
};