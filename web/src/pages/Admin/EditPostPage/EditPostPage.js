import PostsLayout from 'src/layouts/Admin/PostsLayout'
import EditPostCell from 'src/components/Admin/EditPostCell'

const EditPostPage = ({ id }) => {
  return (
    <PostsLayout>
      <EditPostCell id={id} />
    </PostsLayout>
  )
}

export default EditPostPage
