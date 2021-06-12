
/**
 * The notification transformer function, returns an aggrigated array of notifications grouped by post id
 * @param   {NotificationFeed[]} notificationFeed - The notification feed array to be transformed
 * @returns {NotificationAggregate[]}             - Returns an aggrigated notification feed array
 */
const notificationTransformer = (notificationFeed: Array<NotificationFeed>): Array<NotificationAggregate> => {
    const trackerArr: string[] = []
    
    // Using .reduce to loop through the current feed and to build up a new schema
    const aggrigatedNotifications: Array<NotificationAggregate> = notificationFeed.reduce((acc: Array<NotificationAggregate>, current: NotificationFeed) => {
    
        const trackerIndex: number = trackerArr.indexOf(current.post.id)
        const notificationType = current.type.toLowerCase()
    
        // First need to initialize the object if the id hasn't been added yet
        if (trackerIndex === -1) {
            // Add the id to the tracker so we don't initialize the same
            trackerArr.push(current.post.id)
            acc.push({
                id: current.post.id,
                title: current.post.title,
                read: current.read,
                likes: notificationType === 'like' ? { users: [current.user], total: 1 } : { users: [], total: 0 },
                comments: notificationType === 'comment' ? { commentList: [{ user: current.user, comment: current.comment }], total: 1 } : { total: 0, commentList: [] }
            })
        } else {
            if (notificationType === 'comment') {
                acc[trackerIndex].comments.commentList.push({ user: current.user, comment: current.comment })
                acc[trackerIndex].comments.total++
            } else {
                acc[trackerIndex].likes.users.push(current.user)
                acc[trackerIndex].likes.total++
            }
        }
        return acc
    }, [])
    return aggrigatedNotifications
}

export default notificationTransformer