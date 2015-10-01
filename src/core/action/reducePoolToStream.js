let reducePoolToStream = ([ options, pool ]) => [ options.reduce(pool), pool, options ];

export default reducePoolToStream;
