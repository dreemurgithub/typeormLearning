const {pool} = require('./index')

const startSessionTable = async() =>{
    const client = await pool.connect();

  // users_session exists?
  const querySession = `SELECT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'user_sessions'
        );`;

  const sessionExist = await pool.query(querySession);

  if (!sessionExist.rows[0].exists) {
    const createSessionTable = `CREATE TABLE user_sessions (sid varchar NOT NULL COLLATE "default",
     sess json NOT NULL, expire timestamp(6) NOT NULL );`;
    const addConstrant = `ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_sid_unique UNIQUE (sid);`;
    //  error: there is no unique or exclusion constraint matching the ON CONFLICT specification => addCONSTRAINT fix this
    await pool.query(createSessionTable);
    await pool.query(addConstrant);
  }

  client.release();
}

module.exports = startSessionTable