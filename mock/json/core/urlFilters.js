const generateUrlFiltersData = (number) => {
    const urlFilters = [];
    for (let index = 1; index < number; index++) {
        urlFilters.push(generateFilterUrlData(index));
    }
    return urlFilters;
};

const generateFilterUrlData = (number) => {

    if([6].includes(number) ){
        return objectsObjectsArrayUrlFilterJson(number);
    }

    if([7].includes(number) ){
        return objectsSimpleSimpleUrlFilterJson(number);
    }

    if([8].includes(number) ){
        return objectsUrlFilterJson(number);
    }

    if([9].includes(number) ){
        return objectsFastURLFilterJson(number);
    }

    if([10].includes(number) ){
        return objectsSimpleUrlFilterJson(number);
    }

    if([11].includes(number) ){
        return objectsBasicSeleniumFilterJson(number);
    }

    return simpleUrlFilterJson(number);
}

const simpleUrlFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilter.' + number,
        'name': {
            'default': 'My filter number ' + number,
            'translationKey': 'my.filter.translation.key.' + number
        },
        'help': {
            'default': 'My Filter Fake Help'
        },
        'parameters': [
            {
                'id': 'string1',
                'name': {
                    'default': 'String parameter 1',
                    'translationKey': 'my.string.parameter1'
                },
                'type': {
                    'type': 'string',
                    'required': true,
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1
                },
                'help': {
                    'default': 'string1 help'
                },
            },
            {
                'id': 'integer2',
                'name': {
                    'default': 'Integer parameter 2',
                    'translationKey': 'my.integer.parameter2'
                },
                'type': {
                    'type': 'integer',
                    'required': true,
                    'minimum': 0,
                    'maximum': 10
                },
                'help': {
                    'default': 'integer2 help'
                },
            },
            {
                'id': 'number3',
                'name': {
                    'default': 'Number parameter 3',
                    'translationKey': 'my.number.parameter3'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 2.56,
                    'maximum': 10.37
                },
                'help': {
                    'default': 'number3 help'
                },
            },
            {
                'id': 'boolean4',
                'name': {
                    'default': 'Boolean parameter 4',
                    'translationKey': 'my.boolean.parameter4'
                },
                'type': {
                    'type': 'boolean',
                    'required': true
                },
                'help': {
                    'default': 'boolean4 help'
                },
            },
            {
                'id': 'boolean41_pizza',
                'name': {
                    'default': 'Do you like pizza ?',
                    'translationKey': 'my.boolean.parameter41'
                },
                'type': {
                    'type': 'boolean',
                    'required': true
                }
            },
            {
                'id': 'integer21_pizza',
                'name': {
                    'default': 'How many pizzas do you eat per week ?',
                    'translationKey': 'my.integer.parameter11'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 5,
                    'maximum': 100
                },
                'help': {
                    'default': 'Please enter number of pizza '
                }
            },
            {
                'id': 'number31_pizza',
                'name': {
                    'default': 'What pizza size is preferable (in m) ?',
                    'translationKey': 'my.number.parameter31'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 0.1,
                    'maximum': 1.9
                },
                'help': {
                    'default': 'Please enter size of pizza '
                }
            },
            {
                'id': 'array_string5',
                'name': {
                    'default': 'Array string parameter 5',
                    'translationKey': 'my.array.string.parameter5'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'string',
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1,
                    'minArrayLength': 2,
                    'maxArrayLength': 6
                }
            },
            {
                'id': 'array_integer6',
                'name': {
                    'default': 'Array integer parameter 6',
                    'translationKey': 'my.array.integer.parameter6'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'integer',
                    'minimum': 0,
                    'maximum': 10,
                    'minArrayLength': 0,
                    'maxArrayLength': 7
                },
                'help': {
                    'default': 'Help for Array integer parameter 6 '
                }
            },
            {
                'id': 'array_number7',
                'name': {
                    'default': 'Array number parameter 7',
                    'translationKey': 'my.array.number.parameter7'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'number',
                    'minimum': 1.2,
                    'maximum': 10.5,
                    'minArrayLength': 1,
                    'maxArrayLength': 10
                }
            },
            {
                'id': 'array_boolean8',
                'name': {
                    'default': 'Array boolean parameter 8',
                    'translationKey': 'my.array.boolean.parameter8'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'boolean',
                    'minArrayLength': 2,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help for Array boolean parameter 8 '
                }
            }
        ]
    };
};

const objectsSimpleUrlFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilterSimple',
        'name': {
            'default': 'My filter Object with simple array ' + number ,
            'translationKey': 'my.key'
        },
        'help': {
            'default': 'Help text for the Filter with simple with Objects  ' + number
        },
        'parameters': [
            {
                'id': 'param1',
                'name': {
                    'default': 'String parameter',
                    'translationKey': 'my.string.parameter1'
                },
                'type': {
                    'type': 'string',
                    'required': true,
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1
                },
                'help': {
                    'default': 'Help text for param1'
                }
            },
            {
                'id': 'param2',
                'name': {
                    'default': 'Integer parameter',
                    'translationKey': 'my.integer.parameter2'
                },
                'type': {
                    'type': 'integer',
                    'required': true,
                    'minimum': 0,
                    'maximum': 10
                },
                'help': {
                    'default': 'Help text for param2'
                }
            },
            {
                'id': 'param3',
                'name': {
                    'default': 'Number parameter',
                    'translationKey': 'my.number.parameter3'
                },
                'type': {
                    'type': 'number',
                    'required': true,
                    'minimum': 2.56,
                    'maximum': 10.37
                },
                'help': {
                    'default': 'Help text for param3'
                }
            },
            {
                'id': 'param4',
                'name': {
                    'default': 'Boolean parameter',
                    'translationKey': 'my.boolean.parameter4'
                },
                'type': {
                    'type': 'boolean',
                    'required': true
                },
                'help': {
                    'default': 'Help text for param4'
                }
            },
            {
                'id': 'param5',
                'name': {
                    'default': 'Array string parameter',
                    'translationKey': 'my.array.string.parameter5'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'string',
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1,
                    'minArrayLength': 0,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help text for param5'
                }
            },
            {
                'id': 'param6',
                'name': {
                    'default': 'Array integer parameter',
                    'translationKey': 'my.array.integer.parameter6'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'integer',
                    'minimum': 0,
                    'maximum': 10,
                    'minArrayLength': 0,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help text for param6'
                }
            },
            {
                'id': 'param7',
                'name': {
                    'default': 'Array number parameter',
                    'translationKey': 'my.array.number.parameter7'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'number',
                    'minimum': 1.2,
                    'maximum': 10.5,
                    'minArrayLength': 0,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help text for param7'
                }
            },
            {
                'id': 'param8',
                'name': {
                    'default': 'Array boolean parameter',
                    'translationKey': 'my.array.boolean.parameter8'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'boolean',
                    'minArrayLength': 0,
                    'maxArrayLength': 10
                },
                'help': {
                    'default': 'Help text for param8'
                }
            },
            {
                'id': 'param9',
                'name': {
                    'default': 'Object parameter',
                    'translationKey': 'my.object.parameter6'
                },
                'type': {
                    'type': 'object',
                    'name': {
                        'default': 'Object parameter',
                        'translationKey': 'my.object.parameter6'
                    },
                    'required': true,
                    'parameters': [
                        {
                            'id': 'param_object_1',
                            'name': {
                                'default': 'String parameter',
                                'translationKey': 'my.string.parameter1'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^[a-zA-Z]*$',
                                'maxLength': 10,
                                'minLength': 1
                            },
                            'help': {
                                'default': 'Help text for param1'
                            }
                        },
                        {
                            'id': 'param_object_2',
                            'name': {
                                'default': 'Integer parameter',
                                'translationKey': 'my.integer.parameter2'
                            },
                            'type': {
                                'type': 'integer',
                                'required': true,
                                'minimum': 0,
                                'maximum': 10
                            },
                            'help': {
                                'default': 'Help text for param2'
                            }
                        },
                        {
                            'id': 'param_object_3',
                            'name': {
                                'default': 'Number parameter',
                                'translationKey': 'my.number.parameter3'
                            },
                            'type': {
                                'type': 'number',
                                'required': true,
                                'minimum': 2.56,
                                'maximum': 10.37
                            },
                            'help': {
                                'default': 'Help text for param3'
                            }
                        },
                        {
                            'id': 'param_object_4',
                            'name': {
                                'default': 'Boolean parameter',
                                'translationKey': 'my.boolean.parameter4'
                            },
                            'type': {
                                'type': 'boolean',
                                'required': true
                            },
                            'help': {
                                'default': 'Help text for param4'
                            }
                        },
                        {
                            'id': 'param_object_5',
                            'name': {
                                'default': 'Array string parameter',
                                'translationKey': 'my.array.string.parameter5'
                            },
                            'type': {
                                'type': 'array',
                                'required': true,
                                'arrayType': 'string',
                                'pattern': '^[a-zA-Z]*$',
                                'maxLength': 10,
                                'minLength': 1,
                                'minArrayLength': 0,
                                'maxArrayLength': 10
                            },
                            'help': {
                                'default': 'Help text for param5'
                            }
                        }
                    ]
                },
                'help': {
                    'default': 'Help text for Object simple param8'
                }
            }
        ]
    };
}

const objectsObjectsArrayUrlFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilter' + number,
        'name': {
            'default': 'My filter with Array of Objects ' + number,
            'translationKey': 'my.key'
        },
        'help': {
            'default': 'Help text for the Filter with simple with Objects  ' + number
        },
        'parameters': [
            {
                'id': 'param1',
                'name': {
                    'default': 'String parameter',
                    'translationKey': 'my.string.parameter1'
                },
                'type': {
                    'type': 'string',
                    'required': true,
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1
                },
                'help': {
                    'default': 'Help text for param1'
                }
            },
            {
                'id': 'param2',
                'name': {
                    'default': 'Integer parameter',
                    'translationKey': 'my.integer.parameter2'
                },
                'type': {
                    'type': 'array',
                    'arrayType': 'integer',
                    'required': true,
                    'minimum': 0,
                    'maximum': 10,
                    'minArrayLength': 3,
                    'maxArrayLength': 12
                },
                'help': {
                    'default': 'Help text for param2'
                }
            },
            {
                'id': 'param3',
                'name': {
                    'default': 'Object parameter',
                    'translationKey': 'my.object.parameter6'
                },
                'type': {
                    'type': 'object',
                    'required': true,
                    'parameters': [
                        {
                            'id': 'param_object_1',
                            'name': {
                                'default': 'String parameter 1 object',
                                'translationKey': 'my.string.parameter.obj.1'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^[a-zA-Z]*$',
                                'maxLength': 10,
                                'minLength': 1
                            },
                            'help': {
                                'default': 'Help text for object string param 1'
                            }
                        },
                        {
                            'id': 'param_object_2',
                            'name': {
                                'default': 'Integer parameter 2 object ',
                                'translationKey': 'my.integer.parameter.obj.2'
                            },
                            'type': {
                                'type': 'integer',
                                'required': true,
                                'minimum': 0,
                                'maximum': 10
                            },
                            'help': {
                                'default': 'Help text for object integer param 2'
                            }
                        },
                        {
                            'id': 'param_object_3',
                            'name': {
                                'default': 'String objrct 3 object',
                                'translationKey': 'my.string.parameter.obj.3'
                            },
                            'type': {
                                'type': 'object',
                                'required': true,
                                'name': {
                                    'default': 'Object parameter 3',
                                    'translationKey': 'my.object.parameter3'
                                },
                                'parameters': [
                                    {
                                        'id': 'param_object_31',
                                        'name': {
                                            'default': 'String parameter 31 object',
                                            'translationKey': 'my.string.parameter.obj.31'
                                        },
                                        'type': {
                                            'type': 'string',
                                            'required': true,
                                            'pattern': '^[a-zA-Z]*$',
                                            'maxLength': 10,
                                            'minLength': 2
                                        },
                                        'help': {
                                            'default': 'Help text for object string param 31'
                                        }
                                    }
                                ]
                            },
                            'help': {
                                'default': 'Help text for object string param 1'
                            }
                        }
                    ]
                },
                'help': {
                    'default': 'Help text for Object simple param8'
                }
            },
            {
                'id': 'paramArrayObj4',
                'name': {
                    'default': 'Array of objects parameter',
                    'translationKey': 'my.array.string.parameter4'
                },
                'type': {
                    'type': 'array',
                    'required': true,
                    'arrayType': 'object',
                    'minArrayLength': 2,
                    'maxArrayLength': 10,

                    'parameters': [
                        {
                            'id': 'param_object_41',
                            'name': {
                                'default': 'String parameter 1 object',
                                'translationKey': 'my.string.parameter.obj.1'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^[a-zA-Z]*$',
                                'maxLength': 10,
                                'minLength': 1
                            },
                            'help': {
                                'default': 'Help text for object string param 1'
                            }
                        },
                        {
                            'id': 'param_object_42',
                            'name': {
                                'default': 'Integer parameter 2 object ',
                                'translationKey': 'my.integer.parameter.obj.2'
                            },
                            'type': {
                                'type': 'integer',
                                'required': true,
                                'minimum': 0,
                                'maximum': 10
                            },
                            'help': {
                                'default': 'Help text for object integer param 2'
                            }
                        },
                        {
                            'id': 'param_object_43',
                            'name': {
                                'default': 'String object 3 object',
                                'translationKey': 'my.string.parameter.obj.3'
                            },
                            'type': {
                                'type': 'object',
                                'required': true,
                                'name': {
                                    'default': 'Object parameter 43',
                                    'translationKey': 'my.object.parameter3'
                                },
                                'parameters': [
                                    {
                                        'id': 'param_object_431',
                                        'name': {
                                            'default': 'String parameter 431 object',
                                            'translationKey': 'my.string.parameter.obj.31'
                                        },
                                        'type': {
                                            'type': 'string',
                                            'required': true,
                                            'pattern': '^[a-zA-Z]*$',
                                            'maxLength': 10,
                                            'minLength': 2
                                        },
                                        'help': {
                                            'default': 'Help text for object string param 431'
                                        }
                                    }
                                ]
                            },
                            'help': {
                                'default': 'Help text for object string param 431'
                            }
                        }
                    ]

                },
                'help': {
                    'default': 'Help text for object param4'
                }
            },
        ]
    }
}

const objectsSimpleSimpleUrlFilterJson = (number) => {

    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilter ' + number,
        'name': {
            'default': 'My filter simple with Objects ' + number,
            'translationKey': 'my.key'
        },
        'help': {
            'default': 'Help text for the Filter with simple with Objects '  + number
        },
        'parameters': [
            {
                'id': 'param1',
                'name': {
                    'default': 'String parameter',
                    'translationKey': 'my.string.parameter1'
                },
                'type': {
                    'type': 'string',
                    'required': true,
                    'pattern': '^[a-zA-Z]*$',
                    'maxLength': 10,
                    'minLength': 1
                },
                'help': {
                    'default': 'Help text for param1'
                }
            },
            {
                'id': 'param2',
                'name': {
                    'default': 'Integer parameter',
                    'translationKey': 'my.integer.parameter2'
                },
                'type': {
                    'type': 'integer',
                    'required': true,
                    'minimum': 0,
                    'maximum': 10
                },
                'help': {
                    'default': 'Help text for param2'
                }
            },
            {
                'id': 'object1',
                'name': {
                    'default': 'Object parameter 1',
                    'translationKey': 'my.object.parameter6'
                },
                'type': {
                    'type': 'object',

                    'required': true,
                    'parameters': [
                        {
                            'id': 'param_object_11',
                            'name': {
                                'default': 'String parameter 11 object',
                                'translationKey': 'my.string.parameter.obj.1'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^[a-zA-Z]*$',
                                'maxLength': 10,
                                'minLength': 1
                            },
                            'help': {
                                'default': 'Help text for object string param 1'
                            }
                        },
                        {
                            'id': 'param_object_12',
                            'name': {
                                'default': 'Integer parameter 12 object ',
                                'translationKey': 'my.integer.parameter.obj.2'
                            },
                            'type': {
                                'type': 'integer',
                                'required': true,
                                'minimum': 0,
                                'maximum': 10
                            },
                            'help': {
                                'default': 'Help text for object integer param 2'
                            }
                        },
                        {
                            'id': 'object1_object2',
                            'name': {
                                'default': 'Object parameter 2',
                                'translationKey': 'my.string.parameter.obj.3'
                            },
                            'type': {
                                'type': 'object',
                                'required': true,
                                'parameters': [
                                    {
                                        'id': 'param_object_21',
                                        'name': {
                                            'default': 'String parameter 21 object',
                                            'translationKey': 'my.string.parameter.obj.31'
                                        },
                                        'type': {
                                            'type': 'string',
                                            'required': true,
                                            'pattern': '^[a-zA-Z]*$',
                                            'maxLength': 10,
                                            'minLength': 2
                                        },
                                        'help': {
                                            'default': 'Help text for object string param 31'
                                        }
                                    },
                                    {
                                        'id': 'param_object_22',
                                        'name': {
                                            'default': 'String parameter 22 object',
                                            'translationKey': 'my.string.parameter.obj.32'
                                        },
                                        'type': {
                                            'type': 'string',
                                            'required': true,
                                            'pattern': '^[a-zA-Z]*$',
                                            'maxLength': 10,
                                            'minLength': 3
                                        },
                                        'help': {
                                            'default': 'Help text for object string param 32'
                                        }
                                    }
                                ]
                            },
                            'help': {
                                'default': 'Help text for object param 2'
                            }
                        }
                    ]
                },
                'help': {
                    'default': 'Help text for Object simple param8'
                }
            }
        ]
    } ;

    // return {
    //     'id': 'eu.europa.ec.eurostat.wihp.MyFilter ' + number,
    //     'name': {
    //         'default': 'My filter simple with Objects ' + number,
    //         'translationKey': 'my.key'
    //     },
    //     'help': {
    //         'default': 'Help text for the Filter with simple with Objects  ' + number
    //     },
    //     'parameters': [
    //         {
    //             'id': 'param1',
    //             'name': {
    //                 'default': 'String parameter',
    //                 'translationKey': 'my.string.parameter1'
    //             },
    //             'type': {
    //                 'type': 'string',
    //                 'required': true,
    //                 'pattern': '^[a-zA-Z]*$',
    //                 'maxLength': 10,
    //                 'minLength': 1
    //             },
    //             'help': {
    //                 'default': 'Help text for param1'
    //             }
    //         },
    //         {
    //             'id': 'param2',
    //             'name': {
    //                 'default': 'Integer parameter',
    //                 'translationKey': 'my.integer.parameter2'
    //             },
    //             'type': {
    //                 'type': 'integer',
    //                 'required': true,
    //                 'minimum': 0,
    //                 'maximum': 10
    //             },
    //             'help': {
    //                 'default': 'Help text for param2'
    //             }
    //         },
    //         {
    //             'id': 'param9',
    //             'name': {
    //                 'default': 'Object parameter',
    //                 'translationKey': 'my.object.parameter6'
    //             },
    //             'type': {
    //                 'type': 'object',
    //                 'name': {
    //                     'default': 'Object parameter',
    //                     'translationKey': 'my.object.parameter6'
    //                 },
    //                 'required': true,
    //                 'parameters': [
    //                     {
    //                         'id': 'param_object_1',
    //                         'name': {
    //                             'default': 'String parameter 1 object',
    //                             'translationKey': 'my.string.parameter.obj.1'
    //                         },
    //                         'type': {
    //                             'type': 'string',
    //                             'required': true,
    //                             'pattern': '^[a-zA-Z]*$',
    //                             'maxLength': 10,
    //                             'minLength': 1
    //                         },
    //                         'help': {
    //                             'default': 'Help text for object string param 1'
    //                         }
    //                     },
    //                     {
    //                         'id': 'param_object_2',
    //                         'name': {
    //                             'default': 'Integer parameter 2 object ',
    //                             'translationKey': 'my.integer.parameter.obj.2'
    //                         },
    //                         'type': {
    //                             'type': 'integer',
    //                             'required': true,
    //                             'minimum': 0,
    //                             'maximum': 10
    //                         },
    //                         'help': {
    //                             'default': 'Help text for object integer param 2'
    //                         }
    //                     }
    //                 ]
    //             },
    //             'help': {
    //                 'default': 'Help text for Object simple param8'
    //             }
    //         }
    //     ]
    // };
}
const objectsFastURLFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.fasturlfilter.FastURLFilter',
        'name': {
            'default': 'Fast URL Filter ' + number,
            'translationKey': 'eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter'
        },
        'help': {
            'default': 'URL filter based on regex patterns and organised by [host | domain | metadata | global]. For a given URL, the scopes are tried in the order given above and the URL is kept or removed based on the first matching rule. The default policy is to accept a URL if no matches are found.'
        },
        'parameters': [
            {
                'id': 'rules',
                'name': {
                    'default': 'Rules',
                    'translationKey': 'eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules'
                },
                'type': {
                    'type': 'array',
                    'required': false,
                    'arrayType': 'object',
                    'minArrayLength': 1,
                    'maxArrayLength': 100,
                    'parameters': [
                        {
                            'id': 'scope',
                            'name': {
                                'default': 'Scope',
                                'translationKey': 'eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.scope'
                            },
                            'type': {
                                'type': 'string',
                                'required': true,
                                'pattern': '^(GLOBAL)|(domain:)([a-zA-Z]+.?)((\\w+).)*(\\w+)|(host:)([a-zA-Z0-9]+.?)((\\w+).)*(\\w+)|(metadata:((\\w+)=([^\\s]+)))',
                                'maxLength': 100,
                                'minLength': 6
                            },
                            'help': {
                                'default': 'The scope of the regex rule organized by [host | domain | metadata | global]'
                            }
                        },
                        {
                            'id': 'patterns',
                            'name': {
                                'default': 'Patterns',
                                'translationKey': 'eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns'
                            },
                            'type': {
                                'type': 'array',
                                'required': false,
                                'arrayType': 'string',
                                'pattern': '(DenyPath) ((.+))*|(DenyPathQuery) ((.+))*|(AllowPath) ((.+))*|(AllowPathQuery) ((.+))*',
                                'maxLength': 1024,
                                'minLength': 1,
                                'minArrayLength': 0,
                                'maxArrayLength': 10
                            },
                            'help': {
                                'default': 'List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]'
                            }
                        }
                    ]
                },
                'help': {
                    'default': 'The list of scoped-based regular expressions'
                }
            }
        ]
    }
}

const objectsBasicSeleniumFilterJson = (number) => {
    return {
        "id": "eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter",
        "name": {
            "default": "Basic Selenium Filter",
            "translationKey": "eu.europa.ec.eurostat.wihp.navigationfilters.stormcrawler.BasicSeleniumFilter"
        },
        "help": {
            "default": "With Basic Selenium Filter you can define your own custom navigation steps in a page"
        },
        "parameters": [
            {
                "id": "steps",
                "name": {
                    "default": "Steps",
                    "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.steps"
                },
                "type": {
                    "type": "array",
                    "required": false,
                    "arrayType": "object",
                    "minArrayLength": 1,
                    "maxArrayLength": 100,
                    "parameters": [
                        {
                            "id": "action",
                            "name": {
                                "default": "Action",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.scope"
                            },
                            "type": {
                                "type": "string",
                                "required": true,
                                "pattern": "^(click)|(input)|(focus)|(select)|(scroll)|(wait)"
                            },
                            "help": {
                                "default": "The scope of the regex rule organized by [host | domain | metadata | global]"
                            }
                        },
                        {
                            "id": "xpath",
                            "name": {
                                "default": "Xpath",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "string",
                                "required": true,
                                "maxLength": 1024,
                                "minLength": 1
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "value",
                            "name": {
                                "default": "Value",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "string",
                                "required": false,
                                "maxLength": 1024
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "highlight",
                            "name": {
                                "default": "Highlight",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "boolean",
                                "required": true
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        },
                        {
                            "id": "screenshot",
                            "name": {
                                "default": "Screenshot",
                                "translationKey": "eu.europa.ec.eurostat.wihp.urlfilters.stormcrawler.FastURLFilter.rules.patterns"
                            },
                            "type": {
                                "type": "boolean",
                                "required": true
                            },
                            "help": {
                                "default": "List of regular expressions organized by [DenyPath | DenyPathQuery | AllowPath | AllowPathQuery]"
                            }
                        }
                    ]
                },
                "help": {
                    "default": "The list of scoped-based regular expressions"
                }
            }
        ]
    }
}


const objectsUrlFilterJson = (number) => {
    return {
        'id': 'eu.europa.ec.eurostat.wihp.MyFilter.obj.' + number,
        'name': {
        'default': 'My filter Obj ' + number,
            'translationKey': 'my.key.' + number
    },
        'help': {
        'default': 'Help text for the Filter '  + number
    },
        'parameters': [
        {
            'id': 'param1',
            'name': {
                'default': 'String parameter',
                'translationKey': 'my.string.parameter1'
            },
            'type': {
                'type': 'string',
                'required': true,
                'pattern': '^[a-zA-Z]*$',
                'maxLength': 10,
                'minLength': 1
            },
            'help': {
                'default': 'Help text for param1'
            }
        },
        {
            'id': 'param2',
            'name': {
                'default': 'Integer parameter',
                'translationKey': 'my.integer.parameter2'
            },
            'type': {
                'type': 'integer',
                'required': true,
                'minimum': 0,
                'maximum': 10
            },
            'help': {
                'default': 'Help text for param2'
            }
        },
        {
            'id': 'param3',
            'name': {
                'default': 'Number parameter',
                'translationKey': 'my.number.parameter3'
            },
            'type': {
                'type': 'number',
                'required': true,
                'minimum': 2.56,
                'maximum': 10.37
            },
            'help': {
                'default': 'Help text for param3'
            }
        },
        {
            'id': 'param4',
            'name': {
                'default': 'Boolean parameter',
                'translationKey': 'my.boolean.parameter4'
            },
            'type': {
                'type': 'boolean',
                'required': true
            },
            'help': {
                'default': 'Help text for param4'
            }
        },
        {
            'id': 'param5',
            'name': {
                'default': 'Array string parameter',
                'translationKey': 'my.array.string.parameter5'
            },
            'type': {
                'type': 'array',
                'required': true,
                'arrayType': 'string',
                'pattern': '^[a-zA-Z]*$',
                'maxLength': 10,
                'minLength': 1,
                'minArrayLength': 0,
                'maxArrayLength': 10
            },
            'help': {
                'default': 'Help text for param5'
            }
        },
        {
            'id': 'param6',
            'name': {
                'default': 'Array integer parameter',
                'translationKey': 'my.array.integer.parameter6'
            },
            'type': {
                'type': 'array',
                'required': true,
                'arrayType': 'integer',
                'minimum': 0,
                'maximum': 10,
                'minArrayLength': 0,
                'maxArrayLength': 10
            },
            'help': {
                'default': 'Help text for param6'
            }
        },
        {
            'id': 'param7',
            'name': {
                'default': 'Array number parameter',
                'translationKey': 'my.array.number.parameter7'
            },
            'type': {
                'type': 'array',
                'required': true,
                'arrayType': 'number',
                'minimum': 1.2,
                'maximum': 10.5,
                'minArrayLength': 0,
                'maxArrayLength': 10
            },
            'help': {
                'default': 'Help text for param7'
            }
        },
        {
            'id': 'param8',
            'name': {
                'default': 'Array boolean parameter',
                'translationKey': 'my.array.boolean.parameter8'
            },
            'type': {
                'type': 'array',
                'required': true,
                'arrayType': 'boolean',
                'minArrayLength': 0,
                'maxArrayLength': 10
            },
            'help': {
                'default': 'Help text for param8'
            }
        },
        {
            'id': 'param9',
            'name': {
                'default': 'Object parameter 9',
                'translationKey': 'my.object.parameter6'
            },
            'type': {
                'type': 'object',
                'name': {
                    'default': 'Object parameter 9 string',
                    'translationKey': 'my.object.parameter6'
                },
                'required': true,
                'parameters': [
                    {
                        'id': 'param91',
                        'name': {
                            'default': 'String parameter',
                            'translationKey': 'my.string.parameter1'
                        },
                        'type': {
                            'type': 'string',
                            'required': true,
                            'pattern': '^[a-zA-Z]*$',
                            'maxLength': 10,
                            'minLength': 1
                        },
                        'help': {
                            'default': 'Help text for param1'
                        }
                    },
                    {
                        'id': 'param92',
                        'name': {
                            'default': 'Integer parameter',
                            'translationKey': 'my.integer.parameter2'
                        },
                        'type': {
                            'type': 'integer',
                            'required': true,
                            'minimum': 0,
                            'maximum': 10
                        },
                        'help': {
                            'default': 'Help text for param2'
                        }
                    },
                    {
                        'id': 'param93',
                        'name': {
                            'default': 'Number parameter',
                            'translationKey': 'my.number.parameter3'
                        },
                        'type': {
                            'type': 'number',
                            'required': true,
                            'minimum': 2.56,
                            'maximum': 10.37
                        },
                        'help': {
                            'default': 'Help text for param3'
                        }
                    },
                    {
                        'id': 'param94',
                        'name': {
                            'default': 'Boolean parameter',
                            'translationKey': 'my.boolean.parameter4'
                        },
                        'type': {
                            'type': 'boolean',
                            'required': true
                        },
                        'help': {
                            'default': 'Help text for param4'
                        }
                    },
                    {
                        'id': 'param95',
                        'name': {
                            'default': 'Array string parameter',
                            'translationKey': 'my.array.string.parameter5'
                        },
                        'type': {
                            'type': 'array',
                            'required': true,
                            'arrayType': 'string',
                            'pattern': '^[a-zA-Z]*$',
                            'maxLength': 10,
                            'minLength': 1,
                            'minArrayLength': 0,
                            'maxArrayLength': 10
                        },
                        'help': {
                            'default': 'Help text for param5'
                        }
                    },
                    {
                        'id': 'param96',
                        'name': {
                            'default': 'Array integer parameter',
                            'translationKey': 'my.array.integer.parameter6'
                        },
                        'type': {
                            'type': 'array',
                            'required': true,
                            'arrayType': 'integer',
                            'minimum': 0,
                            'maximum': 10,
                            'minArrayLength': 0,
                            'maxArrayLength': 10
                        },
                        'help': {
                            'default': 'Help text for param6'
                        }
                    },
                    {
                        'id': 'param97',
                        'name': {
                            'default': 'Array number parameter',
                            'translationKey': 'my.array.number.parameter7'
                        },
                        'type': {
                            'type': 'array',
                            'required': true,
                            'arrayType': 'number',
                            'minimum': 1.2,
                            'maximum': 10.5,
                            'minArrayLength': 0,
                            'maxArrayLength': 10
                        },
                        'help': {
                            'default': 'Help text for param7'
                        }
                    },
                    {
                        'id': 'param98',
                        'name': {
                            'default': 'Array boolean parameter',
                            'translationKey': 'my.array.boolean.parameter8'
                        },
                        'type': {
                            'type': 'array',
                            'required': true,
                            'arrayType': 'boolean',
                            'minArrayLength': 0,
                            'maxArrayLength': 10
                        },
                        'help': {
                            'default': 'Help text for param8'
                        }
                    },
                    {
                        'id': 'param99',
                        'name': {
                            'default': 'Object parameter',
                            'translationKey': 'my.object.parameter6'
                        },
                        'type': {
                            'type': 'object',
                            'name': {
                                'default': 'Object parameter',
                                'translationKey': 'my.object.parameter6'
                            },
                            'required': true,
                            'parameters': [
                                {
                                    'id': 'param1',
                                    'name': {
                                        'default': 'String parameter',
                                        'translationKey': 'my.string.parameter1'
                                    },
                                    'type': {
                                        'type': 'string',
                                        'required': true,
                                        'pattern': '^[a-zA-Z]*$',
                                        'maxLength': 10,
                                        'minLength': 1
                                    },
                                    'help': {
                                        'default': 'Help text for param1'
                                    }
                                },
                                {
                                    'id': 'param2',
                                    'name': {
                                        'default': 'Integer parameter',
                                        'translationKey': 'my.integer.parameter2'
                                    },
                                    'type': {
                                        'type': 'integer',
                                        'required': true,
                                        'minimum': 0,
                                        'maximum': 10
                                    },
                                    'help': {
                                        'default': 'Help text for param2'
                                    }
                                },
                                {
                                    'id': 'param3',
                                    'name': {
                                        'default': 'Number parameter',
                                        'translationKey': 'my.number.parameter3'
                                    },
                                    'type': {
                                        'type': 'number',
                                        'required': true,
                                        'minimum': 2.56,
                                        'maximum': 10.37
                                    },
                                    'help': {
                                        'default': 'Help text for param3'
                                    }
                                },
                                {
                                    'id': 'param4',
                                    'name': {
                                        'default': 'Boolean parameter',
                                        'translationKey': 'my.boolean.parameter4'
                                    },
                                    'type': {
                                        'type': 'boolean',
                                        'required': true
                                    },
                                    'help': {
                                        'default': 'Help text for param4'
                                    }
                                },
                                {
                                    'id': 'param5',
                                    'name': {
                                        'default': 'Array string parameter',
                                        'translationKey': 'my.array.string.parameter5'
                                    },
                                    'type': {
                                        'type': 'array',
                                        'required': true,
                                        'arrayType': 'string',
                                        'pattern': '^[a-zA-Z]*$',
                                        'maxLength': 10,
                                        'minLength': 1,
                                        'minArrayLength': 0,
                                        'maxArrayLength': 10
                                    },
                                    'help': {
                                        'default': 'Help text for param5'
                                    }
                                },
                                {
                                    'id': 'param6',
                                    'name': {
                                        'default': 'Array integer parameter',
                                        'translationKey': 'my.array.integer.parameter6'
                                    },
                                    'type': {
                                        'type': 'array',
                                        'required': true,
                                        'arrayType': 'integer',
                                        'minimum': 0,
                                        'maximum': 10,
                                        'minArrayLength': 0,
                                        'maxArrayLength': 10
                                    },
                                    'help': {
                                        'default': 'Help text for param6'
                                    }
                                },
                                {
                                    'id': 'param7',
                                    'name': {
                                        'default': 'Array number parameter',
                                        'translationKey': 'my.array.number.parameter7'
                                    },
                                    'type': {
                                        'type': 'array',
                                        'required': true,
                                        'arrayType': 'number',
                                        'minimum': 1.2,
                                        'maximum': 10.5,
                                        'minArrayLength': 0,
                                        'maxArrayLength': 10
                                    },
                                    'help': {
                                        'default': 'Help text for param7'
                                    }
                                },
                                {
                                    'id': 'param8',
                                    'name': {
                                        'default': 'Array boolean parameter',
                                        'translationKey': 'my.array.boolean.parameter8'
                                    },
                                    'type': {
                                        'type': 'array',
                                        'required': true,
                                        'arrayType': 'boolean',
                                        'minArrayLength': 0,
                                        'maxArrayLength': 10
                                    },
                                    'help': {
                                        'default': 'Help text for param8'
                                    }
                                },
                                {
                                    'id': 'param9',
                                    'name': {
                                        'default': 'Empty Object parameter',
                                        'translationKey': 'my.object.parameter6'
                                    },
                                    'type': {
                                        'type': 'object',
                                        'name': {
                                            'default': 'Empty Object parameter',
                                            'translationKey': 'my.object.parameter6'
                                        },
                                        'required': true,
                                        'parameters': []
                                    },
                                    'help': {
                                        'default': 'Help text for empty param9'
                                    }
                                }
                            ]
                        },
                        'help': {
                            'default': 'Help text for param8'
                        }
                    }
                ]
            },
            'help': {
                'default': 'Help text for param8'
            }
        }
    ]
    };
}


const generateUrlFilters = () => {
    return generateUrlFiltersData(12);
};

module.exports = {
    getUrlFilters: generateUrlFilters,
    getUrlFiltersData: generateUrlFiltersData
};
