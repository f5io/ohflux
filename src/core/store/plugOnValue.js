let plugOnValue = ([ pool, store, combined ]) => {
  combined.map(state => pool.plug(state));
  return [ pool, store ];
};

export default plugOnValue;
