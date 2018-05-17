/**
 * 04. REST SERVER
 *
 * Target: create a rest-full server which allows to return data into JSON format and to save new data
 *
 * "GET /data" should return current content from "data.csv" file into JSON format:
 *  [
 *      {
 *          level: 1-10,
 *          character: String,
 *          race: String,
 *          class: String
 *      },
 *      ...
 *  ]
 *
 * "POST /data" should add new content into "data.csv" file with the right format.
 * Will admit a request payload body with following format:
 *  {level: 1-10, character: String, race: Human|Orc|Beast, class: Warrior|Mage|Paladin|Warlock|Priest }
 *
 * First row from "data.csv" is the data headers, and should not be erased at all
 *
 * Server should contemplate and return errors in JSON format: {error: Number, message: String}
 */
