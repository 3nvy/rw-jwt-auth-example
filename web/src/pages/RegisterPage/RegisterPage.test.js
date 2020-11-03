import { render } from '@redwoodjs/testing'

import RegisterPage from './RegisterPage'

describe('RegisterPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegisterPage />)
    }).not.toThrow()
  })
})
