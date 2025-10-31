import {callAPI} from "./api.js";

/**
 * Adds an event to the event API
 * @param requestBody {{
 *     name: string,
 *     userId: string | number
 * }}
 * @returns {Promise<any>}
 */
export const addEvent = async (requestBody) => {
    return callAPI( 'POST', 'http://event.com/addEvent', JSON.stringify({
        id: new Date().getTime(),
        ...requestBody
    }));
};

/**
 * Gets the events belonging to the userId
 * @param userId - id of the user
 * @returns {Promise<Array<{
 *   name: string,
 *   userId: number | string,
 *   id: number,
 *   details?: string
 * }>>}
 */
export const getEventByUserId = async (userId) => {
    const events = await callAPI( 'GET', 'http://event.com/getEvents');
    return events.filter((event) => parseInt(event.userId) === parseInt(userId));
}
