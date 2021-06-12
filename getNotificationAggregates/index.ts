import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import isValidSchema from "../helpers/isValidSchema";
import notificationTransformer from "../helpers/notificationTransformer";
import notificationFeedMock from '../notificationFeedMock.json'

/**
 * GET endpoint to get an aggregate post with notifications
 * URL - notification/{notification_id}}/aggregates
 * @returns {NotificationAggregate} - returns the post with aggrigated notifications
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // Varible used to store the id from the request string
    const paramId: string = context.bindingData.id;

    // Return an error if there is no id to filter the notification list
    if (!paramId) {        
        context.res = {
            status: 404,
            body: { error: 'Please provide an id. Example /notifications/{id}/aggregate where {id} is the id of a notification', posts: [] }
        }
        return
    }

    // Rudimentary Schema validator, decided to make my own super simple validator and not use a npm module, needs work
    for (const notification of notificationFeedMock) {
        if (!isValidSchema(notification, { type: 'string', read: 'boolean', post: 'object', user: 'object', 'comment?': 'object'})) {
            context.res = {
                status: 500,
                body: { error: 'Invalid Notification Feed Schema, seems like the server might need to be updated!', posts: [] }
            }
            return
        }
    }

    // Transforms the notification feed into the aggrigated notification object
    const aggrigatedNotifications = notificationTransformer(notificationFeedMock as Array<NotificationFeed>)

    // Filters the notifications for a given post
    .filter((notification: NotificationAggregate) => {
        if (notification.id === paramId) return true
        return false
    })

    // If no posts are found retirn a 404 error
    if (!aggrigatedNotifications || !(aggrigatedNotifications.length > 0)) {
        context.res = { status: 404, body: { error: 'Invalid id, no posts found for: ' + paramId, posts: [] }}
        return
    }

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: { posts: aggrigatedNotifications, error: '' }
    };

};

export default httpTrigger;