export default function connect(Store, modifier = x => x) {
  return {
    getInitialState() {
      let state;
      let fn = s => state = s;
      modifier(Store).onValue(fn).offValue(fn);
      return state;
    },
    componentDidMount() {
      this._storeStream = modifier(Store);
      this._storeStreamHandler = state => this.setState(state);
      this._storeStream.onValue(this._storeStreamHandler);
    },
    componentWillUnmount() {
      this._storeStream.offValue(this._storeStreamHandler);
    }
  }
}
