import { render } from '@redwoodjs/testing'

import RegisterUser from './RegisterUser'

describe('RegisterUser', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegisterUser />)
    }).not.toThrow()
  })
})
