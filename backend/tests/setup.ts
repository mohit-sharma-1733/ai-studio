import db from '../src/database';

afterEach(() => {
  db.exec('DELETE FROM generations; DELETE FROM users;');
});

afterAll(() => {
  db.close();
});
