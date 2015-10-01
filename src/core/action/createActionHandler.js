let createActionHandler = ([ stream, pool, options ]) => [ v => pool.plug(v), stream, options ];

export default createActionHandler;
