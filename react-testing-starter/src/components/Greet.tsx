// 11.) Make the name prop optional so we can test the no name scenario without a typescript error
const Greet = ({ name }: { name?: string }) => {
  if (name) return <h1>Hello {name}</h1>;

  return <button>Login</button>;
};

export default Greet;
