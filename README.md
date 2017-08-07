# object-modeler
Create a model from an array of (preferably) similar JS objects.

Maybe it's a bunch of MongoDB documents or SQL result rows from a collection you're unfamiliar with. Maybe it's just the output of some module with poor documentation.
Either way, this is an extremely lightweight module will give you a model object compiled from all given objects.

##Installation
```
$ npm install object-modeler
```

##Parameters
* Array **collection** -- An array of objects to be modeled.
* string **modelName** (optional) -- If this is given, the model's constructor name will be set to it.

Setting **collection** to a type other than Array will result in a TypeError being thrown.

##Usage
Let's say we have an array of 2 objects representing people.
```
var collection = [
    {
        firstName: "Sharon",
        lastName: "White",
        age: 44,
        created: 2016-06-23T18:25:43.511Z, // Date when the record was created,
        spouse: {
            firstName: "Timothy",
            lastName: "White"
        },
        likes: [
            "Westerns",
            "Chardonnay",
            "Romantic trips with Tim"  
        ],
        admin: false
    },
    {
        firstName: "William",
        middleName: "Phillip",
        lastName: "Brown",
        age: 31,
        created: 2016-08-14T16:18:40.218Z
        spouse: null
        likes: null
        dislikes: [
            "Cats",
            "Rural areas",
            "Any movie with Seth Rogan",
            "Domestic beer",
            "People who aren't sufficiently jaded"
        ],
        admin: true
    }
];
```
By examining the two objects, we can see that
1. The two objects share most properties, but not all. Some of Sharon's properties are missing from William's object, and vice versa.
2. William is kind of a negative person.

In order to work with these objects as a collection, we'll use this module to see what an object in this collection _could_ have as properties.

```
var objectModeler = require('object-modeler');

var personModel = objectModeler(collection, 'PersonModel');

```
The value of **personModel** will be:
```
{
    firstName: {
        type: "string"
    },
    middleName: {
        type: "string"
    },
    lastName: {
        type: "string"
    },
    age: {
        type: "number"
    },
    created: {
        type: "string"   
    },
    spouse: {
        type: "object",
        properties: {
            "firstName": {
                type: "string"
            },
            "lastName: {
                type: "string"
            }
        }
    }
    likes: {
        type: "array",
        element: {
            type: "string"
        },
    },
    dislikes: {
        type: "array",
        element: {
            type: "string"
        },
    },
    admin: {
        type: "boolean"
    }
}
```
All properties found in objects have been modeled in **personModel** and their types documented.