import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import notificationTransformer from "../helpers/notificationTransformer";
import setContext from "../helpers/setContext";
import notificationFeedMock from '../notificationFeedMock.json'

// NB!! I was over time when writing this file, so gave some TODO's and did a very basic implimentation
/**
 * PATCH endpoint to update a post, changing the status to read
 *
 * @returns {NotificationAggregate} - returns the post with the appended notification or an error
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Varible used to store the id from the request string
    const paramId: string = context.bindingData.id;

    // Return an error if there is no id to filter the notification list
    if (!paramId) {
        return context = setContext(context, {
            // User Error
            status: 404,
            body: { error: 'Please provide an id. Example /notification/{id}/read/ where {id} is the id of a post', post: [] }
        })
    }

    // TODO add user auth checking

    // TODO Mock async Get post from stream

    // Transforms the notification feed and then add the new notification
    const aggrigatedNotification = notificationTransformer(notificationFeedMock as Array<NotificationFeed>)
        .filter((notification: NotificationAggregate) => notification.id === paramId)

    if (!aggrigatedNotification || !(aggrigatedNotification.length > 0)) {
        return context = setContext(context, {
            status: 404,
            body: { post: {}, error: 'Error could not find the post id: ' +  paramId }
        })    
    }
    aggrigatedNotification[0].read = true


    return context = setContext(context, {
        body: { post: aggrigatedNotification[0] }
    })

};

export default httpTrigger;