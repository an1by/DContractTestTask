import 'dotenv/config';
import Client from './common/Client';
import Sheet from './common/Sheet';

const main = async () => {
  const client = new Client('an1by');
  await client.auth();
  const clients = await client.getAllClients();

  const sheet = new Sheet();
  await sheet.init();
  await sheet.fillSheet(clients);
};

main().catch(e => console.log(e));