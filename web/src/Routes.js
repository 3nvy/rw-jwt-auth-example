// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Private } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Private unauthenticated="home">
        <Route path="/admin/posts/new" page={AdminNewPostPage} name="adminNewPost" />
        <Route path="/admin/posts/{id:Int}/edit" page={AdminEditPostPage} name="adminEditPost" />
        <Route path="/admin/posts/{id:Int}" page={AdminPostPage} name="adminPost" />
        <Route path="/admin/posts" page={AdminPostsPage} name="adminPosts" />
      </Private>
      <Route path="/users/new" page={NewUserPage} name="newUser" />
      <Route path="/login" page={LoginUserPage} name="loginUser" />
      <Route path="/" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
