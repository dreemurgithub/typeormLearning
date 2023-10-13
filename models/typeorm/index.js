// model have a data type
// Success: Boolean
// Data: Send to users
// Helper query => Model determine true/false => Controller send 200/400

// update+delete => { generatedMaps?: [], raw: [], affected: 1 }, affected: 0 => error
// add(newUser) - return will return a newUser if there is no null

const result = await UdateOneUserOrm(userInfor);
  if (result.success) res.status(200).send(result.data);
  else res.status(400).send({ message: result.message });