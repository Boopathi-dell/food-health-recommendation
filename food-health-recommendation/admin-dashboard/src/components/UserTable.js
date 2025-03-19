import React from "react";

const UserTable = ({ users, toggleUserStatus, deleteUser }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className={user.isActive ? "text-success fw-bold" : "text-danger fw-bold"}>
                  {user.isActive ? "Active" : "Disabled"}
                </td>
                <td>
                <button
  className={`btn btn-${user.isActive ? "warning" : "success"} mx-2`}
  onClick={() => toggleUserStatus(user._id, user.isActive)} // Pass user ID & status
>
  {user.isActive ? "Disable" : "Enable"}
</button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
