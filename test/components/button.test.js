import test from 'ava';
import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from '../../src/components/primitives/Button';

test.before(() => {
  configure({ adapter: new Adapter() });
});

test('button renders children correctly', t => {
  const btn = shallow(<Button>Hey</Button>);

  const result = btn.contains('Hey');

  t.truthy(result);
});
