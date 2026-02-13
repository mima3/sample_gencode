import { afterEach, describe, expect, it, vi } from 'vitest'

const renderMock = vi.fn()
const createRootMock = vi.fn(() => ({ render: renderMock }))

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}))

vi.mock('../../src/App', () => ({
  default: () => null,
}))

describe('main entrypoint', () => {
  afterEach(() => {
    vi.resetModules()
    renderMock.mockClear()
    createRootMock.mockClear()
    document.body.innerHTML = ''
  })

  it('creates root and renders app', async () => {
    document.body.innerHTML = '<div id="root"></div>'

    await import('../../src/main')

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderMock).toHaveBeenCalledTimes(1)
  })
})
