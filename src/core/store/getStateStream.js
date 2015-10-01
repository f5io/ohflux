import { of } from 'fnutil/observable';

let getStateStream = ([ store, state ]) => [ of(state), store ];

export default getStateStream;
