import { inherit } from '../utils';

let inheritStreamProto = ([ action, stream, options ]) => [ inherit(stream, action), options ];

export default inheritStreamProto;
