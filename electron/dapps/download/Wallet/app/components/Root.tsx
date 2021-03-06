import * as React from 'react';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import Main from './Main/index';
import { store } from '../redux/store';

export default function () {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
