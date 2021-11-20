// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { shallow } from 'enzyme';
import { h } from 'preact';

import { App } from '../src/components/app';

describe('App Component', () => {
  it('displays "Hello World" text', () => {
    const context = shallow(<App />);
    expect(context.find('p').text()).toBe('Hello World');
  });
});
