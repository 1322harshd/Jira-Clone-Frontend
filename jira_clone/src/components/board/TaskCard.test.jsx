import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'   // tools to draw a component and look at it
import { DndContext } from '@dnd-kit/core'                // drag-and-drop wrapper (explained below)
import TaskCard from './TaskCard'                           // the component being tested

test('renders task title', () => {                           // a test, with a name you'll see in CI logs
  render(                                                    // draw the component on a fake page
    <DndContext>
      <TaskCard task={{ id: 1, title: 'Fix bug' }} />        // give it a sample task
    </DndContext>
  )
  expect(screen.getByText('Fix bug')).toBeInTheDocument()   // check that "Fix bug" appears on the page
})
