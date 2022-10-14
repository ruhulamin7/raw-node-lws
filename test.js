const user = {
  name: 'John',
  age: 36,
  languages: {
    bangla: 'Native',
    english: 'Secondary',
  },
};

const user2 = { name: 'Amin' };
user2.name = 'Ruhul';

console.log(user.toString() === user2.toString());
