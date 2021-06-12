type User = {
  id: string
  name: string
}

type userComment = {
  id: string
  commentText: string
}

type NotificationAggregate = {
  id: string
  title: string
  read: boolean
  likes?: { users: Array<User>, total: number }
  comments?: { total: number, commentList: Array<{ user: User, comment: userComment }> }
}

type Post = {
  id: string
  title: string
}

type NotificationFeed = {
  type: 'Like' | 'Comment'
  read: boolean
  post: Post
  user: User
  comment: userComment
}