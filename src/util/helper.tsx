import React from 'react';
import { message } from 'antd';

export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  message.success(<span>Copied</span>);
};
