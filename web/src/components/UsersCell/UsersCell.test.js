import { render, screen } from '@redwoodjs/testing'
import { Loading, Empty, Failure, Success } from './UsersCell'
import { standard } from './UsersCell.mock'

describe('UsersCell', () => {
  test('Loading renders successfully', () => {
    render(<Loading />)
    // Use screen.debug() to see output
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  test('Failure renders successfully', async () => {
    render(<Failure error={new Error('Oh no')} />)
    expect(screen.getByText(/Oh no/i)).toBeInTheDocument()
  })

  test('Success renders successfully', async () => {
    render(<Success users={standard().users} />)
    expect(screen.getByText(/42/i)).toBeInTheDocument()
  })
})
