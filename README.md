# ChangeLog

## v1.0.1
* Added `callWithFallOff` method as a retry mechanism for failable API calls
  * Uses a try/catch block where the catch block checks the retry count against the threshold and will recursively call `callWithFullOff` method along with updated runtime parameters
  * A threshold of -1 will mean it will retry indefinitely until it gets a successful call
* Created an API layer (`api.js`) to handle our API calls and standardize our error handling
* Added `increaseTimeToCallBy` as an array of numbers to better control exactly how each retry happens
* Added `endpoints.js` to capture our fetch calls
* Added JSDocs to help document each method's usability
* Updated `getEventsByUserId` to fetch all the events and then filter it by the userId in order to bypass API's performance issues