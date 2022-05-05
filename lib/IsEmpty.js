// id is mendatory feild so object is empty id no 

function IsEmpty(object) {
  for (const id in object) {
    return false;
  }
  return true;
}

export default IsEmpty;
