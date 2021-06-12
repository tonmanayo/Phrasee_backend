import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import isValidSchema from "../helpers/isValidSchema";
import notificationTransformer from "../helpers/notificationTransformer";
import setContext from "../helpers/setContext";
import notificationFeedMock from '../notificationFeedMock.json'

/**
 * POST endpoint to create a new notification on a post, assumes we get the user from the token
 * body {
 *  type: 'Like' | 'Comment' - The type of post either a like or a comment, a comment requires the commentText field
 *  postId: 'string'         - The unique identifier of the post
 *  commentText: 'string'    - Only required when making a comment post. The comment to add to the post
 * }
 * @returns {NotificationAggregate} - returns the post with the appended notification or an error
 */
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // Mock function to validate user token and ACL
    const validateUser = (token: string): User | null => ({ id: 'xxx', name: 'Tony Mack'})

    // Checking if the user is authenticated to post and has the correct ACL to post
    const userDetails: User = validateUser(req.headers.token)
    if (!userDetails?.id) {
        return context = setContext(context, {
            // Unauthorized
            status: 401,
            body: { error: 'Authentication Error, please login and try again' }
        })
    };

    // Validate the body of the request with the shitty validator that needs some work and some tests
    if (!isValidSchema(req.body, { type: 'string', 'postId?': 'string', 'commentText?': 'string' })) {
        return context = setContext(context, {
            // Bad Request
            status: 400,
            body: { error: 'Bad request, paylaod provided is not valid for this request' }
        })
    }

    // Transforms the notification feed and then add the new notification
    const aggrigatedNotifications = notificationTransformer(notificationFeedMock as Array<NotificationFeed>)
    const newPaylaod = aggrigatedNotifications.map((notification: NotificationAggregate): NotificationAggregate => {

        // Only Add to the specified post        
        if (notification.id === req.body.postId) {

            // Check if we are adding a comment or a like
            if (req.body.type === 'Comment') {

                // This is mutating the object which is not always good, the 'Like' code is an example of not mutating the notification object
                notification.comments.total += 1
                notification.comments.commentList.push({

                    // Use some method to generate read ID's where the id's are xxx like UUID npm
                    user: userDetails,
                    comment: { id: 'xxx', commentText: req.body.commentText }
                })
            } else if (req.body.type === 'Like') {
                return {
                    ...notification,
    
                    // Get the user from the token - mocked for now
                    likes: {
                        total: notification.likes.total + 1,
                        users: [...notification.likes.users, userDetails]
                    }
                }
            }
        }
        return notification
    }).filter((notification: NotificationAggregate) => notification.id === req.body.postId)

    // If we didn't find the ID throw an error
    if (!newPaylaod || !(newPaylaod.length > 0)) {
        return context = setContext(context, {
            // Bad Request
            status: 404,
            body: { error: 'Bad request, post id was not found' }
        })
    }

    // Mocking what would be saving the data to a database
    const saveToDatabase = () => true
    if (!saveToDatabase) {
        return context = setContext(context, {
            // Bad Request
            status: 500,
            body: { error: 'Internal Error, could not save post please re try later' }
        })
    }

    return context = setContext(context, {
        body: {
            message: 'Created new notification',
            notifications: newPaylaod,
            error: ''
        }
    })
};

export default httpTrigger;