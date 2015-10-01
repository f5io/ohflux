export default function undefinedToMirror([k, v]) {
	if (!v) v = k;
	return [k, v];
}
