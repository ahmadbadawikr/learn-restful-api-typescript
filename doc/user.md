# User API Specification

## Register User

Endpoint: POST /api/users

Request Body :

```json
{
    "username": "user",
    "password": "secret666",
    "name": "Name of the User"
}
```
Response Body (Success):

```json
{
    "data" : {
        "username": "user",
        "name": "Name of the User"
    }
    
}
```

Response Body (Failed):

```json
{
    "errors": "username must not blank..."
    
}
```

## Login User

Endpoint: POST /api/users/login

Request Body :

```json
{
    "username": "user",
    "password": "secret666"
}
```
Response Body (Success):

```json
{
    "data" : {
        "username": "user",
        "name": "Name of the User",
        "token": "uuid"
    }
    
}
```

Response Body (Failed):

```json
{
    "errors": "username or password are wrong"
    
}
```


## Get User

Endpoint: GET /api/users/current

Request Header:
- X-API-TOKEN: token

Response Body (Success):

```json
{
    "data" : {
        "username": "user",
        "name": "Name of the User",
        "token": "uuid"
    }
    
}
```

Response Body (Failed):

```json
{
    "errors": "username or password are wrong"
    
}
```


## Update User

Endpoint: PATCH /api/users/current

Request Header:
- X-API-TOKEN : token

Request Body :

```json
{
    "password": "secret666", //not mandatory
    "name": "Name of the User" // not mandatory
}
```
Response Body (Success):

```json
{
    "data" : {
        "username": "user",
        "name": "Name of the User",
    }
    
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized"
    
}
```


## Logout User

Endpoint: DELETE /api/users/current

Request Header:
- X-API-TOKEN : token

Response Body (Success):

```json
{
    "data" : "OK"
    
}
```

Response Body (Failed):

```json
{
    "errors": "Unauthorized"
    
}
```
