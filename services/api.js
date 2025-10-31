import {logger} from "../utils/logger.js";
import {delay} from "msw";

/**
 * Checks to make sure the resp is ok, if not throws an error
 * @param resp {Response}
 * @throws Error
 * @returns {Promise<void>}
 */
const checkResp = async (resp) => {
    if(!resp.ok) {
        const errorJson = await resp.json();
        throw new Error(`Unable to fetch: ${JSON.stringify(errorJson)}`);
    }
}

/**
 * Makes the API call with the following method, URL and body
 * @param method {'GET', 'POST'}
 * @param url {string}
 * @param body {Object<*>}
 * @returns {Promise<*>}
 */
export const callAPI = async (method, url, body = {}) => {
    let resp = null;

    if(method === 'GET') {
        resp = await fetch(url);
    } else {
        resp = await fetch(url, {
            method,
            body
        });
    }

    await checkResp(resp);

    return resp.json();
}

/**
 * Makes a function call every `options.timeToCall` in milliseconds with an increase to interval handled by `options.increaseTimeToCallBy`
 * @param func {() => *} - Function call everytime a retry happens
 * @param threshold - Maximum number of retries allowed (defaults to 10)
 * @param increaseTimeToRetryBy { number | Array<number> } Interval to increase the time to retry the function call, can be an array of numbers where the interval used corresponds to the retry number
 * @param runtime {{ retry: number, timeToCall: number }} Parameters that control the fall off functionality
 * @returns {Promise<*|undefined>}
 */
export const callWithFalloff = async (func, threshold = 10, increaseTimeToRetryBy = 200, runtime  = { retry: 0 }) => {
    try {
        return await func();
    } catch(e) {
        logger.error(e);

        if(threshold <= 0 || runtime.retry < threshold) {
            const timeToCall = (typeof increaseTimeToRetryBy === 'number') ? (runtime.retry + 1) * increaseTimeToRetryBy : increaseTimeToRetryBy
                .slice(0, runtime.retry + 1)
                .reduce(
                    (res, cur) => res + cur,
                    runtime.retry > increaseTimeToRetryBy.length ? increaseTimeToRetryBy[0] * (runtime.retry - increaseTimeToRetryBy.length) : 0
                );

            logger.info(`Retrying again... (retry ${runtime.retry + 1}) after ${timeToCall} ms`);

            await delay(timeToCall);
            return callWithFalloff(func, threshold, increaseTimeToRetryBy, {
                retry: runtime.retry + 1
            });

        } else {
            throw new Error(`Retry (${threshold}) maximum reached, unable to retry: ${e}`)
        }
    }
}