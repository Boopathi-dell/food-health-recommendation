import React from "react";

function UserTable() {
  return (
    <div>
      <h2>User Management</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* User data will be displayed here */}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
