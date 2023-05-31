import { classnames } from 'hgc-utils';
import React, { useState } from 'react';
import HorizontalScroll from './horizontalScroll';
import './style.less';

const btnArr = [
  'lion',
  'tiger',
  'element',
  'monkey',
  'rabbit',
  'pig',
  'cat',
  'mouses',
];
const Tabs = () => {
  const [mark, setMark] = useState('lion');
  const handleActive = (key: string) => {
    setMark(key);
  };
  return (
    <div className='tabs'>
      <HorizontalScroll activeKey={mark} classPrefix="tab">
        {btnArr.map((btn, index) => {
          const active = btn === mark;
          return (
            <div
              key={btn}
              onClick={() => handleActive(btn)}
              className={classnames('tabBtn', {
                active,
              })}
            >
              {btn}
            </div>
          );
        })}
      </HorizontalScroll>
    </div>
  );
};

export default Tabs;