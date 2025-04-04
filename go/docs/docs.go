// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/createEvent": {
            "post": {
                "summary": "Create Event",
                "parameters": [
                    {
                        "type": "string",
                        "description": "username do usuario",
                        "name": "username",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Params",
                        "name": "params",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/router.EventRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "invalid username",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "GetUser error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/createUser": {
            "post": {
                "summary": "Create User",
                "parameters": [
                    {
                        "description": "Params",
                        "name": "params",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/router.LoginBody"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "bad request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "createUser error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/deleteEvent/{eventId}": {
            "delete": {
                "summary": "delete the event from the given id",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "ID do event",
                        "name": "eventID",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "invalid id",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "ServiceDeleteEvent error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/login": {
            "post": {
                "summary": "Login",
                "parameters": [
                    {
                        "description": "Params",
                        "name": "params",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/router.LoginBody"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "invalid body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "ServiceLogin error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/updateEvent": {
            "patch": {
                "summary": "Update the given event",
                "parameters": [
                    {
                        "description": "Params",
                        "name": "params",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/repository.Event"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "invalid body",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "ServiceUpdateEvent error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/userScheduller": {
            "post": {
                "summary": "Get user scheduller",
                "parameters": [
                    {
                        "type": "string",
                        "description": "username do usuario",
                        "name": "username",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "ok",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/repository.Event"
                            }
                        }
                    },
                    "400": {
                        "description": "invalid username",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "GetUser error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "repository.Event": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "end": {
                    "type": "string"
                },
                "eventId": {
                    "type": "integer"
                },
                "priority": {
                    "type": "integer"
                },
                "start": {
                    "type": "string"
                }
            }
        },
        "router.EventRequest": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "endDate": {
                    "type": "string"
                },
                "priority": {
                    "type": "integer"
                },
                "startDate": {
                    "type": "string"
                }
            }
        },
        "router.LoginBody": {
            "type": "object",
            "properties": {
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "0.1",
	Host:             "localhost:8080",
	BasePath:         "/",
	Schemes:          []string{"http"},
	Title:            "API Golang Planner Time",
	Description:      "API em Go projeto Planner Time",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
