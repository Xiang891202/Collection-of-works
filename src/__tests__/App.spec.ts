import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import Header from '../components/Header.vue'

describe('App', () => {
  it('renders Header component', () => {
    const wrapper = mount(App)
    expect(wrapper.findComponent(Header).exists()).toBe(true)
  })
})