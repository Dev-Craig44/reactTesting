import { User } from "../entities";

const UserAccount = ({ user }: { user: User }) => {
  // queryByRole
  // expect().not.toBeInTheDocument()
  return (
    <>
      <h2>User Profile</h2>
      {user.isAdmin && <button>Edit</button>}
      <div>
        <strong>Name:</strong> {user.name}
      </div>
    </>
  );
};

export default UserAccount;
