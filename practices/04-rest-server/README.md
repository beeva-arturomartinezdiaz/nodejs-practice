# Practice 04: REST Server

__Target__: Create a rest full server which allows to retrieve or save data into a CSV file.

## CSV File

Separated by `;` must contain following columns:

| LEVEL | CHARACTER | RACE | CLASS |
|:---:|:---:|:---:|:---:|
| Number (1-10) | String | String | String |

Example:

```
LEVEL;CHARACTER;RACE;CLASS
7;Arthur;Human;Paladin
9;Merlin;Human;Mage
5;Lancelot;Human;Warrior
```

## Endpoints

Server will expose following endpoints:

| ENDPOINT | METHOD | Description |
|:---:|:---:|:---|
| `/data` | GET | Should return current CSV content in JSON format |
| `/data` | POST | Should add new values to CSV and return number of new rows |

## NOTES

- CSV headers should NOT be deleted.
- POST endpoint should admit an array as payload

## Extra work

- Build a new solution based on ES6 classes.
- Build a new solution based on custom Node.js modules.

