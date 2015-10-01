import isFunction from './isFunction';

export default function inherit(stream, obj) {
	let proto = Object.create(stream.__proto__);
	for (let fn in proto) {
		obj[fn] = isFunction(proto[fn]) ? proto[fn].bind(stream) : proto[fn];
	}
	return obj;
}
