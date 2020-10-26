import PostsLayout from 'src/layouts/Admin/PostsLayout'
import PostCell from 'src/components/Admin/PostCell'

const PostPage = ({ id }) => {
  return (
    <PostsLayout>
      <PostCell id={id} />
    </PostsLayout>
  )
}

export default PostPage
