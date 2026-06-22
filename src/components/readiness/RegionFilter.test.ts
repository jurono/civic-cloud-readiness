import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import RegionFilter from './RegionFilter.vue'

describe('RegionFilter', () => {
  it('emits region changes from accessible buttons', async () => {
    const user = userEvent.setup()
    const view = render(RegionFilter, {
      props: {
        regions: ['de-fra-1', 'de-ber-1'],
        selectedRegion: 'all',
      },
    })

    await user.click(screen.getByRole('button', { name: 'de-fra-1' }))

    expect(view.emitted('change')).toEqual([['de-fra-1']])
  })
})
