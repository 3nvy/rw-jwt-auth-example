import { render } from '@redwoodjs/testing'

import LoginUser from './LoginUser'

describe('LoginUser', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LoginUser />)
    }).not.toThrow()
  })
})
