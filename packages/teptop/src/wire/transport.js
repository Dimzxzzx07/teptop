export const send = (transport, data) => transport.send(JSON.stringify(data)); export const receive = value => JSON.parse(value);
