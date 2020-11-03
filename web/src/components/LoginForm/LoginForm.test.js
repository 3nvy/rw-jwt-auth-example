import { render } from '@redwoodjs/testing'

import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoginForm />)
    }).not.toThrow()
  })
})
