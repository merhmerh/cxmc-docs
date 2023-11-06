# 🐘 CX-DUMBO API Documentation

The CX-DUMBO API documentation provides dummy information about various endpoints related to property CX-MC. It includes endpoints such as "PlotRatio" for general property data, "AREA_GFA" for URA (Urban Redevelopment Authority) property information, and "Hazard" for NEA (National Environment Agency) hazard data. Each endpoint allows users to query specific information by providing optional parameters, and the responses are structured in JSON format. This API documentation serves as a valuable resource for retrieving property and hazard-related data for various use cases.

## General

### PlotRatio

#### Endpoint

```
https://cx.builtsearch.com/api/dumbo/general/plotratio
```

#### Query Param

| Parameter | Type   | Description                                   |
| --------- | ------ | --------------------------------------------- |
| mukim     | string | **Optional**. return result with mukim number |

#### Response

```
[
    {
        "mukim": /*string*/,
        "plotRatio": /*number*/
    },
    ...
]
```

## URA

### AREA_GFA

endpoint

```
https://cx.builtsearch.com/api/dumbo/ura/area_gfa
```

#### Query Param

| Parameter       | Type   | Description                                          |
| --------------- | ------ | ---------------------------------------------------- |
| ifcPropertyName | string | **Optional**. return result matching ifcPropertyName |

#### Response

```
[
    {
        "ifcPropertyName": /*string*/,
        "propertyName": /*string*/,
        "enums": [/*string*/, ...]
    },
    ...
]
```

## NEA

### Hazard

endpoint

```
https://cx.builtsearch.com/api/dumbo/nea/hazard
```

#### Query Param

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| id        | string | **Optional**. return result with matching id     |
| symbol    | string | **Optional**. return result with matching symbol |
| class     | string | **Optional**. return result(s) of matching class |

#### Response

```
[
    {
        "id": /*string(8)*/,
        "symbol": /*string(2)*/,
        "class": /*string*/,
        "matrix": {
            "[symbol]": /*string*/,
            "[symbol]": /*string*/,
            "[symbol]": /*string*/,
            ...
        }
    },
    ...
]
```
