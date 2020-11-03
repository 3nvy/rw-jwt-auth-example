import { render } from '@redwoodjs/testing'

import RegisterForm from './RegisterForm'

describe('RegisterForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RegisterForm />)
    }).not.toThrow()
  })
})
